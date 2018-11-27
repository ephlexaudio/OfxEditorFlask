function updateData()  //after effectProcessMap and/or effectProcessConnectionMap have been updated
{
  var csrftoken = getCookie('csrftoken');
  $.ajaxSetup({
      beforeSend: function (xhr, settings) {  // setup CSRF token in request header
          if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });
	if(suspendUpdates == 0)
	{

		$.ajax({type:"GET", url:"getCurrentStatus", dataType:"json"})
		.success(function(data,status)
		{
		var ofxMainStatusData = data;
		    $('#statusBox').text("Status: " + ofxMainStatusData.ofxMainStatus);
		    console.log(data);
		    currentData = data;
//		    $.each(currentData.serverData, function(index, data)
//		    {
//		        var sliderId = data.id+':slider';
//		        $(document.getElementById(sliderId)).val(data.value);
//		    });
		    newParameterValue.parentName = "none";
		})
		.error(function(ts)
		{
		   console.log("Error");
		   console.log(ts.responseText);
	   });
	}
}
