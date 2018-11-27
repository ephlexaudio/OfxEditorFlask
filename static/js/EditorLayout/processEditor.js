
function updateProcessEditorParameter(evt)
{
  var target = evt.currentTarget;
  var eventType = evt.type;
  var key = target.id;
  var key = key.split(':');
  if (eventType == "click") // update combo parameter
  {
    currentCombo = key[2];
  }
  else
  {
    processMap[key[0]].paramMap[key[1]].update(target.value);
  }
}

function updateProcessEditorForm(formData)
{

  // clear old child nodes  in processEditorForm first
  $('#effectEditorForm').empty();

  var formDataKeys = Object.keys(formData);
  var formDataSize = formDataKeys.length;
  if (formDataSize > 2) // formData is process data
  {
    var process = formData;

    $('#effectEditorForm').append($('<div>').attr({"id": "effectEditorFormHeader","class": "col-md-10"})
    .append($('<div>').attr({"id": "paramTitle", "class": "col-md-3"})
    .text("Title"))
    .append($('<div>').attr({"id": "paramSlider", "class": "col-md-5"})
    .text("Slider"))
    .append($('<div>').attr({"id": "paramValue", "class": "col-md-3"})
    .text("Value"))
    .append($('<div>').attr({"id": "paramPedalUiEnable", "class": "col-md-1"})
    .text("Enable")));

// create new child nodes
    for (var paramKey in process.paramMap)
    {
      process.paramMap[paramKey].draw();
    }
  }
  else // formData is combo header data
  {
    var comboHeader = formData;

    $('#effectEditorForm').append($('<div>').attr({"id": "comboDiv","class": "form-group col-md-10"})
    .append($('<label>').attr({"for": "comboName","class": "col-md-3 control-label"}).text("Combo Name"))
    .append($('<input>').attr({"type": "text", "id": "comboHeaderName", "class": "col-md-3", "value": comboHeader.name}))
    .append($('<input>').attr({"type": "button", "class": "col-md-3", "value": "Apply", "maxlength": "9"})
    .on("click", function (evt) {
      currentCombo = $('#comboHeaderName').val();
    })));

  }
}

function updateProcessEditorArea(processes)
{

  processEditorTabGroupDiv = $('#effectEditorTabGroupDiv');

  // update combo tab
  processEditorTabGroupDiv.empty();
  processEditorTabGroupDiv
  .append($('<li>')
  .attr({"display": "inline-block"})
  .attr({"class": "active"})
  .append($('<a>').attr({"href": "#", "id": "comboHeader"})
  .text("Combo Header")));

  $('#comboHeader').click(function (evt) {
    var comboFormData = {"name": currentCombo};
    $("li").removeClass("active");
    $(this.parentNode).addClass("active");
    updateProcessEditorForm(comboFormData);
  });
  var numberOfProcesses = 0;
  // update process tabs
  $.each(processMap, function (index, process)
  {
    var processKey = process.name;
    processEditorTabGroupDiv
    .append($('<li>')
    .attr({"display": "inline-block", "style": "float:left"})
    .append($('<a>').attr({"href": "#", "id": processKey+"Tab"})
    .text(processKey)));
    numberOfProcesses++;
    var processKeyLink = '#' + processKey+"Tab";
    $(processKeyLink).click(function (evt) {
      var clickKey = evt.currentTarget.id.replace("Tab","");
      $("li").removeClass("active");
      $(this.parentNode).addClass("active");
      updateProcessEditorForm(processMap[clickKey]);
    });
  });
  $('#effectEditorTabGroupDiv').css("width", 150 + 160 * numberOfProcesses + "px");
  var processMapKeys = Object.keys(processMap);
  if (processMapKeys.length > 0)
  {
    updateProcessEditorForm(processMap[processMapKeys[processMapKeys.length - 1]]);
  }
  else
  {
    updateProcessEditorForm({"name": ""});
  }
}


function processEditorInit()
{
  var processEditorTabGroupDiv = document.getElementById("effectEditorTabGroupDiv");

  var processEditorTabGroup = document.getElementById("effectEditorTabGroup");

  var processEditorForm = document.getElementById("effectEditorForm");
  var processMapKeys = Object.keys(processMap);
  if (processMapKeys.length > 0)
  {
    updateProcessEditorForm(processMap[processMapKeys[processMapKeys.length - 1]]);
  }
  else
  {
    updateProcessEditorForm({"name": ""});
  }
}
