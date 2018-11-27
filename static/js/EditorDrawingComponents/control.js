function Control(parent, control, parentEffect)
{
  this.parent = parent;

  this.name = control.name;
  if(control.type != null)
  {
	  this.type = control.type;
  }
  else
  {
	  this.type = "Norm";
  }

  this.parentEffect = parentEffect;
  var symbolGroup;
  var editorFormGroup = $('#effectEditorForm');

  this.symbol = {"location":{}, "body":["M 25,-15 L 25,-25","0,0 25,-15 50,0 50,50 0,50"],"graphic":"","color":"#0000FF","labels":{}};

  if(control.x)
  {
	  this.symbol.location.x = control.x;
  }
  else
	{
	  this.symbol.location.x = control.symbol.location.x;
	}

  if(control.y)
  {
	  this.symbol.location.y = control.y;
  }
  else
	{
	  this.symbol.location.y = control.symbol.location.y;
	}




  // this only creates the SVG group for encapsulating the symbol SVG parts
  var symbolData = {"name":this.name,"type":"control","x":this.symbol.location.x,"y":this.symbol.location.y};

  symbolGroup = this.parent  // create SVG components
  .append("g")
  .attr("id",function(){
    return symbolData.name;
  })
  .attr("controlType",function(){return symbolData.type;})
  .attr("dragy", function(){
    return symbolData.y;
  })
  .attr("dragx", function(){
    return symbolData.x;
  })
  .attr("transform", function(){
    return "translate("+symbolData.x+","+symbolData.y+")";
  })
  .on("mousedown", function(evt){
      var evt = d3.event;

      effectDrawingAreaMouseDown(evt);
  })
  .on("dblclick", function(){
    var evt = d3.event;
    var targetControl = evt.currentTarget;
    deleteControl(targetControl);
  }).on('contextmenu', function(){
        var evt = d3.event;
        evt.preventDefault();
  }, false);

  this.symbolBody = new Symbol(symbolGroup, this, this.symbol.body, this.symbol.graphic, this.symbol.color, this.symbol.location.x, this.symbol.location.y, this.symbol.labels);


  this.output = new Connector(symbolGroup, this.name, "output", "output",25, -25);

  this.paramControlType = new ParameterControlType(editorFormGroup, this);

  this.controlParameterMap = {};


  if(control.controlParameterArray != null )
  {
	  for(var paramIndex = 0; paramIndex < control.controlParameterArray.length; paramIndex++)
	  {
	    var param = new ControlParameter(editorFormGroup, control.controlParameterArray[paramIndex], this);

	    this.controlParameterMap[control.controlParameterArray[paramIndex].name] = param;
	  }
  }
  else
  {
	  var paramData = {"name":"parameter","alias":"parameter","abbr":"prm","type":0, "value":0};
      this.controlParameterMap["parameter"] =
      	new ControlParameter(editorFormGroup, paramData, this);

  }


}



Control.prototype.setLocation = function(x,y)
{
  this.symbolBody.x = x;

  this.symbolBody.y = y;
  var element = document.getElementById(this.name);
  element.setAttribute("dragx", x);
  element.setAttribute("dragy", y);

  element.setAttribute("transform", "translate(" + x + "," + y + ")");
}

Control.prototype.getLocation = function()
{
  var location = {};
  location.x = this.symbolBody.x;
  location.y = this.symbolBody.y;
  return location;
}



Control.prototype.draw = function()
{

  var normGraphic = ["M 15,25 A 10,10 0 0,0 35,25 M 15,25 A 10,10 0 1,1 35,25","M 25,25 L 15,35"];
  var envGraphic = ["M 10,10 L 10,40 L 40,40","M 12,38 L 24,18 L 38,38"];
  var lfoGraphic = ["M 8,12 L 8,38","M 8,26 L 46,26","M 8,26 C 23,-10 30,62 46,26"];

  if(this.symbolBody)
  {
	  if(this.type == "Norm")
		{
			this.symbolBody.draw(normGraphic);
		}

	  else if(this.type == "Env")
		{
			this.symbolBody.draw(envGraphic);
		}

	  else if(this.type == "LFO")
		{
			this.symbolBody.draw(lfoGraphic);
		}

  }

  for(var paramKey in this.paramMap)
  {
    this.paramMap[paramKey].draw();
  }

    this.output.draw();
}


