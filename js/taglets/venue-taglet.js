
/*
  this taglet gets one event from the list
  either from the webdb or from gEvents
  
  HACK - parameters attribute is assumed to be the event ID
*/ 

var	VenueTaglet = function ()
{
	neutrino.janx.AsyncTaglet.call (this);

	this.requiredAttributes = new Array ();
	this.requiredAttributes.push ("slug");
};
neutrino.inherits (VenueTaglet, neutrino.janx.AsyncTaglet);

VenueTaglet.prototype.itineraryCheck = function (event)
{
	console.log('checking if event is in itinerary');
	
	var id = event.id;
	var	cacheKey = "sfbw2015_event_" + id;
	
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
	
	var output = JSON.stringify(event);
	localStorage.setItem(cacheKey, output);  //put the object back
	
	return event;
}

VenueTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	venueSlug = inElement.getAttribute ("slug");
	
	// wow, neutrino's required attributes allows zero length ones
	if (venueSlug && venueSlug.length)
	{
		console.log ("VenueTaglet with venue slug of " + venueSlug);
		
		var	self = this;
		
		var context = inContext;
		
		console.log(gApplication.itinerary);
		
		var	request =
		{
			url: "/json/",
			data: "venue=" + venueSlug,
			dataType: "json",
			async: true,
			type: "GET",
			success: function (inData, inTextStatus, inXHR)
			{
				var posts = inData.posts;
				
				if(posts.length)
				{
					console.log(posts);
					
					var events = [];
					
					for(var i = 0; i < posts.length; i++){
						
						var	cacheKey = "sfbw2015_event_" + posts [i].id;
						
						var	event = localStorage [cacheKey];
						
						if (event)
						{
							event = JSON.parse (event);
							console.log("existing event: "+ event.id);
							
							var ev = self.itineraryCheck(event);
							console.log(ev);
							
							events.push( ev );
						}
						else
						{
							console.log ("caching event " + posts [i].id);
							
							try { 
								localStorage [cacheKey] = JSON.stringify (posts [i]);
							} catch (e) { }
							
							var ev = self.itineraryCheck(posts [i]);
							console.log(ev);
							
							events.push( ev );
						}
					}
				}
				else
				{
					console.error ("venue load returned success with no posts");
				}
				
				context = new neutrino.janx.DelegateHashMap (inContext);
				context.put ("venue", events);
			
				// must call fireAsyncEnd()
				// so catch any subwalk errors
				try
				{
					console.log(context);
					gApplication.nuJanx.janxifyChildren (inElement, context);
				}
				catch (inError)
				{
					console.error (inError);
				}
				
				console.log(context);
				
				neutrino.DOM.insertChildrenBefore (inElement, inElement);
				
				self.fireAsyncEnd (inElement, inData);
				inElement.parentNode.removeChild (inElement);
			},
			error: function (inXHR, inTextStatus, inError)
			{
				console.error ("load of event " + venueSlug + " failed");
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
	
	return null;
}

