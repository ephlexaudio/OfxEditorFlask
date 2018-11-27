function Cord(parent, src, dest)
{
  this.parent = parent;
  this.src = src;
  this.dest = dest;
  this.name = this.src.effect+':'+this.src.port+'>'+this.dest.effect+':'+this.dest.port;

}

Cord.prototype.getCordData = function()
{
  var connectionDataMap = {};
  if(this.src.effect == "system")
  {
      connectionDataMap.srcEffect = this.src.effect;
  }
  else
  {
      connectionDataMap.srcEffect = this.src.effect;
  }

  if(this.dest.effect == "system")
  {
      connectionDataMap.destEffect = this.dest.effect;
  }
  else
  {
      connectionDataMap.destEffect = this.dest.effect;
  }

  connectionDataMap.srcPort = this.src.port;
  connectionDataMap.destPort = this.dest.port;

  return connectionDataMap;
}

function updateEffectConnectionMap()
{
  for(var i = 0; i < effectConnectionArray.length; i++)
  {
    var conn = effectConnectionArray[i];
    var key = conn.srcEffect+':'+conn.srcPort+'>'+conn.destEffect+':'+conn.destPort;
    effectConnectionMap[key] = effectConnectionArray[i];
  }
}
