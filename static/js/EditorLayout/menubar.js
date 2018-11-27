function arrayToMap(array)
{
	newMap = {};

	for(var index = 0; index < array.length; index++)
	{
		newMap[array[index].name] = array[index];
	}

	return newMap;
}

var maxTotalCpuPowerAllowed = 70;
function updateCpuPowerRequired(value)
{
	totalCpuPowerRequired = 50;

	$('#cpuPowerRequirementIndicator').val(totalCpuPowerRequired);
	$('#cpuPowerRequirementValue').text("Cpu Power Required: " + totalCpuPowerRequired);

	$('#cpuPowerRequirementIndicatorDiv').css("background-color","white");

}

function resetCpuPowerRequired(value)
{
	totalCpuPowerRequired = 0;
	$('#cpuPowerRequirementIndicator').val(totalCpuPowerRequired);
}


function newCombo()
{
	for(var i = 0; i < 3; i++)
	{
		effectDrawingAreaSvg[i].selectAll("*").remove();
	}
	controlCount = 0;
    currentCombo = "";
	var blankComboJson = {"name":"new",
		"effectArray": [
				{
					"index":0,
					"name": "effect0",
					"abbr": "fx0",
					"processArray": [],
					"connectionArray": []
				},
				{
					"index":1,
					"name": "effect1",
					"abbr": "fx1",
					"processArray": [],
					"connectionArray": []
				}
		],
		"effectConnectionArray":[
			{
	            "srcEffect": "system",
	            "srcPort": "capture_1",
	            "destEffect": "(effect0)",
	            "destPort": "input1"
	        },
	        {
	            "srcEffect": "system",
	            "srcPort": "capture_2",
	            "destEffect": "(effect0)",
	            "destPort": "input2"
	        },
			{
	            "srcEffect": "(effect0)",
	            "srcPort": "output1",
	            "destEffect": "(effect1)",
	            "destPort": "input1"
	        },
	        {
	            "srcEffect": "(effect0)",
	            "srcPort": "output2",
	            "destEffect": "(effect1)",
	            "destPort": "input2"
	        },
			{
	            "srcEffect": "(effect1)",
	            "srcPort": "output1",
	            "destEffect": "system",
	            "destPort": "playback_1"
	        },
	        {
	            "srcEffect": "(effect1)",
	            "srcPort": "output2",
	            "destEffect": "system",
	            "destPort": "playback_2"
	        }

		]
	};
	combo = new Combo(blankComboJson);
	combo.load();
  resetProcessTypeCount();
  console.log(JSON.stringify(processTypeCount));
}

function getCombo(comboName)
{
    var ajaxUrlString = 'getCombo/' + comboName;
    resetCpuPowerRequired();
	suspendUpdates = 1;
    $.ajax({type: 'GET', url: ajaxUrlString, dataType: "json"}).success(function (data, status) {
        var dummy = data;
        controlCount = 0;
		for(var i = 0; i < 3; i++)
		{
        	var allSvg = effectDrawingAreaSvg[i].selectAll("*");
        	allSvg.remove();
		}
		var comboData = data;
        combo = new Combo(comboData);
		combo.load();
		suspendUpdates = 0;
    }).error(function (ts) {
        console.log("Error");
        console.log(ts.responseText);
    });
}

function saveCombo()
{
    if (currentCombo != "")
    {
        var csrftoken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {  // setup CSRF token in request header
                if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        var comboString = JSON.stringify(combo.getComboData());
        console.log(comboString);
		suspendUpdates = 1;

        $.ajax({type: 'POST', url: 'saveCombo', data: comboString, dataType: "json"}).success(function (data, status) {
            updateComboList(data);
			suspendUpdates = 0;

        }).error(function (ts) {
	        console.log("Error");
	        console.log(ts.responseText);
	    });
    }
    else
    {
        alert("Please type in combo name and press apply");
    }
}

function deleteCombo()
{
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {  // setup CSRF token in request header
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

		suspendUpdates = 1;
    $.ajax({type: 'DELETE', url: 'deleteCombo/' + currentCombo, dataType: "json"}).success(function (data, status) {
        updateComboList(data);
		suspendUpdates = 0;

    }).error(function (ts) {
        console.log("Error");
        console.log(ts.responseText);
    });
}

function updateComboList(combos)
{
    $('#comboMenu').empty();
    $.each(combos, function (index, combo_list) {
        $('#comboMenu')
                .append($('<li>')
                        .append($('<a>')
                                .attr({'id':combo_list.name})
                                .text(combo_list.name)));
        $('#'+combo_list.name).click(function(){getCombo(combo_list.name);});
    });
}

function getComboList()
{
	suspendUpdates = 1;

    $.ajax({url: 'listCombos', dataType: "json"}).success(function (data, status) {
        $('#comboMenu').empty();
        $.each(data, function (index, combo_list) {
            $('#comboMenu')
                    .append($('<li>')
                            .append($('<a>')
                                    .attr({'id':combo_list.name})
                                    .text(combo_list.name)));
            $('#'+combo_list.name).click(function(){getCombo(combo_list.name);});
        });
		suspendUpdates = 0;

    }).error(function (ts) {
        console.log("Error");
        console.log(ts.responseText);
    });
}

function initMenubar()
{
    getComboList();
    resetProcessTypeCount();

	$('#cpuPowerRequirementIndicatorDiv').attr({"class":"col-md-4"})
	.append($('<label>')
			.attr({"for": "cpuPowerRequirementIndicator",
				"id": "cpuPowerRequirementValue"})
			.text("Cpu Power Required: "))
			.append($('<div>')
			.append($('<input>')
					.attr({"id": "cpuPowerRequirementIndicator",
						"type": "range",
						"value": 10,
						"name": "cpuPowerRequirementIndicator",
						"min": 0,
						"max": 100,
					})));
	$('#cpuPowerRequirementIndicator').val(0);

}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
}
