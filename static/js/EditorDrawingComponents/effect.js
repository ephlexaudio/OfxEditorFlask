/* effect data
    effect name
    effect abbr
    process Array
    process connection Array


*/

function Effect(parent, index, effectData)
{
    this.parent = parent;
    this.effectProcessArray = new Array;
    this.effectControlArray = new Array;
    this.effectIntraConnectionArray = new Array;
    this.effectControlConnectionArray = new Array;
    this.effectProcessMap = {};
    this.effectControlMap = {};
    this.effectIntraConnectionMap = {};
    this.effectControlConnectionMap = {};

    this.index = effectData.index;
    this.name = effectData.name;
    this.abbr = effectData.abbr;


    var effectIoJson = {
      		"outputMap": [{"name":"output1", "x":900, "y":160},{"name":"output2", "x":900, "y":240}],
     		"name": "("+this.name+")",
     		"processDirection":"normal",
     		"inputMap": [{"name":"input1", "x":20, "y":160},{"name":"input2", "x":20, "y":240}],
       		};
    effectIO[this.index] = new Process(this.parent, effectIoJson);

    if(effectData.processArray.length > 0)
    {
        this.effectProcessArray = effectData.processArray;
        for(var effectProcIndex = 0; effectProcIndex < this.effectProcessArray.length; effectProcIndex++)
        {
            var jsonProcessData = this.effectProcessArray[effectProcIndex];
            jsonProcessData.inputMap = array2Map(jsonProcessData.inputArray);
            jsonProcessData.outputMap = array2Map(jsonProcessData.outputArray);
            jsonProcessData.paramMap = array2Map(jsonProcessData.paramArray);
            this.addEffectProcess(jsonProcessData);
        }

        this.effectIntraConnectionArray = effectData.connectionArray;

        for (var effectIntraConnectionIndex = 0; effectIntraConnectionIndex < this.effectIntraConnectionArray.length; effectIntraConnectionIndex++)
        {
            var jsonConnectionData = this.effectIntraConnectionArray[effectIntraConnectionIndex];
            this.addEffectIntraConnection(jsonConnectionData);
        }
    }
    else
    {
    	jsonConnectionData = {"srcEffect": "("+this.name+")","srcPort": "input2","destEffect": "("+this.name+")","destPort": "output2",
    			"parentEffect": "effect1","x1": 20,"y1": 240,"x2": 900,"y2": 240};
    	this.addEffectIntraConnection(jsonConnectionData);

    	jsonConnectionData = {"srcEffect": "("+this.name+")","srcPort": "input1","destEffect": "("+this.name+")","destPort": "output1",
                "parentEffect": "effect1","x1": 20,"y1": 160,"x2": 900,"y2": 160};
        this.addEffectIntraConnection(jsonConnectionData);
    }

    if(effectData.controlArray)
    {
        this.effectControlArray = effectData.controlArray;
        for(var effectContIndex = 0; effectContIndex < this.effectControlArray.length; effectContIndex++)
        {
            var jsonControlData = this.effectControlArray[effectContIndex];
            this.addEffectControl(jsonControlData);
        }

        this.effectControlConnectionArray = effectData.controlConnectionArray;
        for (var effectControlConnectionIndex = 0; effectControlConnectionIndex < this.effectControlConnectionArray.length; effectControlConnectionIndex++)
        {
            var jsonControlConnectionData = this.effectControlConnectionArray[effectControlConnectionIndex];
            this.addEffectControlConnection(jsonControlConnectionData);
        }
    }
}

function parseConnectionKey(keyString)
{
    var connectionKeyParse = keyString.split('>');
    connectionKeyParse[0] = connectionKeyParse[0].split(':');
    connectionKeyParse[1] = connectionKeyParse[1].split(':');
    var parsedKey = {"src":{"process":connectionKeyParse[0][0], "port":connectionKeyParse[0][1]},
    "dest":{"process":connectionKeyParse[1][0], "port":connectionKeyParse[1][1]}};

    return parsedKey;
}


