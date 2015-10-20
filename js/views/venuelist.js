// venuelist.js

var VenuelistView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (VenuelistView, neutrino.View);

// page/view lifecycle methods

VenuelistView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("VenuelistView has been loaded");
}

VenuelistView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("VenuelistView is about to become visible");
}

VenuelistView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("VenuelistView is now visible");
}

VenuelistView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("VenuelistView's markup is now final");
  
  $('#venue-loader, #loading-indicator').addClass('hidden');
  $('.isWeb .venue .eventlist, .isTablet .venue .eventlist').removeClass('nu-invisible');
  
  this.checkCurrent();
  this.checkItinerary();
}

VenuelistView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("VenuelistView's markup is about to become invisible");
}

VenuelistView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("VenuelistView's markup is now invisible");
}

VenuelistView.prototype.checkitinerary = function ()
{
  console.log ("Checking if this event is in the itinerary");
}

VenuelistView.prototype.checkCurrent = function ()
{
  console.log ("Checking current event");
  
  var current = $('.location-more').data('id');
  console.log('current event is: '+ current);
  
  $('.venue .event').removeClass('current');
	$('.venue .event[data-id="'+ current +'"]').addClass('current'); 
}

VenuelistView.prototype.checkItinerary = function ()
{
  console.log ("Checking itinerary events");
  
  //$('.venue .event').removeClass('itinerary-added').addClass('itinerary-absent');
  
  $('.venue .event-block').each(function(){
	  var id = $(this).data('id');
	  
	  /*
	  if( $.inArray(id, gApplication.itinerary) > -1 ){
			console.log(id);
			inItinerary = 'itinerary-added';
			
			// Update the event in localstorage
			var event = JSON.parse(localStorage['sfbw2015_event_'+ id]);
			event.itinerary = 1;

			localStorage.setItem("sfbw2015_event_"+ id, JSON.stringify(event));  //put the object back
		}
		*/
	  
	  if( $.inArray(id, gApplication.itinerary) > -1 ){
			$('.venue .event[data-id="'+ id +'"]').removeClass('itinerary-absent').addClass('itinerary-added');
	  }
  }); 
}

VenuelistView.prototype.back = function ()
{
	gApplication.hideView('venueevents');
	
	if (Modernizr.history) {
	  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
	  window.history.pushState({path:newurl},'',newurl);
	}
}

VenuelistView.prototype.returnToOrigin = function ()
{
	var origin = $('div[nu-view-key="venueevents"] .back-btn').data('origin');
	
	/*
	var params = new Object();
			params.id = origin;
			params.slug = '';
			params.venue = '';
			
	gApplication.showView('eventwrap', params);
	*/
}