// myevents.js

var MyeventsView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (MyeventsView, neutrino.View);

// page/view lifecycle methods

MyeventsView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("MyeventsView has been loaded");
}

MyeventsView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("MyeventsView is about to become visible");
  
  var editId = getParameterByName(document.URL, "edit");
	var duplicateId = getParameterByName(document.URL, "duplicate");
	var eventId = getParameterByName(document.URL, "event");
	var eventUpdated = getParameterByName(document.URL, "updated");
	var eventSubmitted = getParameterByName(document.URL, "submitted");
  
  if( document.documentElement.clientWidth < 768 ){
	  if(!(editId || duplicateId || eventId)){
  		gApplication.hideView('eventform');
  	}
  }
}

MyeventsView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("MyeventsView is now visible");
}

MyeventsView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("MyeventsView's markup is now final");
  
  // Check query params
	var editId = getParameterByName(document.URL, "edit");
	var duplicateId = getParameterByName(document.URL, "duplicate");
	var eventId = getParameterByName(document.URL, "event");
	var eventUpdated = getParameterByName(document.URL, "updated");
	var eventSubmitted = getParameterByName(document.URL, "submitted");
	
	if(editId){
		sfbw.dashboard.edit(editId);
	}
	
	if(duplicateId){
		sfbw.dashboard.duplicate(duplicateId);
	}
	
	// Close the updated alert after 5 seconds
	if(eventUpdated == "true"){
		sfbw.dashboard.setAlert('updated');
		sfbw.dashboard.showAlert();
		//setTimeout(sfbw.dashboard.clear, 8000);
	}
	
	// Close the submitted alert after 5 seconds
	/*
	if(eventSubmitted == "true"){
		sfbw.dashboard.setAlert('submitted');
		sfbw.dashboard.showAlert();
		//setTimeout(sfbw.dashboard.clear, 5000);
	}
	*/
	
	$('.dashboard #list .event').removeClass('active');
	
	if(editId){
		$('.dashboard #list .event[data-event="'+ editId +'"]').addClass('active');
	}
	
	if(duplicateId){
		$('.dashboard #list .event[data-event="'+ duplicateId +'"]').addClass('active');
	}
}

MyeventsView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("MyeventsView's markup is about to become invisible");
}

MyeventsView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("MyeventsView's markup is now invisible");
}

MyeventsView.prototype.edit = function ()
{
  sfbw.dashboard.edit(this.nuParams.id);
}

MyeventsView.prototype.duplicate = function ()
{
  sfbw.dashboard.duplicate(this.nuParams.id);
}

MyeventsView.prototype.remove = function ()
{
  sfbw.dashboard.remove(this.nuParams.id);
}

MyeventsView.prototype.pay = function ()
{
  sfbw.dashboard.pay(this.nuParams.id, this.nuParams.amt);
}