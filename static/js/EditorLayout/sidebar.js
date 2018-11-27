
function drawComponents(components)
{
  for(var symbolKey in componentMap)
  {
    componentMap[symbolKey].draw();
  }
}


function sidebarInit()
{
  var symbolArray = new Array;

  {

    var componentList = document.getElementById("componentList");
    var numberOfComponents = 0;
    $.ajax({url:'getComponents', dataType: "json"}).success(function(data,status)
    {
        console.log(data);
        componentArray = new Array;
        $.each(data, function(index, component)
        {
            jsonComponent = JSON.parse(component);
            jsonComponent.symbol.location.x = 50;
            jsonComponent.symbol.location.y = 20+100*index;
            componentArray.push(jsonComponent);
            componentMap[jsonComponent.name] = new Component(sidebarSvg, jsonComponent);
            processTypeCount[componentArray[index].type]=0;
            numberOfComponents++;
        });
        drawComponents(componentMap);

        document.getElementById('sidebarSvg').style.height=100*numberOfComponents+"px";
        document.getElementById('sidebarSvg').style.width=150;
    });
  }
}
