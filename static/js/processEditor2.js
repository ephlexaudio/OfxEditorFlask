
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
//var form = document.getElementById("processEditorForm");
// clear old child nodes  in processEditorForm first
    $('#processEditorForm').empty();

    var formDataKeys = Object.keys(formData);
    var formDataSize = formDataKeys.length;
    if (formDataSize > 2)//if("paramArray" in formData) // formData is process data
    {
        var process = formData;

        $('#processEditorForm').append($('<div>')
                .attr({"id": "processEditorFormHeader",
                    "class": "col-md-10"}
                )
                .append($('<div>').attr({"id": "paramTitle", "class": "col-md-3"})
                        .text("Title"))
                .append($('<div>').attr({"id": "paramSlider", "class": "col-md-5"})
                        .text("Slider"))
                .append($('<div>').attr({"id": "paramValue", "class": "col-md-3"})
                        .text("Value"))
                .append($('<div>').attr({"id": "paramPedalUiEnable", "class": "col-md-1"})
                        .text("Enable"))
                );

        // create new child nodes
        for (var paramKey in process.paramMap)
        {
            process.paramMap[paramKey].draw();
        }
    }
    else // formData is combo header data
    {
        var comboHeader = formData;

        $('#processEditorForm').append($('<div>')
                .attr({"id": "comboDiv",
                    "class": "form-group col-md-10"
                }
                )
                .append($('<label>')
                        .attr({"for": "comboName",
                            "class": "col-md-3 control-label"})
                        .text("Combo Name"))
                /*var pedalUiEnable = document.createElement("input", {"type": "checkbox"});
                 pedalUiEnable.type = "checkbox";*/
                .append($('<input>').attr({"type": "text", "id": "comboHeaderName", "class": "col-md-3", "value": comboHeader.name}))
                .append($('<input>').attr({"type": "button", "class": "col-md-3", "value": "Apply", "maxlength": "9"})
                        .on("click", function (evt) {
                            currentCombo = $('#comboHeaderName').val();
                            //updateProcessEditorParameter(comboHeader);
                        }))
                );

    }
}

function updateProcessEditorArea(processes)
{

    processEditorTabGroupDiv = $('#processEditorTabGroupDiv');
    /*var numberChildNodes = processEditorTabGroup.childNodes.length;
     for (var childNodeIndex = 0; childNodeIndex < numberChildNodes; childNodeIndex++)
     {
     processEditorTabGroup.removeChild(processEditorTabGroup.childNodes[0]);
     }*/

    // update combo tab
    processEditorTabGroupDiv.empty();
    processEditorTabGroupDiv
            .append($('<li>')
                    .attr({"display": "inline-block"})
                    .attr({"class": "active"})
                    .append($('<a>').attr({"href": "#", "id": "comboHeader"})
                            .text("Combo Header")));

    /*var processEditorTab = document.createElement("div");
     processEditorTab.className = "col-md-12";
     processEditorTab.id = "comboHeader";*/
    /*var processEditorTabLink = document.createElement("a");
     processEditorTabLink.href = "#";*/
    $('#comboHeader').click(function (evt) {
        var comboFormData = {"name": currentCombo};
        $("li").removeClass("active");
        $(this.parentNode).addClass("active");
        updateProcessEditorForm(comboFormData);
    });
    /*var tabLinkText = document.createTextNode("Combo Header");
     processEditorTabLink.appendChild(tabLinkText);
     processEditorTab.appendChild(processEditorTabLink);
     processEditorTabGroup.appendChild(processEditorTab);*/
    var numberOfProcesses = 0;
    // update process tabs
    //for (var processKey in processMap)
    $.each(processMap, function (index, process)
    {
        var processKey = process.name;
        processEditorTabGroupDiv
                .append($('<li>')
                        .attr({"display": "inline-block", "style": "float:left"})
                        .append($('<a>').attr({"href": "#", "id": processKey+"Tab"})
                                .text(processKey)));
        numberOfProcesses++;
        /*var processEditorTab = document.createElement("div");
         processEditorTab.id = processKey;*/
        /*var processEditorTabLink = document.createElement("a");
         processEditorTabLink.href = "#";*/
        var processKeyLink = '#' + processKey+"Tab";
        $(processKeyLink).click(function (evt) {
            var clickKey = evt.currentTarget.id.replace("Tab","");
            $("li").removeClass("active");
            $(this.parentNode).addClass("active");
            updateProcessEditorForm(processMap[clickKey]);
        });
        /*var tabLinkText = document.createTextNode(processKey);
         processEditorTabLink.appendChild(tabLinkText);
         processEditorTab.appendChild(processEditorTabLink);
         processEditorTabGroup.appendChild(processEditorTab);*/
    });
    $('#processEditorTabGroupDiv').css("width", 150 + 160 * numberOfProcesses + "px");
    //processEditorArea.appendChild(processEditorTabGroup);
    //processEditorArea.appendChild(processEditorForm);
    var processMapKeys = Object.keys(processMap);
    if (processMapKeys.length > 0)
        updateProcessEditorForm(processMap[processMapKeys[processMapKeys.length - 1]]);
    else
        updateProcessEditorForm({"name": ""});//$('#processEditorForm').empty();
}


function processEditorInit()
{


    var processEditorTabGroupDiv = document.getElementById("processEditorTabGroupDiv");
    //processEditorTabGroupDiv.id = "processEditorTabGroupDiv";
    //$('#processEditorTabGroupDiv').attr({"style": "overflow-x: scroll;width:300px;"});
    //processEditorTabGroupDiv.style.overflowX="auto";
    //processEditorTabGroupDiv.style.overflowY="auto";
    //processEditorTabGroupDiv.style.width="700px";
    ///processEditorTabGroupDiv.style.height="190px";


    var processEditorTabGroup = document.getElementById("processEditorTabGroup");
    //processEditorTabGroup.id = "processEditorTabGroup";
    //processEditorTabGroup.className = "nav nav-tabs";
    //processEditorTabGroup.style.listStylePosition="inside";
    //processEditorTabGroup.style.verticalAlign="top";
    //processEditorTabGroup.style.overflowX="auto";
    //processEditorTabGroup.style.overflowY="hidden";
    //processEditorTabGroup.style.maxWidth="600px";
    //processEditorTabGroup.style.maxHeight="60px";
    //processEditorTabGroup.style.overflowY="scroll";
    //processEditorTabGroup.style.overflowY="scroll";


    // processEditorTabGroup.style.width="900px";
    //processEditorTabGroup.style.height="80px";


    var processEditorForm = document.getElementById("processEditorForm");
    //processEditorForm.id = "processEditorForm";
    //$('#processEditorForm').attr({"style": "overflow-y: scroll;height:150px;"});
    //processEditorForm.style.overflowY="scroll";
    //processEditorForm.style.height="150px";

    //processEditorTabGroupDiv.appendChild(processEditorTabGroup);
    //processEditorArea.appendChild(processEditorTabGroup);
    //processEditorArea.appendChild(processEditorForm);
    var processMapKeys = Object.keys(processMap);
    if (processMapKeys.length > 0)
        updateProcessEditorForm(processMap[processMapKeys[processMapKeys.length - 1]]);
    else
        updateProcessEditorForm({"name": ""});//$('#processEditorForm').empty();

    /*if(processArray.length > 0)
     updateProcessEditorArea(processMap);*/
}
