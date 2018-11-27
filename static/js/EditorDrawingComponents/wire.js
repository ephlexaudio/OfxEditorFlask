function Wire(parent, src, dest, parentEffect)
{
  this.parent = parent;
  this.src = src;
  this.dest = dest;
  this.mid = {"x":src.x, "y":dest.y};
  this.parentEffect = parentEffect;

  this.xmid = this.mid.x;
  this.ymid = this.mid.y;

  var srcProcess;
  var destProcess;

  if(this.src.effect)
	{
	  srcProcess = "("+this.parentEffect.name+")";
	  if(this.src.effect != srcProcess) this.src.effect = srcProcess;
	}

  else srcProcess = this.src.process;
  if(this.dest.effect)
	{
	  	destProcess = "("+this.parentEffect.name+")";
		if(this.dest.effect != destProcess) this.dest.effect = destProcess;
	}
  else destProcess = this.dest.process;

  this.name = srcProcess+':'+this.src.port+'>'+destProcess+':'+this.dest.port;

  if(this.src.effect)
  {
      this.x1 = effectIO[this.parentEffect.index].inputMap[this.src.port].x;
      this.y1 = effectIO[this.parentEffect.index].inputMap[this.src.port].y;
  }
  else
  {
      this.x1 = this.parentEffect.effectProcessMap[this.src.process].outputMap[this.src.port].x
                + this.parentEffect.effectProcessMap[this.src.process].symbol.location.x;
      this.y1 = this.parentEffect.effectProcessMap[this.src.process].outputMap[this.src.port].y
                + this.parentEffect.effectProcessMap[this.src.process].symbol.location.y;
  }

    if(this.dest.effect)
    {
        this.x2 = effectIO[this.parentEffect.index].outputMap[this.dest.port].x;
        this.y2 = effectIO[this.parentEffect.index].outputMap[this.dest.port].y;
    }
    else
    {
        this.x2 = this.parentEffect.effectProcessMap[this.dest.process].inputMap[this.dest.port].x
                  + this.parentEffect.effectProcessMap[this.dest.process].symbol.location.x;
        this.y2 = this.parentEffect.effectProcessMap[this.dest.process].inputMap[this.dest.port].y
                  + this.parentEffect.effectProcessMap[this.dest.process].symbol.location.y;
    }
}

Wire.prototype.setSrcLocation = function(x,y)
{
  this.x1 = x;
  this.y1 = y;

}

Wire.prototype.setDestLocation = function(x,y)
{
  this.x2 = x;
  this.y2 = y;
}

Wire.prototype.draw = function()
{
  var srcProcessData;
  var srcPointData;
  var destProcessData;
  var destPointData;
  var srcDirection;
  var destDirection;

  if(this.src.effect)
  {
      srcPointData = {"base":{"x":this.x1, "y":this.y1}, "offset":{"x":0,"y":0}};
  }
  else
  {
      srcProcessData = this.parentEffect.effectProcessMap[this.src.process];
      srcPointData = {"base":srcProcessData.getLocation(), "offset":srcProcessData.outputMap[this.src.port]};
  }

  if(this.dest.effect)
  {
      destPointData = {"base":{"x":this.x2, "y":this.y2}, "offset":{"x":0,"y":0}};
  }
  else
  {
      destProcessData = this.parentEffect.effectProcessMap[this.dest.process];
      destPointData = {"base":destProcessData.getLocation(), "offset":destProcessData.inputMap[this.dest.port]};
  }

  var lineData = {"src":srcPointData,"dest":destPointData};
  var wireIdString = this.name;

  var svgValue = this.parent[0][0];
  var svgValueId = svgValue.id;
  var svgIndex = parseInt(svgValueId.split("_")[1]);

  if(this.src.process)
	{
	  srcDirection = this.parentEffect.effectProcessMap[this.src.process].processDirection;
	}
  else srcDirection = "normal";

  if(this.dest.process)
	{
	  destDirection   = this.parentEffect.effectProcessMap[this.dest.process].processDirection;
	}
  else destDirection = "normal";

  var x1Data;
  var y1Data;
  var x2Data;
  var y2Data;


  if(srcDirection == "normal")
  {
  	x1Data = lineData.src.base.x + lineData.src.offset.x;
  }
  else
  {
  	x1Data = lineData.src.base.x + lineData.src.offset.x - 90;
  }
  y1Data = lineData.src.base.y + lineData.src.offset.y;

  if(destDirection == "normal")
  {
  	x2Data = lineData.dest.base.x + lineData.dest.offset.x;
  }
  else
  {
  	x2Data = lineData.dest.base.x + lineData.dest.offset.x + 90;
  }
  y2Data = lineData.dest.base.y + lineData.dest.offset.y;

  var radians = -Math.abs(Math.atan((y1Data-y2Data)/(x2Data-x1Data)));
  var xPolarity;
  var yPolarity;
  if(x2Data>=x1Data) xPolarity = 1;
  else if(x2Data<x1Data) xPolarity = -1;
  if(y2Data>=y1Data) yPolarity = -1;
  else if(y2Data<y1Data) yPolarity = 1;

  var procConnection = effectDrawingAreaSvg[svgIndex]  // create SVG process connection groups
  .append("line")
  .attr("id", function(){
    return wireIdString;
  })
  .attr("x1", function(){
	  var x1Temp = x1Data+4*xPolarity*(Math.cos(radians));
    return x1Temp;
  })
  .attr("y1", function(){
	  var y1Temp = y1Data+4*yPolarity*(Math.sin(radians));
    return y1Temp;
  })
  .attr("x2", function(){
	  var x2Temp = x2Data-4*xPolarity*(Math.cos(radians));
	  return x2Temp;
  })
  .attr("y2", function(){
	  var y2Temp = y2Data-4*yPolarity*(Math.sin(radians));
    return y2Temp;
  })
  .attr("stroke-width", 6)
  .attr("stroke", "black")
  .on("dblclick", function(){
    var evt = d3.event;
    var target = evt.currentTarget;

    deleteConnection(svgIndex, target);
  })
  .on("mouseover", function(){d3.select(this).style("stroke", "red");})
   .on("mouseout", function(){d3.select(this).style("stroke", "black");});
}

