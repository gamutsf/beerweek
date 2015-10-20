
/*
  this taglet gets one event from the list
  either from the webdb or from gEvents
  
  HACK - parameters attribute is assumed to be the event ID
*/ 

var	EventTaglet = function ()
{
	neutrino.janx.AsyncTaglet.call (this);

	this.requiredAttributes = new Array ();
	this.requiredAttributes.push ("id");
};
neutrino.inherits (EventTaglet, neutrino.janx.AsyncTaglet);

EventTaglet.prototype.itineraryCheck = function (event)
{
	console.log('checking if event is in itinerary');
	
	var id = event.id;
	var	cacheKey = "sfbw2015_event_" + id;
	
	console.log(id);
	console.log(cacheKey);
	
	if (localStorage.getItem(cacheKey) === null) {
  	console.log('item does not exist in LS yet');
	}
	else {
		
		if(gApplication.user && gApplication.itinerary.length){
			if( $.inArray(id, gApplication.itinerary) > -1 ){
				// Update the event in localstorage
				var event = JSON.parse(localStorage[cacheKey]);
				event.itinerary = 1;
			}
			else {
				// Update the event in localstorage
				var event = JSON.parse(localStorage[cacheKey]);
				event.itinerary = 0;
			}
		}
		else {
			console.log('no itinerary or user not logged in');
		}
		
	}
	
	var output = JSON.stringify(event);
	localStorage.setItem(cacheKey, output);  //put the object back
	
	return event;
}

EventTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	eventID = inElement.getAttribute ("id");
	var tracker = inElement.getAttribute ("track");
	
	var self = this;
	
	// wow, neutrino's required attributes allows zero length ones
	if (eventID && eventID.length)
	{
		console.log ("EventTaglet with id of " + eventID);
		
		var	cacheKey = "sfbw2015_event_" + eventID;
		
		var	event = localStorage [cacheKey];
		
		if (event)
		{
			event = JSON.parse (event);
			
			console.log ("EventTaglet: cache hit on event ID " + eventID);
			
			// Update url
			if( $('body').hasClass('schedule') ){
				if (Modernizr.history) {
				  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?event='+ event.slug;
				  window.history.pushState({path:newurl},'',newurl);
				}
			}
			else {
				if (Modernizr.history) {
				  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
				  window.history.pushState({path:newurl},'',newurl);
				}	
			}
			
			// Track event load
			if(tracker){
				var title = event.title;
				var venue = event.venue;
				_gaq.push(['_trackEvent', venue, 'Event Click', title]);
				console.log ("Tracking click on event: "+ venue + " : " + title);
			}
			
			// Check if event is in itinerary
			var ev = self.itineraryCheck(event);
			
			var	newContext = new neutrino.janx.DelegateHashMap (inContext);
			newContext.put (this.getPrefix (inElement), ev);
			
			inTreeWalker.walkChildren (inElement, newContext);
			neutrino.DOM.replaceWithChildren (inElement, inElement);
		}
		else if(isNaN(eventID))
		{
			console.log('EventTaglet: event ID is slug '+ eventID);
			
			var	request =
			{
				url: "/json/",
				data: "event=" + eventID,
				dataType: "json",
				async: true,
				type: "GET",
				success: function (inData, inTextStatus, inXHR)
				{
					var	context = inContext;
					
					if (inData.posts.length)
					{
						try { 
							localStorage [cacheKey] = JSON.stringify (inData.posts [0]);
						} catch (e) { }
						
						// Update url
						if( $('body').hasClass('schedule') ){
							if (Modernizr.history) {
							  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?event='+ inData.posts [0].slug;
							  window.history.pushState({path:newurl},'',newurl);
							}
						}
						else {
							if (Modernizr.history) {
							  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
							  window.history.pushState({path:newurl},'',newurl);
							}	
						}
						
						// Track event load
						if(tracker){
							var title = inData.posts [0].title;
							var venue = inData.posts [0].venue;
							_gaq.push(['_trackEvent', venue, 'Direct Link', title]);
							console.log ("Tracking direct link on event: "+ venue + " : " + title);
						}
						
						// Check if event is in itinerary
						var ev = self.itineraryCheck(inData.posts [0]);
						
						context = new neutrino.janx.DelegateHashMap (inContext);
						context.put (self.getPrefix (inElement), ev);
					}
					else
					{
						console.error ("event load returned success with no posts");
					}
				
					// must call fireAsyncEnd()
					// so catch any subwalk errors
					try
					{
						gApplication.nuJanx.janxifyChildren (inElement, context);
					}
					catch (inError)
					{
						console.error (inError);
					}
		
					neutrino.DOM.insertChildrenBefore (inElement, inElement);
					
					self.fireAsyncEnd (inElement, inData);
					inElement.parentNode.removeChild (inElement);
				},
				error: function (inXHR, inTextStatus, inError)
				{
					console.error ("load of event " + eventID + " failed");
					console.error (inError);
					
					// must call fireAsyncEnd()
					// so catch any subwalk errors
					try
					{
						gApplication.nuJanx.janxifyChildren (inElement, inContext);
					}
					catch (inError)
					{
						console.error (inError);
					}
		
					neutrino.DOM.insertChildrenBefore (inElement, inElement);
					self.fireAsyncEnd (inElement, null);
					inElement.parentNode.removeChild (inElement);
				}
			}
			
			// ooo neutrino, old skool async
			this.fireAsyncStart (inElement);
			
			// ASSUME that since this is beerweek we have jQuery available
			// and JSONP issues will be handled
			neutrino.Utils.getURLContents (request);
		}
		else
		{
			// if the eel view is caching, this should never happen
			console.error ("EventTaglet: cache miss on event ID " + eventID + "?!?");
			
			var	request =
			{
				url: "/json/",
				data: "event=" + eventID,
				dataType: "json",
				async: true,
				type: "GET",
				success: function (inData, inTextStatus, inXHR)
				{
					var	context = inContext;
					
					if (inData.posts.length)
					{
						try { 
							localStorage [cacheKey] = JSON.stringify (inData.posts [0]);
						} catch (e) { }
						
						// Update url
						if( $('body').hasClass('schedule') ){
							if (Modernizr.history) {
							  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?event='+ inData.posts [0].slug;
							  window.history.pushState({path:newurl},'',newurl);
							}
						}
						else {
							if (Modernizr.history) {
							  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
							  window.history.pushState({path:newurl},'',newurl);
							}	
						}
						
						// Track event load
						if(tracker){
							var title = inData.posts [0].title;
							var venue = inData.posts [0].venue;
							_gaq.push(['_trackEvent', venue, 'Event Click', title]);
							console.log ("Tracking click on event: "+ venue + " : " + title);
						}
						
						// Check if event is in itinerary
						var ev = self.itineraryCheck(inData.posts [0]);
						
						context = new neutrino.janx.DelegateHashMap (inContext);
						context.put (self.getPrefix (inElement), ev);
					}
					else
					{
						console.error ("event load returned success with no posts");
					}
				
					// must call fireAsyncEnd()
					// so catch any subwalk errors
					try
					{
						gApplication.nuJanx.janxifyChildren (inElement, context);
					}
					catch (inError)
					{
						console.error (inError);
					}
		
					neutrino.DOM.insertChildrenBefore (inElement, inElement);
					
					self.fireAsyncEnd (inElement, inData);
					inElement.parentNode.removeChild (inElement);
				},
				error: function (inXHR, inTextStatus, inError)
				{
					console.error ("load of event " + eventID + " failed");
					console.error (inError);
					
					// must call fireAsyncEnd()
					// so catch any subwalk errors
					try
					{
						gApplication.nuJanx.janxifyChildren (inElement, inContext);
					}
					catch (inError)
					{
						console.error (inError);
					}
		
					neutrino.DOM.insertChildrenBefore (inElement, inElement);
					self.fireAsyncEnd (inElement, null);
					inElement.parentNode.removeChild (inElement);
				}
			}
			
			// ooo neutrino, old skool async
			this.fireAsyncStart (inElement);
			
			// ASSUME that since this is beerweek we have jQuery available
			// and JSONP issues will be handled
			neutrino.Utils.getURLContents (request);
		}
	}
	else
	{
		console.error ("EventTaglet with no id parameter");
		gApplication.nuJanx.janxifyChildren (inElement, inContext);
		neutrino.DOM.insertChildrenBefore (inElement, inElement);
		inElement.parentNode.removeChild (inElement);
	}
	
	return null;
}

