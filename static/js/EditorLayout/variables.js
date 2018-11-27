var txBlock = new Array(100);
var rxBlock = new Array(500);
var activeMod = '';
var xferCount = 0;
var comboArray = new Array;
var componentArray = new Array;
var controlArray = new Array;
var componentMap = {};

var combo;

var processTypeCount = {};

var currentData;

var sidebarSvg = d3.select("#sidebar")
.append("svg")
.attr("id", "sidebarSvg")
.attr("width", 150)
.attr("height", 900);

var effectDrawingAreaSvg = [];
var effectIndex = 0;

var comboDrawingAreaSvg;

var effectIO = [];

var dummy = {"name":"none", "x":0, "y":0};
var effectDrawingAreaDraggingElement = null;
var effectDrawingAreaFlippingElement = null;
var d3coords;
var mouseDownCoords = {"x":0,"y":0};
var mouseDragCoords = {"x":0,"y":0};
var effectDrawingAreaMouseOverSymbol = 0;
var effectDrawingAreaMouseOverInputConnector = 0;
var effectDrawingAreaMouseOverOutputConnector = 0;
var effectDrawingAreaMouseClickConnector = {"component":0, "type":0, "index":0};
//change flags
var newProcessAdded = 0;
var processRemoved = 0;
var newConnectionAdded = 0;
var connectionRemoved = 0;
var newComboLoaded = 0;
var effectDrawingAreaChange = 0;
var effectProcessArrayUpdated = 0;
var effectProcessConnectionArrayUpdated = 0;
var currentEffect = "";
var currentCombo = "";
var mouseInSidebar = 0;
var mouseInDrawingArea = 0;
var sidebarDraggingElement = null;
var sidebarMouseOverSymbol = 0;
var newProcess = null;
var newProcessConnection = null;
var mouseOverProcess = null;
var nMouseOffsetX = 0;
var nMouseOffsetY = 0;
var wait = 0;
var totalCpuPowerRequired = 0;
var clickedConnector = {"process":"", "port":"", "type":"", "index":0};
var newConnection = {};
var effectEditorArea;
var ofxMainStatus;
var updateIntervalTime = 1000;
var controlCount = 0;
var newParameterValue = {"parentName":"", "parameterName":"", "parameterValue":0};
var suspendUpdates = 1;



var comboDataError;
