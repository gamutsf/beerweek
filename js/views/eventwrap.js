// eventwrap.js

var EventwrapView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (EventwrapView, neutrino.View);

// page/view lifecycle methods

EventwrapView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("EventwrapView has been loaded");
}

EventwrapView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("EventwrapView is about to become visible");
  
  /*
  if( $('html').hasClass('isHandheld') == true ){
  	this.removeMap('mobile');
  }
  if( $('html').hasClass('isHandheld') == false ){
  	this.removeMap('web');
  }
  */
}

EventwrapView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("EventwrapView is now visible");
  
  /*
  var self = this;	
	var isMobile = false;
  var isWeb = true;
  
  // Get single event height
	
  function getEventHeight(){
  	var winH = $(window).height();
  	if($('body').hasClass('isWeb')){
	  	var offset = 128;
  	}
  	if($('body').hasClass('isTablet')){
	  	var offset = 128;
  	}
  	if($('body').hasClass('isHandheld')){
	  	var offset = 54;
  	}
  	
		$('.single-event').css('height', winH - offset);
  }
  
  if($('html').hasClass('cssanimations') == false){
	  getEventHeight();
	  
	  $(window).resize(function(){
		  getEventHeight();
	  });
  }
  */
  
  /*
  if( $('html').hasClass('isHandheld') == true ){
  	if(!isMobile){
	  	//removeMap('web');
		  self.initMap('mobile');
		  isMobile = true;
		  isWeb = false;
	  }
  }
  
  $(window).smartresize(function(){
  	if( $('html').hasClass('isHandheld') == true ){
	  	if(!isMobile){
		  	self.removeMap('web');
		  	self.initMap('mobile');
		  	isMobile = true;
		  	isWeb = false;
		  }
	  }
  });
  */
}

EventwrapView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("EventwrapView's markup is now final");
  
  /*
  var venue_list = document.querySelector(".event-map");
	new ScrollFix(venue_list);
	
	var self = this;	
	var isMobile = false;
  var isWeb = true;
  
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
		
		if( $('html').hasClass('isHandheld') == true ){
	  	setTimeout(function(){
		  	self.initMap('mobile');
		  	isMobile = true;
		  	isWeb = false;
	  	}, 1000);
	  }
	  else {
		  setTimeout(function(){
		  	self.initMap('web');
		  	isMobile = false;
				isWeb = true;
			}, 1000);
  	}
		
	}
	else {
		
		if( $('html').hasClass('isHandheld') == false ){
	  	//self.removeMap('mobile');
	  	if(!gApplication.localStorage){
		  	setTimeout(function(){
		  		self.initMap('web');
		  		isMobile = false;
					isWeb = true;
		  	}, 500);
	  	}
	  	else {
		  	self.initMap('web');
		  	isMobile = false;
				isWeb = true;
	  	}
	  }
		
	}
  
  $(window).smartresize(function(){
  	if( $('html').hasClass('isHandheld') == true ){
	  	if(!isMobile){
		  	self.removeMap('web');
		  	self.initMap('mobile');
		  	isMobile = true;
		  	isWeb = false;
		  }
	  }
	  if( $('html').hasClass('isHandheld') == false ){
	  	if(isWeb == false){
	  		self.removeMap('mobile');
				self.initMap('web');
				isMobile = false;
				isWeb = true;
	  	}
	  }
  });
  */
}

EventwrapView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("EventwrapView's markup is about to become invisible");
  
  /*
  console.log('is the map loaded? '+ mapsLoaded);
  
  if( $('html').hasClass('isHandheld') == true ){
  	this.removeMap('mobile');
  }
  if( $('html').hasClass('isHandheld') == false ){
  	this.removeMap('web');
  }
  */
}

EventwrapView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("EventwrapView's markup is now invisible");
}

EventwrapView.prototype.initMap = function (type)
{
  console.log ("Init map");
  
  /*
  console.log(type);
  
  // Map
  var map, marker, infobox, mapEl, draggable;
	
	//console.log(gApplication.nuBrowser);
	if( gApplication.nuBrowser.isMobile || gApplication.nuBrowser.isIPad ){
		draggable = false;
	} else {
		draggable = true;
	}

	if(type == "web"){
		mapEl = document.querySelectorAll('.map')[0];
	}
	if(type == "mobile"){
		mapEl = document.querySelectorAll('.map')[1];
	}	
  
	var markerPos = new google.maps.LatLng($(mapEl).data('lat'), $(mapEl).data('lng'));
	console.log(markerPos);
	
	var mapOptions = {
    zoom: 15,
    center: markerPos,
    scrollwheel: false,
    mapTypeControl: false,
		panControl: false,
		zoomControl: false,
		streetViewControl: false,
		draggable: draggable,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.TOP_LEFT
		},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  
  map = new google.maps.Map(mapEl, mapOptions);
  //map.panBy(0,-50);
  
  if($('html').hasClass('isWeb') == false){
	  map.panBy(0, -50);
  }
  
  var venue = $(mapEl).data('venue').replace("#039;", "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, " ");
  var address = $(mapEl).data('addr');
  var city = $(mapEl).data('city');
  var zip = $(mapEl).data('zip');
  
  var maplink = 'http://maps.google.com/maps?z=15&t=m&q='+ venue + '+' + address + '+' + city + '+' + zip;
  
  google.maps.event.addListenerOnce(map, 'idle', function(){
  	mapsLoaded = true;  	
	});
  
  google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(markerPos);
		
		if($('html').hasClass('isHandheld') == true){
		  map.panBy(0, -50);
	  }
	});
  
  var marker = new google.maps.Marker({
      position: markerPos,
      map: map,
      visible: false
  });
  
  var event = $(mapEl);
  var contentString = '<div class="event-info clearfix" onclick="window.open(\''+ maplink +'\');" style="cursor:pointer;">'+
  											'<div class="flex1">'+
  											'<div class="venue-name" style="font-family: Helvetica, Arial; font-size:12px; font-weight:600; width: 175px; overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ event.data('venue') +'</div>'+
  											'<div class="venue-addr" style="font-family: Helvetica, Arial; font-size:12px; color:#d4d4d4; width: 175px; overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ event.data('addr') +'</div>'+
  											'<div class="venue-citystatezip" style="font-family: Helvetica, Arial; font-size:12px; color:#d4d4d4; width: 175px; overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ event.data('city') +' CA, '+ event.data('zip') +'</div>'+
  											'</div>'+
  											'<div class="right-arrow" style="font-family:\'modern_pictograms_proregular\' !important; font-size:40px !important; color:#d4d4d4;">&#8212;</div>'+
  										'</div>';
  
  infoBubble = new InfoBubble({
    map: map,
    content: contentString,
    position: markerPos,
    shadowStyle: 0,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 0,
    arrowSize: 10,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0)',
    disableAutoPan: true,
    hideCloseButton: true,
    arrowPosition: 50,
    backgroundClassName: 'infobubble',
    arrowStyle: 0,
    minWidth: 240,
    maxWidth: 240,
    maxHeight: 70
  });

  infoBubble.open(map, marker);
  //infoBubble.setBubbleOffset(0,0);
  */
  
}

EventwrapView.prototype.removeMap = function (type)
{
  console.log ("Removing map");
  $('.visibility-'+ type +' .map').empty();
}