Effect.prototype.draw = function()
{

	combo.currentEffect = this.name;
    for(var effectProcessKey in this.effectProcessMap)
    {
        this.effectProcessMap[effectProcessKey].draw();
    }

    for(var effectIntraConnectionKey in this.effectIntraConnectionMap)
    {
        this.effectIntraConnectionMap[effectIntraConnectionKey].draw();
    }

    for(var effectControlKey in this.effectControlMap)
    {
        this.effectControlMap[effectControlKey].draw();
    }

    for(var effectControlConnectionKey in this.effectControlConnectionMap)
    {
        this.effectControlConnectionMap[effectControlConnectionKey].draw();
    }

    effectIO[this.index].draw();


}

Effect.prototype.update = function(keyValuePair)
{
    var key = Object.keys(keyValuePair)[0];
    var value = keyValuePair[key];
	this[key] = value;
    console.log("Effect key:"+key+"\tEffect value:"+value);
}

Effect.prototype.getEffectData = function()
{
    var effectDataMap = {};

    effectDataMap.name = this.name;
    effectDataMap.abbr = this.abbr;
    effectDataMap.index = this.index;
    effectDataMap.processArray = new Array;
    effectDataMap.connectionArray = new Array;
    effectDataMap.controlArray = new Array;
    effectDataMap.controlConnectionArray = new Array;

    /**************** PROCESSES AND INTRACONNECTIONS *******************************/
    for(var effectProcessKey in this.effectProcessMap)
    {
        var effectProcess = this.effectProcessMap[effectProcessKey].getProcessData();
        effectDataMap.processArray.push(effectProcess);
    }

    if(this.checkEffectIntraConnections() == false && comboDataError == false) comboDataError = true;

    for(var effectIntraConnectionKey in this.effectIntraConnectionMap)
    {
        var effectIntraConnection = this.effectIntraConnectionMap[effectIntraConnectionKey].getConnectionData();
        effectDataMap.connectionArray.push(effectIntraConnection);
    }


    /************************ CONTROLS AND CONNECTIONS ********************************/
    for(var effectControlKey in this.effectControlMap)
    {
        var effectControl = this.effectControlMap[effectControlKey].getControlData();
        effectDataMap.controlArray.push(effectControl);
    }

    if(this.checkEffectIntraConnections() == false && comboDataError == false) comboDataError = true;

    for(var effectControlConnectionKey in this.effectControlConnectionMap)
    {
        var effectControlConnection = this.effectControlConnectionMap[effectControlConnectionKey].getConnectionData();
        effectDataMap.controlConnectionArray.push(effectControlConnection);
    }


    return effectDataMap;
}

Effect.prototype.addEffectProcess = function(jsonProcessData)
{
    var parentEffect = {"name":this.name, "abbr":this.abbr};
    var effectProcess = new Process(effectDrawingAreaSvg[this.index], jsonProcessData, parentEffect);
    this.effectProcessMap[effectProcess.name] = effectProcess;
    processTypeCount[effectProcess.type]++;
}

Effect.prototype.addEffectIntraConnection = function(jsonConnectionData)
{
    var src = {"effect":jsonConnectionData.srcEffect,"process":jsonConnectionData.srcProcess,"port":jsonConnectionData.srcPort};
    var dest = {"effect":jsonConnectionData.destEffect,"process":jsonConnectionData.destProcess,"port":jsonConnectionData.destPort};

    var wire = new Wire(effectDrawingAreaSvg[this.index], src, dest, this);
    this.effectIntraConnectionMap[wire.name] = wire;
}

Effect.prototype.deleteEffectProcess = function(target)
{
  var connectionArrayIndex, procInputIndex, procOutputIndex=0;
  var target = evt.currentTarget
  var svgObject = target.farthestViewportElement;
  var svgChildNodes = svgObject.childNodes;

  var effectProcess = target;
  var name = target.id;
  // delete connected wires before deleting process
  for(var processConnectionKey in processConnectionMap)
  {
    var parsedKey = parseConnectionKey(processConnectionKey);
    // delete wires connected to inputs
    if(parsedKey["dest"]["process"] == name)
    {
      var target = document.getElementById(processConnectionKey);
      deleteConnection(target);
    }
    // delete wires connected to outputs
    if(parsedKey["src"]["process"] == name)
    {
      var target = document.getElementById(processConnectionKey);
      deleteConnection(target);
    }

  }

  processTypeCount[effectProcessMap[effectProcess.id].type]--;
  delete effectProcessMap[effectProcess.id];
  effectProcess.remove();
  updateProcessEditorArea(effectProcessMap);
}