Wire.prototype.update = function()
{

    var srcProcessData;
    var srcPointData;
    var destProcessData;
    var destPointData;
    var x1,x2;
    var x1Data;
    var y1Data;
    var x2Data;
    var y2Data;

    if(this.src.effect)
    {
        srcPointData = {"base":{"x":this.x1, "y":this.y1}, "offset":{"x":0,"y":0}};
        srcProcessData = {"processDirection":"normal"};
    }
    else
    {
        srcProcessData = this.parentEffect.effectProcessMap[this.src.process];
        srcPointData = {"base":srcProcessData.getLocation(), "offset":srcProcessData.outputMap[this.src.port]};
    }

    if(this.dest.effect)
    {
        destPointData = {"base":{"x":this.x2, "y":this.y2}, "offset":{"x":0,"y":0}};
        destProcessData = {"processDirection":"normal"};
    }
    else
    {
        destProcessData = this.parentEffect.effectProcessMap[this.dest.process];
        destPointData = {"base":destProcessData.getLocation(), "offset":destProcessData.inputMap[this.dest.port]};
    }

  var lineData = {"src":srcPointData,"dest":destPointData};

  var wireIdString = this.name;

  var wireHandle = document.getElementById(wireIdString);
  if(srcProcessData.processDirection == "normal")
  {
  	x1Data = lineData.src.base.x + lineData.src.offset.x;
  }
  else
  {
  	x1Data = lineData.src.base.x + lineData.src.offset.x - 90;
  }
  y1Data = lineData.src.base.y + lineData.src.offset.y;

  if(destProcessData.processDirection == "normal")
  {
  	x2Data = lineData.dest.base.x + lineData.dest.offset.x;
  }
  else
  {
  	x2Data = lineData.dest.base.x + lineData.dest.offset.x + 90;
  }
  y2Data = lineData.dest.base.y + lineData.dest.offset.y;

  var radians = -Math.abs(Math.atan((y1Data-y2Data)/(x2Data-x1Data)));
  var xPolarity;
  var yPolarity;
  if(x2Data>=x1Data) xPolarity = 1;
  else if(x2Data<x1Data) xPolarity = -1;
  if(y2Data>=y1Data) yPolarity = -1;
  else if(y2Data<y1Data) yPolarity = 1;

  wireHandle.setAttribute("x1", x1Data+4*xPolarity*(Math.cos(radians)));
  wireHandle.setAttribute("y1", y1Data+4*yPolarity*(Math.sin(radians)));
  wireHandle.setAttribute("x2", x2Data-4*xPolarity*(Math.cos(radians)));
  wireHandle.setAttribute("y2", y2Data-4*yPolarity*(Math.sin(radians)));
}



