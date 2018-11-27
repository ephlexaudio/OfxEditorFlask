
function Combo(comboData)
{


    this.effectMap = {};
    this.effectConnectionMap = {};
    this.effectControlMap = {};
    this.effectControlConnectionMap = {};
    this.effectArray = comboData.effectArray;
    this.effectConnectionArray = comboData.effectConnectionArray;
    currentCombo = comboData.name;
    this.currentEffect = this.effectArray[0].name;
    this.name = currentCombo;
    console.log(currentCombo);
    // create objects
    for (var effectIndex = 0; effectIndex < this.effectArray.length; effectIndex++)
    {
    	for(var i = 0; i < this.effectArray.length; i++)
    	{
    		if(this.effectArray[i].index == effectIndex)
    		{
                var jsonEffectData = this.effectArray[i];
                var effect = new Effect(effectDrawingAreaSvg[effectIndex], jsonEffectData.index, jsonEffectData);
                this.effectMap[effect.name] = effect;
    		}
    	}
    }
    for (var effectConnectionIndex = 0; effectConnectionIndex < this.effectConnectionArray.length; effectConnectionIndex++)
    {
        var jsonEffectConnectionData = this.effectConnectionArray[effectConnectionIndex];
        var src = {"effect":jsonEffectConnectionData.srcEffect,"port":jsonEffectConnectionData.srcPort};
        var dest = {"effect":jsonEffectConnectionData.destEffect,"port":jsonEffectConnectionData.destPort};
        var cord = new Cord(null, src, dest, currentCombo);
        this.effectConnectionMap[cord.name] = cord;
    }


}

Combo.prototype.load = function()
{
    var effectName = Object.keys(this.effectMap)[0];

    updateEffectEditorArea(this.effectMap[effectName]);

    var effectDrawingAreaTabGroupDiv = $('#effectDrawingAreaTabGroupDiv');
    var effectDrawingAreaTabGroupUL = $('#effectDrawingAreaTabGroupUL');


    effectDrawingAreaTabGroupUL.empty();
    effectDrawingAreaTabGroupUL
            .append($('<li>')
                    .attr({"display": "inline-block"})
                    .attr({"class": "active"})
                    .append($('<a>').attr({"href": "#", "id": "comboHeader"})
                            .text(this.name)));

	$('#comboHeader').on("mousedown", function (evt) {
		if(evt.which == 1)
		{
			$('#comboDrawingAreaCanvas').css("display","block");
			$('#comboDrawingAreaCanvas').css("visibility","visible");

			for(i = 0; i < 3; i++)
			{
				var svgNameString = '#effectDrawingAreaSvg_'+i;
				$(svgNameString).css("visibility","hidden");
				$(svgNameString).css("display","none");
			}
			updateEffectEditorForm({"combo_name":currentCombo});

		}
		else if(evt.which == 3)
		{
			showComboTabEditor(evt);
		}
	}).on('contextmenu', function(){
		var evt = d3.event;
		evt.preventDefault();
	}, false);


    $.each(combo.effectMap, function(index, effect)
    {
        updateEffectDrawingArea(effect);
        var effectKey = effect.name;
        effectDrawingAreaTabGroupUL
                .append($('<li>')
                        .attr({"display": "inline-block", "style": "float:left"})
                        .append($('<a>').attr({"href": "#", "id": "effectArea_"+effect.index})
                                .text(effectKey)));
        var effectKeyLink = '#effectArea_'+effect.index;

		$(effectKeyLink).on("mousedown", function (evt) {
			if(evt.which == 1)
			{
				combo.currentEffect = evt.currentTarget.text;
				$("li").removeClass("active");
				$(this.parentNode).addClass("active");
				var effect = combo.effectMap[combo.currentEffect];
				$('#comboDrawingAreaCanvas').css("visibility","hidden");
				$('#comboDrawingAreaCanvas').css("display","none");
				$('#comboHeaderName').val(combo.currentCombo);

				for(i = 0; i < 3; i++)
				{
					var svgNameString = '#effectDrawingAreaSvg_'+i;
					if(effect.index == i)
					{
						$(svgNameString).css("visibility","visible");
						$(svgNameString).css("display","block");
					}
					else
					{
						$(svgNameString).css("visibility","hidden");
						$(svgNameString).css("display","none");

					}
				}
				updateEffectEditorArea(effect);
			}
			else if(evt.which == 3)
			{
				showEffectTabEditor(evt);

			}
		}).on('contextmenu', function(){
			var evt = d3.event;
			evt.preventDefault();
		}, false);
    });

    $('#effectArea_0').trigger('click');

}

Combo.prototype.getComboData = function()
{
    var comboDataMap = {};
    comboDataError = false;
    comboDataMap.name = currentCombo;

    comboDataMap.effectArray = new Array;
    for (var effectKey in this.effectMap)
    {
        var sendEffect = this.effectMap[effectKey].getEffectData();
        comboDataMap.effectArray.push(sendEffect);
    }

    comboDataMap.effectConnectionArray = new Array;
    for (var connectionKey in this.effectConnectionMap)
    {
        var sendEffectConnection = this.effectConnectionMap[connectionKey].getCordData();
        comboDataMap.effectConnectionArray.push(sendEffectConnection);
    }

    return comboDataMap;

}