Effect.prototype.checkEffectIntraConnections = function()
{
    var connectionsGood = false;

	var connArray = new Array;
	// seperate each key into src process string and dest process string, and place pair into array.
	for(var effectIntraConnectionKey in this.effectIntraConnectionMap)
	{
        var parsedConn = parseConnectionKey(effectIntraConnectionKey);
        var tempConn = [parsedConn["src"]["process"], parsedConn["dest"]["process"]];
		connArray.push(tempConn);
	}

	// DOESN'T WORK: take dest string (connArray[i]), find matching src string (connArray[j]),
	//		replace dest string in connArray[i] with dest string in connArray[j], delete connArray[j].

    // find first connection (src process contains paranthesis), search connArray to connect first
    //      connection dest to it's target, and replace dest with target dest.  Repeat this until no
    //      connections are left to be made.

    var firstConnection;
    var connectionCompleteCount = 0;
    var connScanDone = false;
    var breakLoops = false;
    var scanCount = 0;
    var connArrayStartSize = connArray.length;

    for(var i = 0; i < connArray.length; i++)
    {
        console.log(connArray[i]);
    }

    // get first connection
    for(var i = 0; i < connArray.length; i++)
    {
        if((connArray[i][0][0] == '(') && (connArray[i][1][0] != '('))
        {
            firstConnection = connArray[i];
            break;
        }
    }

    if((connArray[0][0][0] == '(') && (connArray[0][1][0] == '(') &&
        (connArray[1][0][0] == '(') && (connArray[1][1][0] == '('))
    {
        connScanDone = true; // both connections are straight through
        connectionsGood = true;
    }

    while(connScanDone == false)
    {
        breakLoops = false;
        for(var i = 0; i < connArray.length; i++)
        {
            for(var j = 0; j < connArray.length; j++)
            {
                if(firstConnection[1] == connArray[j][0] )
                {
                    firstConnection[1] = connArray[j][1];
                    connArray.splice(j,1);
                    breakLoops = true;
                }
                if(breakLoops == true) break;
            }
            if(breakLoops == true) break;
        }
        console.log("reducing connections....");
        for(var i = 0; i < connArray.length; i++)
        {
            console.log(connArray[i]);
        }

        // check for loose connection ends
        connScanDone = true;
        for(var i = 0; i < connArray.length; i++)
        {
            if(((connArray[i][0][0] == '(') || (connArray[i][1][0] == '(')) &&
             (connArray[i][0][0] != connArray[i][1][0]))
             {
                 connScanDone = false;
                 break;
             }
        }
        // scanned too many times, indicating bad/loose connection
        if(scanCount == connArrayStartSize + 10)
        {
            connectionsGood = false;
            connScanDone = true;
        }
        scanCount++;

        // if both effect intraconnections are complete, exit loop with connectionsGood = true
        connectionCompleteCount = 0;
        for(var i = 0; i < connArray.length; i++)
        {
            if((connArray[i][0][0] == '(') && (connArray[i][1][0] == '('))
            {
                connectionCompleteCount++;
            }
        }
        if(connectionCompleteCount == 2)
        {
            connectionsGood = true;
            connScanDone = true;
        }
    }

    return connectionsGood;
}

Effect.prototype.addEffectControl = function(jsonControlData)
{
    var parentEffect = {"name":this.name, "abbr":this.abbr};
    var effectControl = new Control(effectDrawingAreaSvg[this.index], jsonControlData, parentEffect);
    this.effectControlMap[effectControl.name] = effectControl;
    controlCount++;
}

Effect.prototype.addEffectControlConnection = function(jsonControlConnectionData)
{
    var src = jsonControlConnectionData.src;
    var dest = jsonControlConnectionData.dest;

    var controlWire = new ControlWire(effectDrawingAreaSvg[this.index], src, dest, this);
    this.effectControlConnectionMap[controlWire.name] = controlWire;
}


function deleteEffect(effectName)
{
	// subtract effect cpuPower first
	for(var processKey in combo.effectMap[effectName].effectProcessMap)
	{
		totalCpuPowerRequired -= combo.effectMap[effectName].effectProcessMap[processKey].cpuPower;
	}
    delete combo.effectMap[effectName];

}
