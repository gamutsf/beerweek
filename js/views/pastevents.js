// pastevents.js

var PasteventsView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (PasteventsView, neutrino.View);

// page/view lifecycle methods

PasteventsView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("PasteventsView has been loaded");
}

PasteventsView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("PasteventsView is about to become visible");
  
  var editId = getParameterByName(document.URL, "edit");
	var renewId = getParameterByName(document.URL, "renew");
	var eventId = getParameterByName(document.URL, "event");
	var eventUpdated = getParameterByName(document.URL, "updated");
	var eventSubmitted = getParameterByName(document.URL, "submitted");
  
  if( document.documentElement.clientWidth < 768 ){
	  if(!(editId || renewId || eventId)){
  		gApplication.hideView('eventform');
  	}
  }
}

PasteventsView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("PasteventsView is now visible");
}

PasteventsView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("PasteventsView's markup is now final");
  
  // Check query params
	var editId = getParameterByName(document.URL, "edit");
	var renewId = getParameterByName(document.URL, "renew");
	var eventId = getParameterByName(document.URL, "event");
	var eventUpdated = getParameterByName(document.URL, "updated");
	var eventSubmitted = getParameterByName(document.URL, "submitted");
	
	if(editId){
		sfbw.dashboard.edit(editId);
	}
	
	if(renewId){
		sfbw.dashboard.renew(renewId);
	}
	
	$('.dashboard #list .event').removeClass('active');
	
	if(editId){
		$('.dashboard #list .event[data-event="'+ editId +'"]').addClass('active');
	}
	
	if(renewId){
		$('.dashboard #list .event[data-event="'+ renewId +'"]').addClass('active');
	}
}

PasteventsView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("PasteventsView's markup is about to become invisible");
}

PasteventsView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("PasteventsView's markup is now invisible");
}

PasteventsView.prototype.edit = function ()
{
  sfbw.dashboard.edit(this.nuParams.id);
}

PasteventsView.prototype.renew = function ()
{
  sfbw.dashboard.renew(this.nuParams.id);
}

PasteventsView.prototype.remove = function ()
{
  sfbw.dashboard.remove(this.nuParams.id);
}

PasteventsView.prototype.pay = function ()
{
  sfbw.dashboard.pay(this.nuParams.id, this.nuParams.amt);
}