function showEffectTabEditor(evt)
{

	effectIndex = evt.currentTarget.id.split("_")[1];
	console.log("right clicked on " + effectIndex + " tab");

	//***** save old name and get new name ******
	var oldName = evt.currentTarget.text;
	var oldAbbr = combo.effectMap[oldName].abbr;
	$('#oldEffectName').val(oldName);
	$('#newEffectName').val(oldName);

	$('#oldEffectAbbr').val(oldAbbr);
	$('#newEffectAbbr').val(oldAbbr);
	$('#comboTabEditor').css("display","none");

    $('#effectDrawingAreaCanvas').css("display","none");

	$('#effectTabEditor').css("display","block");

}

function hideEffectTabEditor()
{
	$('#comboTabEditor').css("display","none");
	$('#effectTabEditor').css("display","none");
	$('#effectDrawingAreaCanvas').css("display","block");
}

function changeEffectNameAbbr(evt)
{
	console.log("right clicked on " + effectIndex + " tab");

	//***** save old name and get new name ******
	var oldName = $('#oldEffectName').val();
	var newName = $('#newEffectName').val();
	var oldAbbr = $('#oldEffectAbbr').val();
	var newAbbr = $('#newEffectAbbr').val();
	combo.currentEffect = newName;


	console.log("old name: " + $('#oldEffectName').val());
	console.log("new name: " + $('#newEffectName').val());
	//******* change name by creating new Effect and deleting old Effect ******
	var tempEffectParams = combo.effectMap[oldName].getEffectData();
	combo.effectMap[oldName].update({"abbr":newAbbr});
	combo.effectMap[oldName].update({"name":newName});

	for(var key in tempEffectParams.processArray)
	{
		tempEffectParams.processArray[key].parentEffect.name = combo.currentEffect;
	}

	tempEffectParams.name = combo.currentEffect;
	tempEffectParams.abbr = newAbbr;
	effectDrawingAreaSvg[effectIndex].selectAll("*").remove();
	$('#effectArea_'+effectIndex).text(combo.currentEffect);
	deleteEffect(oldName);
	combo.effectMap[combo.currentEffect] = new Effect(effectDrawingAreaSvg[effectIndex], effectIndex, tempEffectParams);
	combo.effectMap[combo.currentEffect].draw();

	//****** replace cords with old effect name ***********
	for(var cordKey in combo.effectConnectionMap)
	{
		var tempCordParams = combo.effectConnectionMap[cordKey].getCordData();
		var tempCordName = tempCordParams.srcEffect+':'+tempCordParams.srcPort+'>'
		+tempCordParams.destEffect+':'+tempCordParams.destPort;
		var oldNameParenthesis = "("+oldName+")";
		var currentEffectParenthesis = "("+combo.currentEffect+")"

		if(tempCordParams.srcEffect == oldNameParenthesis)
		{
			tempCordParams.srcEffect = currentEffectParenthesis;
			delete combo.effectConnectionMap[tempCordName];
			var src = {"effect":tempCordParams.srcEffect,"port":tempCordParams.srcPort};
			var dest = {"effect":tempCordParams.destEffect,"port":tempCordParams.destPort};

			var cord = new Cord(null, src, dest, currentCombo);
			combo.effectConnectionMap[cord.name] = cord;
		}
		else if(tempCordParams.destEffect == oldNameParenthesis)
		{
			tempCordParams.destEffect = currentEffectParenthesis;
			delete combo.effectConnectionMap[tempCordName];
			var src = {"effect":tempCordParams.srcEffect,"port":tempCordParams.srcPort};
			var dest = {"effect":tempCordParams.destEffect,"port":tempCordParams.destPort};
			var cord = new Cord(null, src, dest, currentCombo);
			combo.effectConnectionMap[cord.name] = cord;
		}
	}
	hideEffectTabEditor();
}

function showComboTabEditor(evt)
{

	console.log("right clicked on Combo tab");

	//***** save old name and get new name ******
	var oldName = evt.currentTarget.text;
	$('#oldComboName').val(oldName);
	$('#newComboName').val(oldName);
    $('#effectDrawingAreaCanvas').css("display","none");

	$('#effectTabEditor').css("display","none");
	$('#effectEditorParameters').css("display","none");
	$('#comboTabEditor').css("display","block");

}

function hideComboTabEditor()
{
	$('#comboTabEditor').css("display","none");
	$('#effectTabEditor').css("display","none");
	$('#effectDrawingAreaCanvas').css("display","block");
}

function changeComboName()
{
	//***** save old name and get new name ******
	var oldName = $('#oldComboName').val();
	var newName = $('#newComboName').val();
	currentCombo = newName;

	console.log("old name: " + $('#oldEffectName').val());
	console.log("new name: " + $('#newEffectName').val());

	combo.name = currentCombo;
	$('#comboHeader').text(combo.name);
	hideComboTabEditor();
}