Control.prototype.erase = function()
{

  this.symbolBody.erase();


    this.output.erase();

}

Control.prototype.getControlData = function()
{
	var controlDataMap = {};

	controlDataMap.name = this.name;
	controlDataMap.type = this.type;
	controlDataMap.symbol = {};
	controlDataMap.symbol.location = this.getLocation();
	controlDataMap.parentEffect = this.parentEffect;

  controlDataMap.symbol.graphic = this.symbol.graphic;
  controlDataMap.symbol.labels = this.symbol.labels;
  controlDataMap.symbol.color = this.symbol.color;


  controlDataMap.controlParameterArray = new Array;

  {
	  for(var controlParameterKey in this.controlParameterMap)
	  {
	      var controlParameter = {"name":this.controlParameterMap[controlParameterKey].name,
	    		  "abbr":this.controlParameterMap[controlParameterKey].abbr,
	    	        "alias":this.controlParameterMap[controlParameterKey].alias,
	    	        "value":this.controlParameterMap[controlParameterKey].value,
	    	        "type":this.controlParameterMap[controlParameterKey].type};

	      controlDataMap.controlParameterArray.push(controlParameter);
	  }
  }

  return controlDataMap;

}

function addControl(jsonControlData)
{

  var control = new Control(effectDrawingAreaSvg[combo.effectMap[combo.currentEffect].index], jsonControlData, combo.currentEffect);
  combo.effectMap[combo.currentEffect].effectControlMap[control.name] = control;
  controlCount++;
  combo.effectMap[combo.currentEffect].effectControlMap[control.name].draw();
}


function deleteControl(target)
{
  var svgObject = target.farthestViewportElement;
  var svgChildNodes = svgObject.childNodes;

  var control = target;
  var name = target.id;
  var controlType = name.split('_')[0];
  var capControlType = controlType.charAt(0).toUpperCase() + controlType.slice(1);
  // delete connected wires before deleting control
  for(var controlConnectionKey in combo.effectMap[combo.currentEffect].effectControlConnectionMap)
  {
    var connectionKeyParse = controlConnectionKey.split('>');
    connectionKeyParse[0] = connectionKeyParse[0].split(':');
    connectionKeyParse[1] = connectionKeyParse[1].split(':');
    var connSrcControl = connectionKeyParse[0][0];
    var connSrcPort = connectionKeyParse[0][1];
    var connDestControl = connectionKeyParse[1][0];
    var connDestPort = connectionKeyParse[1][1];
    var svgIndex = combo.effectMap[combo.currentEffect].index;
    {
      // delete wires connected to inputs
      if(connDestControl == name)
      {
        var targetConnection = document.getElementById(controlConnectionKey);
        deleteControlConnection(svgIndex, targetConnection);
      }
      // delete wires connected to outputs
      if(connSrcControl == name)
      {
        var targetConnection = document.getElementById(controlConnectionKey);
        deleteControlConnection(svgIndex, targetConnection);
      }
    }
  }

  var type = combo.effectMap[combo.currentEffect].effectControlMap[control.id].type;
  delete combo.effectMap[combo.currentEffect].effectControlMap[control.id];
  control.remove();
  controlCount--;
  updateEffectEditorArea(combo.effectMap[combo.currentEffect]);

}

function updateControlMap()
{
  for(var i = 0; i < controlArray.length; i++)
  {

    controlMap[controlArray[i].name] = controlArray[i];

  }
}
