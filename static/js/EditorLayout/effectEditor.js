function getParameterValueString(valueIndex, paramType)
{
    var value;

    switch(paramType)
    {
        case 0:
            value = amp[valueIndex];
            break;
        case 1:
            value = filterFreq[valueIndex];
            break;
        case 2:
            value = delayTime[valueIndex];
            break;
        case 3:
            value = envTime[valueIndex];
            break;
        case 4:
            value = lfoFreq[valueIndex];
            break;
        case 5:
            value = lfoAmp[valueIndex];
            break;
        case 6:
            value = lfoOffset[valueIndex];
            break;
        default:;
    }

    return value;
}



function updateEffectEditorParameter(evt)
{
    var target = evt.currentTarget;
    var eventType = evt.type;
    var key = target.id;
    var key = key.split(':');
    var value;

    if (eventType == "click") // update combo parameter
    {
        currentCombo = key[2];
    }
    else
    {
    	var controlName;
    	var processName;
    	var paramType;

    	if(key[0].indexOf("control") >= 0)
    	{
            combo.effectMap[combo.currentEffect].effectControlMap[key[0]].controlParameterMap[key[1]].update(target.value);
            controlName = key[0];
            paramType = parseInt(combo.effectMap[combo.currentEffect].effectControlMap[key[0]].controlParameterMap[key[1]].type)
    	}
    	else
    	{
            combo.effectMap[combo.currentEffect].effectProcessMap[key[0]].paramMap[key[1]].update(target.value);
            processName = key[0];
            paramType = parseInt(combo.effectMap[combo.currentEffect].effectProcessMap[key[0]].paramMap[key[1]].type);
    	}
        var paramName = key[1];
        var valueIndex = parseInt(target.value);

        value = getParameterValueString(valueIndex, paramType);

        var valueId = key[0]+':'+key[1]+":value";

        $(document.getElementById(valueId)).val(value); // jquery uses colons, so basic DOM had to be used here
        var csrftoken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {  // setup CSRF token in request header
                if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    	if(key[0].indexOf("control") >= 0)
    	{
			var jsonData = {"control":controlName,"parameter":paramName,"value":target.value};
            $.ajax({type: 'POST', url: 'changeValue', data: JSON.stringify(jsonData), dataType: "json"})
            .success(function (data, status) {
            });
            newParameterValue.parentName = controlName;
            newParameterValue.parameterName = paramName;p
            newParameterValue.parameterValue = target.value;
    	}
    	else
    	{
			var jsonData = {"process":processName,"parameter":paramName,"value":target.value};
            $.ajax({type: 'POST', url: 'changeValue', data: JSON.stringify(jsonData), dataType: "json"})
            .success(function (data, status) {
            });
            newParameterValue.parentName = processName;
            newParameterValue.parameterName = paramName;
            newParameterValue.parameterValue = target.value;
    	}
    }
}

function updateEffectEditorForm(formData)
{
// clear old child nodes  in effectEditorForm first
    $('#effectEditorForm').empty();

    var formDataKeys = Object.keys(formData);
    var formDataSize = formDataKeys.length;
    if (formDataSize > 2)// formData is process data
    {

        var form = $('#effectEditorForm');
        form.append($('<br>'));
        if(formData.name.indexOf("control") >= 0)
        {

            var control = formData;
            control.paramControlType.draw();

            form.append($('<div>')
                    .attr({"id": "effectEditorFormHeader",
                        "class": "row"}
                    )
                    .append($('<div>').attr({"id": "paramTitle", "class": "col-md-2"})
                            .text("Title"))
                    .append($('<div>').attr({"id": "paramSlider", "class": "col-md-1"})
                            .text("-"))
                    .append($('<div>').attr({"id": "paramSlider", "class": "col-md-2"})
                            .text("Slider"))
                    .append($('<div>').attr({"id": "paramSlider", "class": "col-md-1"})
                            .text("+"))
                    .append($('<div>').attr({"id": "paramValue", "class": "col-md-1"})
                            .text("Value"))
                    .append($('<div>').attr({"class": "col-md-2"})
                            .text("Pedal UI Alias"))
                    .append($('<div>').attr({"class": "col-md-2"})
                            .text("Pedal UI Abbr."))


                    );

            // create new child nodes
            for (var controlParameterKey in control.controlParameterMap)
            {
                control.controlParameterMap[controlParameterKey].draw(form);
            }
       }
        else
        {
            var process = formData;
            process.footswitch.draw();


            form.append($('<div>')
                    .attr({"id": "effectEditorFormHeader",
                        "class": "row"}
                    )
                    .append($('<div>').attr({"id": "paramTitle", "class": "col-md-2"})
                            .text("Title"))
                    .append($('<div>').attr({"id": "paramSlider", "class": "col-md-2"})
                            .text("Slider"))
                    )
                    .css("overflow-y","auto")
                    .css("overflow-x","hidden")
                    .css("height", "200px");

            // create new child nodes
            for (var paramKey in process.paramMap)
            {
                process.paramMap[paramKey].draw(form);
            }
        }
    }
}

function updateEffectEditorArea(effect)
{

    var effectEditorTabGroupDiv = $('#effectEditorTabGroupDiv');
    var effectEditorForm = $('#effectEditorForm');
    // update combo tab
    effectEditorTabGroupDiv.empty();
    effectEditorTabGroupDiv

            .append($('<li>')
                    .attr({"display": "inline-block","style":"border:5px"})
                    .append($('<a>').attr({"href": "#", "id": "addParamControl"})
                            .text("Add Parameter Controller")));


    $('#addParamControl').click(function (evt) {
    	addParamControlClick(evt);
    });
    var numberOfProcesses = 0;
    // update process tabs
    updateEffectEditorForm({"effect_name": effect.name});
}


function effectEditorInit()
{
    var effectEditorTabGroupDiv = document.getElementById("effectEditorTabGroupDiv");

    var effectEditorTabGroup = document.getElementById("effectEditorTabGroup");

    var effectEditorForm = document.getElementById("effectEditorForm");


    updateEffectEditorForm({"name": ""});
    updateEffectEditorArea({"name": ""});


}
