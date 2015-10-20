neutrino.provide ("EeljsonView");
neutrino.require ("EelView");

var	EeljsonView = function ()
{
	EelView.call (this);
	
	this.queryParameters =
	[
		"region",
		"date",
		"time",
		"type",
		"q",
		"specials",
		"event",
		"id",
		"sort"
	];
};
neutrino.inherits (EeljsonView, EelView);

EeljsonView.prototype.onDOMReady = function ()
{
	console.log ("EeljsonView.onDOMReady()");
	
	var self = this;
	
	if((gApplication.region != "all") || 
		 (gApplication.date != "all") || 
		 (gApplication.type != "all") || 
		 (gApplication.time != "all"))
	{
		if(!gApplication.direct){
			if (Modernizr.history) {
				console.log('removing querystring: '+ gApplication.direct);
			  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
			  window.history.pushState({path:newurl},'',newurl);
			}
		}
		
		/*
		if(gApplication.date != "all"){
			console.log(gApplication.date);
			var params = new Object();
					params.date = gApplication.date;
			gApplication.showView('eeljson', params);
			gApplication.showView('filters', params);
		}
		*/
		
	}
	
	self.setURLAndQuery ();
	
	// Load itinerary
	if(gApplication.user && !gApplication.itinerary.length){
		console.log('no itinerary loaded, getting it');
		self.getUserItinerary (gApplication.user);
	}
	else {
		console.log('itinerary already loaded, bypassing');
		self.runEelView();
	}
	
	// Change filters to reflect selections
	String.prototype.toProperCase = function () {
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};
	
	
	// Other stuff
	
	function adjustScroller(){
		// Reset horzScroller
	  var filterW = 0;
		$('nav.sub-nav .nav li:visible').each(function() {
		    filterW += $(this).outerWidth(true);
		});
		console.log(filterW);
		
		$('nav.sub-nav .nav').css({
			'width': filterW + 20
		});
		
		if( $('html').hasClass('isWeb') != true ){
		
			$('nav.sub-nav').addClass('scrollable horizontal');
			$('nav.sub-nav.scrollable').on('touchstart', function(event){});
		
		}
	}
  
  if(this.nuParams.date){
	  if( this.nuParams.date == "all" ){
		  gApplication.date = 'all';
		  $('.sub-nav .date.selector .value').html('All Dates');
	  }
	  else {
		  gApplication.date = this.nuParams.date;
	  	$('.sub-nav .date.selector .value').html('Feb '+ this.nuParams.date);
	  	
	  	// Marquee exception
			if( gApplication.date == "6" ){
				console.log('Marquee Event: SF Beer Week Opening Gala');
				
				/*
				var params = new Object();
						params.date = gApplication.date;
				gApplication.showView('feature', params);
				*/
			}
	  }
	  
	  adjustScroller();
  }
  
  if(this.nuParams.region){
	  if( this.nuParams.region == "all" ){
		  gApplication.region = 'all';
		  $('.sub-nav .region.selector .value').html('All Regions');
	  }
	  else {
		  gApplication.region = this.nuParams.region;
	  	$('.sub-nav .region.selector .value').html(this.nuParams.region.replace(/-/g, ' ').toProperCase());
	  }
	  
	  adjustScroller();
  }
  
  if(this.nuParams.type){
	  if( this.nuParams.type == "all" ){
		  gApplication.type = 'all';
		  $('.sub-nav .event-type.selector .value').html('All Event Types');
	  }
	  else {
		  gApplication.type = this.nuParams.type;
	  	$('.sub-nav .event-type.selector .value').html(this.nuParams.type.replace(/-/g, ' ').toProperCase());
	  }
	  
	  adjustScroller();
  }
  
  if(this.nuParams.time){
	  if( this.nuParams.time == "all" ){
		  gApplication.time = 'all';
		  $('.sub-nav .time.selector .value').html('All Times');
	  }
	  else {
		  gApplication.time = this.nuParams.time;
	  	$('.sub-nav .time.selector .value').html(this.nuParams.time.replace(/-/g, ' ').toProperCase());
	  }
	  
	  adjustScroller();
  }
  
  if( this.nuParams.specials == "true" ){
	  gApplication.format = 'week-long-specials';
  	$('.sub-nav .date.selector .value').html('Week-long Specials');
  	adjustScroller();
  }
  else {
	  gApplication.format = 'unique';
  }
  
  /* Sorting */
  
  if( this.nuParams.sort == "newest" ){
	  gApplication.sort = 'newest';
  }
  else {
	  gApplication.sort = '';
  } 
	
}