Wire.prototype.getConnectionData = function()
{
    var connectionDataMap = {};

    connectionDataMap.srcPort = this.src.port;
    connectionDataMap.destPort = this.dest.port;
    connectionDataMap.parentEffect = this.parentEffect.name;



    if(this.src.effect)
    {
        connectionDataMap.x1 = effectIO[this.parentEffect.index].inputMap[this.src.port].x;
        connectionDataMap.y1 = effectIO[this.parentEffect.index].inputMap[this.src.port].y;
        connectionDataMap.srcEffect = this.src.effect;
    }
    else
    {
        connectionDataMap.x1 = this.parentEffect.effectProcessMap[this.src.process].outputMap[this.src.port].x
                + this.parentEffect.effectProcessMap[this.src.process].symbol.location.x;
        connectionDataMap.y1 = this.parentEffect.effectProcessMap[this.src.process].outputMap[this.src.port].y
                + this.parentEffect.effectProcessMap[this.src.process].symbol.location.y;
        connectionDataMap.srcProcess = this.src.process;
    }

    if(this.dest.effect)
    {
        connectionDataMap.x2 = effectIO[this.parentEffect.index].outputMap[this.dest.port].x;
        connectionDataMap.y2 = effectIO[this.parentEffect.index].outputMap[this.dest.port].y;
        connectionDataMap.destEffect = this.dest.effect;
    }
    else
    {
        connectionDataMap.x2 = this.parentEffect.effectProcessMap[this.dest.process].inputMap[this.dest.port].x
                  + this.parentEffect.effectProcessMap[this.dest.process].symbol.location.x;
        connectionDataMap.y2 = this.parentEffect.effectProcessMap[this.dest.process].inputMap[this.dest.port].y
                  + this.parentEffect.effectProcessMap[this.dest.process].symbol.location.y;
        connectionDataMap.destProcess = this.dest.process;
    }

  return connectionDataMap;
}



function drawConnections(connections)
{

  for(var connectionKey in connections)
  {
      // filter by parent effect
     connections[connectionKey].draw();
   }

}


