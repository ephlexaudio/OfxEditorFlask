function array2Map(array)
{
    var newMap = {};

    for(var i = 0; i < array.length; i++)
    {
        newMap[array[i].name] = array[i];
    }

    return newMap;
}


function getMapSize(map)
{
  var mapCount = 0;
  for(var mapKey in map)
  {
    mapCount++;
  }
  return mapCount;
}