// EELVIEW IMPLEMENTATION

EelView.prototype.runEelView = function ()
{
	// this calls load() so it has to go after setURLAndQuery()
	EelView.prototype.onDOMReady.call (this);	
}

EelView.prototype.load = function ()
{
	var currentState = 'even';
	var datesArr = [];
	var hidesponsor = false;
	var searchedString;
	
	console.log(gApplication);
	
	// If we're going directly to an event...
	function getQueryVariable(variable)
	{
     var query = window.location.search.substring(1);
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
             var pair = vars[i].split("=");
             if(pair[0] == variable){return pair[1];}
     }
     return(false);
	}

	var eventslug = getQueryVariable('event');
	if(eventslug){
		console.log(eventslug);
	}	
	
	// ASSUME page mode
	// ASSUME page counts from 1, like wp's daft json plugin
	var	page = Math.floor (this.lastLoadedIndex / this.loadSize) + 1;
	var	count = this.loadSize;
	
	var	query = this.query;
	
	if (this.pageAttribute)
	{
		query += this.pageAttribute + "=" + page + "&" + this.countAttribute + "=" + count + "&";
	}
	else
	{
		query += this.offsetAttribute + "=" + this.lastLoadedIndex + "&" + this.limitAttribute + "=" + self.loadSize + "&";
	}

	for (var i = 0; i < this.queryParameters.length; i++)
	{
		var	queryParamName = this.queryParameters [i];
		var	queryParamValue = this.nuParams [queryParamName];
		
		// console.log ("trying for " + queryParamName);
		
		// Auto-switch date
		if( $('body').hasClass('schedule') ){
			if(queryParamName == "date"){
				
				if(!this.nuParams.date && gApplication.date != "all"){
				
					console.log('auto switching date to: '+ gApplication.date);
					$('.sub-nav .date.selector .value').html('Feb '+ gApplication.date);
					queryParamValue = gApplication.date;
					
				}
				
			}
		}
		
		if (queryParamValue && queryParamValue.length)
		{
			// console.log ("adding " + queryParamName + "=" + queryParamValue + "&");
			
			query += queryParamName + "=" + queryParamValue + "&";
			
			// Apply a class to denote filter status
			if(queryParamValue != "all"){
				$('.eventlist').addClass('filtered');
			}
			else {
				$('.eventlist').removeClass('filtered');
			}
			
			if(queryParamName == "q"){
				searchedString = queryParamValue;
				$('.eventlist').removeClass('filtered');
			}
		}
	}
		
	console.log ("loading page " + page);
	
	// HACK if we're loading page 1, get the sponsored ones too
	// sponsored is disgusting, it means i have to teach eeljson about something app specific
	if (page == 1)
	{
		// Remove sponsor header
		$('.sponsor-header').addClass('hidden');
		
		// yuck
		console.log ("turning sponsored flag on");
		
		//query += "showsponsors=true";
	}
	
	// HACK for going right to an event
	if (eventslug)
	{
		console.log ("loading "+ eventslug);
		
		if(page == 1){
			// Go directly to an event, do not pass go, do not collect $200
			var params = new Object();
			params.slug = eventslug;
			
			if( $('html').hasClass('isHandheld') ){
				gApplication.showView('single', params, 'nu-slide-in-from-right');
			}
			else {
				gApplication.showView('single', params);
			}
				
			$('.columns-container').addClass('contract');
			
			setTimeout(function(){
				gApplication.showView('eventwrap', params);
				
				$('.eventlist .event[data-id="'+ gApplication.direct +'"]').addClass('active');
			}, 1);
		}
		
		//query += "event="+ eventslug;	
	}
	
	var	self = this;
	
	this.isLoading = true;
	$("#event-loader").removeClass ('hidden');
	$("#listmeta").addClass ('hidden');
	$('#listmeta .searchedstring').addClass('hidden');
	$('.notfound').addClass('hidden');
	
	// Clean up query by removing trailing ampersand
	console.log('cleaning query from: '+ query);
	query = query.replace(/&+$/, "");
	console.log('to: '+ query);
	
	// Load!
	console.log ("loading from " + this.url + "?" + query);
	
	neutrino.Utils.getURLContents
	({
		url: this.url,
		data: query,
		dataType: "json",
		async: true,
		type: "GET",
		success: function (inData, inTextStatus, inXHR)
		{
			// HACK the JSON feed structure should be abstracted
			var	count = inData.count;
			var	posts = inData.posts;
			
			var total_count = inData.count_total;
			
			// Set post count on eeljson view
			if(posts.length < 1){
				$('#listmeta').addClass('hidden');
				$('.notfound').removeClass('hidden');
				
				if( searchedString ){
					$('.notfound .custom-message').html('Try removing your search term "'+ searchedString +'" for broader results.');
				}
			}
			else if(posts.length == 1){
				$('#listmeta .count').html(total_count);
				$('#listmeta .plural').addClass('hidden');
				
				// Search exception
				if( searchedString ){
					$('#listmeta .searchedstring').html('Matches for "'+ searchedString +'" &ndash; ');
					$('#listmeta .searchedstring').removeClass('hidden');
				}
				
				$('#listmeta').removeClass('hidden');
			}
			else {
				$('#listmeta .count').html(total_count);
				$('#listmeta .plural').removeClass('hidden');
				
				// Search exception
				if( searchedString ){
					$('#listmeta .searchedstring').html('Matches for "'+ searchedString +'" &ndash; ');
					$('#listmeta .searchedstring').removeClass('hidden');
					
					if (Modernizr.history) {
					  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
					  window.history.pushState({path:newurl},'',newurl);
					}
				}
				
				$('#listmeta').removeClass('hidden');
			}
			
			// Hide sponsors if we don't have enough results to warrant that
			if(count <= 2){
				console.log('Should not show sponsors because we have too few results');
				hidesponsor = true;
			}
			
			// this is stupid
			if(!hidesponsor){
				if (inData.sponsors)
				{
					var	sponsors = inData.sponsors;
					
					console.log ("loaded " + sponsors.length + " sponsored events");
					
					for (var i = 0; i < sponsors.length; i++)
					{
						if (self.localStorageCache)
						{
							console.log ("eeljson caching event " + sponsors [i].id);
							
							if(!hidesponsor){
								var title = sponsors [i].title;
								var venue = sponsors [i].venue;
								_gaq.push(['_trackEvent', venue, 'Sponsored Impression', title]);
								console.log ("Tracking sponsor impression on event: "+ venue + " : " + title);
							}
							
							var	cacheKey = "sfbw2015_event_" + sponsors [i].id;
							try { 
								localStorage [cacheKey] = JSON.stringify (sponsors [i]);
							} catch (e) { }
						}
						
						var	temp = document.createElement ("div");
						temp.innerHTML = self.templateElement.innerHTML;
						
						sponsors [i].index = self.lastLoadedIndex + i;
						
						var	context = new neutrino.janx.DelegateHashMap (gApplication.nuRootJanxContext);
						context.put ("post", sponsors [i]);
						
						gApplication.janxify (temp, context);
						
						while (temp.firstChild)
						{
							if (temp.firstChild.nodeType == temp.firstChild.ELEMENT_NODE)
							{
								// DON'T assume these can go in the visible area
								// mark them as in the after spacer
								// and let optimise() sort out which are visible
								var	item = temp.firstChild;
								
								// Check if in itinerary
								var inItinerary = 'itinerary-absent';
								
								if( $.inArray(sponsors [i].id, gApplication.itinerary) > -1 ){
									console.log(sponsors [i].id);
									inItinerary = 'itinerary-added';
									
									// Update the event in localstorage
									var event = JSON.parse(localStorage['sfbw2015_event_'+ sponsors [i].id]);
									event.itinerary = 1;
	
									localStorage.setItem("sfbw2015_event_"+ sponsors [i].id, JSON.stringify(event));  //put the object back
								}
								else {
									// Update the event in localstorage
									var event = JSON.parse(localStorage['sfbw2015_event_'+ sponsors [i].id]);
									event.itinerary = 0;
	
									localStorage.setItem("sfbw2015_event_"+ sponsors [i].id, JSON.stringify(event));  //put the object back
								}
								
								self.contentItemCache [self.lastLoadedIndex + i] = item;
								$(item).addClass ("eel-" + (self.lastLoadedIndex + i) + " sponsorheader");
								$(item).addClass(inItinerary);
							
								if (page == 1)
								{
									self.contentElement.insertBefore (item, self.afterSpacer);
								}
								else
								{
									$(item).addClass ("eel-hidden-after");
									self.hiddenElement.appendChild (item);
								}						
							}
							else
							{
								temp.removeChild (temp.firstChild);
							}
						}
					}
	
					self.lastLoadedIndex += sponsors.length;
				}
			}
			
			console.log ("loaded " + posts.length + " events");
			
			for (var i = 0; i < posts.length; i++)
			{
				if (self.localStorageCache)
				{
					// console.log ("eeljson caching event " + posts [i].id);
					
					var	cacheKey = "sfbw2015_event_" + posts [i].id;
					try { 
						localStorage [cacheKey] = JSON.stringify (posts [i]);
					} catch (e) { }			
				}
				
				var	temp = document.createElement ("div");
				temp.innerHTML = self.templateElement.innerHTML;
				
				posts [i].index = self.lastLoadedIndex + i;
				
				var	context = new neutrino.janx.DelegateHashMap (gApplication.nuRootJanxContext);
				context.put ("post", posts [i]);
				
				gApplication.janxify (temp, context);
				
				while (temp.firstChild)
				{
					if (temp.firstChild.nodeType == temp.firstChild.ELEMENT_NODE)
					{
						// DON'T assume these can go in the visible area
						// mark them as in the after spacer
						// and let optimise() sort out which are visible
						var	item = temp.firstChild;
						
						if(! $('.eventlist').hasClass('filtered') ){
							var date = posts [i].date_slug;
							
							datesArr.push(date);
							
							//console.log(datesArr);
							
							if( datesArr.length ){
								if( date != datesArr[datesArr.length-2] ){
									if(currentState == 'even'){
										currentState = 'odd';
									}
									else {
										currentState = 'even';
									}
								}
							}
						}
						else {
							if(currentState == 'even'){
								currentState = 'odd';
							}
							else {
								currentState = 'even';
							}
						}
						
						// Check if in itinerary
						var inItinerary = 'itinerary-absent';
						
						if( $.inArray(posts [i].id, gApplication.itinerary) > -1 ){
							console.log(posts [i].id);
							inItinerary = 'itinerary-added';
							
							// Update the event in localstorage
							var event = JSON.parse(localStorage['sfbw2015_event_'+ posts [i].id]);
							event.itinerary = 1;
	
							localStorage.setItem("sfbw2015_event_"+ posts [i].id, JSON.stringify(event));  //put the object back
						}
						else {
							// Update the event in localstorage
							var event = JSON.parse(localStorage['sfbw2015_event_'+ posts [i].id]);
							event.itinerary = 0;
	
							localStorage.setItem("sfbw2015_event_"+ posts [i].id, JSON.stringify(event));  //put the object back
						}
						
						self.contentItemCache [self.lastLoadedIndex + i] = item;
						$(item).addClass ("eel-" + (self.lastLoadedIndex + i));
						$(item)
							.attr({'data-date': posts [i].date_slug})
							.addClass(currentState)
							.addClass(inItinerary);
						
						if (page == 1)
						{
							self.contentElement.insertBefore (item, self.afterSpacer);
						}
						else
						{
							$(item).addClass ("eel-hidden-after");
							self.hiddenElement.appendChild (item);
						}						
					}
					else
					{
						temp.removeChild (temp.firstChild);
					}
				}
			}
			
			if (posts.length < self.loadSize)
			{
				// ASSUME end reached here
				console.log ("received length less than requested length, assuming full");
				
				self.isFullyLoaded = true;
				//$('.notfound').addClass('hidden');
				$('.listmeta').removeClass('hidden');
			}
			
			self.lastLoadedIndex += posts.length;

			$("#first-loaded-index").html (self.firstLoadedIndex);
			$("#last-loaded-index").html (self.lastLoadedIndex);

			self.optimise ();
			
			self.isLoading = false;
			self.loaderVisible = false;
			$("#event-loader").addClass ('hidden');
			$("#loading-indicator").remove (); // Change this to a class
			
			if(page == 1){
				// Check for sponsorheader
			  if ($('.eel-0').hasClass('sponsorheader') && !hidesponsor){				  
				  $('.sponsor-header').removeClass('hidden');				  
			  }
			  else {
				  $('.sponsor-header, .sponsorheader').addClass('hidden');
			  }
			  
			  window.scrollTo( 0,0 );
			  
			  /*
			  // Go directly to an event, do not pass go, do not collect $200
				if(eventslug){
					var params = new Object();
					params.slug = eventslug;
					
					if( $('html').hasClass('isHandheld') ){
						gApplication.showView('single', params, 'nu-slide-in-from-right');
					}
					else {
						gApplication.showView('single', params);
					}
						
					$('.columns-container').addClass('contract');
					
					setTimeout(function(){
						gApplication.showView('eventwrap', params);
						
						$('#list .event[data-id="'+ gApplication.direct +'"]').addClass('active');
					}, 1);
				}
				*/
			}
			else {
				if (Modernizr.history) {
				  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
				  window.history.pushState({path:newurl},'',newurl);
				}
			}
			
			// Lazy load images
			$("img.lazy").lazyload();
			
			// CACHE SHIT
			//var cacheLifeTime = 5 * 60 * 1000;
			//gApplication.nuCache.put (query, inData, cacheLifeTime);
			
		},
		error: function (inXHR, inTextStatus, inError)
		{
			console.error ("load of " + url + " failed");
			console.error (inError);

			self.isLoading = false;
			self.loaderVisible = false;
			$("#event-loader").addClass ('hidden');
			$("#loading-indicator").remove ();
		}
	});
}