function addConnection(parentEffectIndex, jsonProcessConnectionData)
{
	// validate data first
	if(jsonProcessConnectionData.src.process != null && jsonProcessConnectionData.dest.process != null)
	{
		  if( Object.keys(jsonProcessConnectionData).indexOf("srcProcess") >= 0)
		  {
		    var oldConnection = jsonProcessConnectionData;
		    jsonProcessConnectionData = {"src":{},"dest":{}};
		    jsonProcessConnectionData.src.process = oldConnection.srcProcess;
		    jsonProcessConnectionData.src.port = oldConnection.srcPort;
		    jsonProcessConnectionData.src.x = parseInt(oldConnection.x1);
		    jsonProcessConnectionData.src.y = parseInt(oldConnection.y1);
		    jsonProcessConnectionData.dest.process = oldConnection.destProcess;
		    jsonProcessConnectionData.dest.port = oldConnection.destPort;
		    jsonProcessConnectionData.dest.x = parseInt(oldConnection.x2);
		    jsonProcessConnectionData.dest.y = parseInt(oldConnection.y2);
		  }
		    var conKey;

		    if(jsonProcessConnectionData.src.effect)
		    {
		        conKey = jsonProcessConnectionData.src.effect+":"+jsonProcessConnectionData.src.port;
		    }
		    else
		    {
		        conKey = jsonProcessConnectionData.src.process+":"+jsonProcessConnectionData.src.port;
		    }

		    conKey += ">";

		    if(jsonProcessConnectionData.dest.effect)
		    {
		        conKey += jsonProcessConnectionData.dest.effect+":"+jsonProcessConnectionData.dest.port;
		    }
		    else
		    {
		        conKey += jsonProcessConnectionData.dest.process+":"+jsonProcessConnectionData.dest.port;
		    }

		  var srcProcessName = jsonProcessConnectionData.src.process;
		  var srcEffectName = jsonProcessConnectionData.src.effect;
		  var srcPortName = jsonProcessConnectionData.src.port;

		  var destProcessName = jsonProcessConnectionData.dest.process;
		  var destEffectName = jsonProcessConnectionData.dest.effect;
		  var destPortName = jsonProcessConnectionData.dest.port;

		  var effectIndex = parentEffectIndex;
		  var effectName = combo.currentEffect

		  if((srcProcessName.indexOf("(") == 0) && (destProcessName.indexOf("(") == 0))
		  {
		      var conValue = {"src":{"effect":effectIO[effectIndex].name, "port":srcPortName,
		                          "x":effectIO[effectIndex].inputMap[srcPortName].x, "y":effectIO[effectIndex].inputMap[srcPortName].y},
		                          "dest":{"effect":effectIO[effectIndex].name, "port":destPortName,
		                                  "x":effectIO[effectIndex].outputMap[destPortName].x, "y":effectIO[effectIndex].outputMap[destPortName].y
		                                  }
		                              };
		  }
		  else if(jsonProcessConnectionData.src.process.indexOf("(") == 0)
		  {
		      var destProcess = combo.effectMap[effectName].effectProcessMap[jsonProcessConnectionData.dest.process];
		      var sysOutputIndex;

		      var conValue = {"src":{"effect":effectIO[effectIndex].name, "port":srcPortName,
		                          "x":effectIO[effectIndex].inputMap[srcPortName].x, "y":effectIO[effectIndex].inputMap[srcPortName].y},
		                    "dest":{"process":jsonProcessConnectionData.dest.process,
		                          "port":jsonProcessConnectionData.dest.port,
		                          "x":jsonProcessConnectionData.dest.x + destProcess.inputMap[jsonProcessConnectionData.dest.port].x,
		                          "y":jsonProcessConnectionData.dest.y + destProcess.inputMap[jsonProcessConnectionData.dest.port].y}};

		  }
		  else if(jsonProcessConnectionData.dest.process.indexOf("(") == 0)
		  {
		      var srcProcess = combo.effectMap[effectName].effectProcessMap[jsonProcessConnectionData.src.process];
		      var sysInputIndex;

		      var conValue = {"src":{"process":jsonProcessConnectionData.src.process,
		                              "port":jsonProcessConnectionData.src.port,
		                              "x":jsonProcessConnectionData.src.x + srcProcess.outputMap[jsonProcessConnectionData.src.port].x,
		                              "y":jsonProcessConnectionData.src.y + srcProcess.outputMap[jsonProcessConnectionData.src.port].y
		                            },
		                    "dest":{"effect":effectIO[effectIndex].name, "port":destPortName,
		                            "x":effectIO[effectIndex].outputMap[destPortName].x, "y":effectIO[effectIndex].outputMap[destPortName].y
		                            }
		                        };
		  }
		  else
		  {
		      var srcProcess = combo.effectMap[effectName].effectProcessMap[jsonProcessConnectionData.src.process];
		      var destProcess = combo.effectMap[effectName].effectProcessMap[jsonProcessConnectionData.dest.process];

		      var conValue = {"src":{"process":jsonProcessConnectionData.src.process,
		                      "port":jsonProcessConnectionData.src.port,
		                      "x":jsonProcessConnectionData.src.x + srcProcess.outputMap[jsonProcessConnectionData.src.port].x,
		                      "y":jsonProcessConnectionData.src.y + srcProcess.outputMap[jsonProcessConnectionData.src.port].y},
		                      "dest":{"process":jsonProcessConnectionData.dest.process,
		                      "port":jsonProcessConnectionData.dest.port,
		                      "x":jsonProcessConnectionData.dest.x + destProcess.inputMap[jsonProcessConnectionData.dest.port].x,
		                      "y":jsonProcessConnectionData.dest.y + destProcess.inputMap[jsonProcessConnectionData.dest.port].y}};

		  }

		  var connObject = new Wire(effectDrawingAreaSvg[effectIndex],conValue.src, conValue.dest, combo.effectMap[effectName]);
		  combo.effectMap[combo.currentEffect].effectIntraConnectionMap[conKey] = connObject;
		  combo.effectMap[combo.currentEffect].effectIntraConnectionMap[conKey].draw();
	}
}


function deleteConnection(parentEffectIndex, target)
{
	var connName = target.id;
	var parsedConnName = connName.split(">");
	parsedConnName[0] = parsedConnName[0].split(":");
	parsedConnName[1] = parsedConnName[1].split(":");
	var effectName;

	if(parsedConnName[0][0].indexOf('(') >= 0)
	{
		var beginning = parsedConnName[0][0].indexOf('(')+1;
		var end = parsedConnName[0][0].indexOf(')')-1;
		effectName = parsedConnName[0][0].substr(beginning,end);
	}
	else if(parsedConnName[1][0].indexOf('(') >= 0)
	{
		var beginning = parsedConnName[1][0].indexOf('(')+1;
		var end = parsedConnName[1][0].indexOf(')')-1;
		effectName = parsedConnName[1][0].substr(beginning,end);
	}
	else
	{
		effectName = Object.keys(combo.effectMap)[parentEffectIndex];
	}

  delete combo.effectMap[effectName].effectIntraConnectionMap[target.id];
  target.remove();
}