EelView.prototype.getUserItinerary = function (id)
{
	console.log ("EeljsonView.getUserItinerary()");
	
	var self = this;
	
	neutrino.Utils.getURLContents
	({
		url: '/user/?view=simple&id='+ id,
		dataType: "json",
		async: true,
		type: "GET",
		success: function (inData, inTextStatus, inXHR)
		{
			// HACK the JSON feed structure should be abstracted
			var	posts = inData.posts;
			
			// Wipe old itinerary first
			gApplication.itinerary = [];
			
			// Loop through posts and add to itinerary array
			for(var x = 0; x < posts.length; x++){
				gApplication.itinerary.push(posts [x]);
			}
			
			console.log(gApplication.itinerary);
			
			self.runEelView();
			
		},
		error: function (inXHR, inTextStatus, inError)
		{
			console.error ("load of " + url + " failed");
			console.error (inError);
		}
	});
}

EelView.prototype.updateUserItinerary = function (id, eventid)
{
	console.log ("EeljsonView.updateUserItinerary()");
	
	// Update the event in localstorage
	//var event = JSON.parse(localStorage['sfbw2015_event_'+ eventid]);
	//event.itinerary = 0;
	
	//localStorage.setItem("sfbw2015_event_"+ id, JSON.stringify(event));  //put the object back
}


EelView.prototype.setURLAndQuery = function ()
{
	this.url = this.nuElement.getAttribute ("url");
	
	var	queryIndex = this.url.indexOf ("?");
	
	if (queryIndex >= 0)
	{
		if (queryIndex == (this.url.length - 1))
		{
			this.query = "";
		}
		else
		{
			this.query = this.url.substring (queryIndex + 1);
			
			// so we can treat "" and the regular query alike later in the data formulation
			if (this.query.charAt (this.query.length - 1) != "&")
			{
				this.query += "&";
			}
		}
		
		this.url = this.url.substring (0, queryIndex);
	}
	else
	{
		this.query = "";
	}
}
