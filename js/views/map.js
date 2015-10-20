// venuelist.js

var MapView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (MapView, neutrino.View);

// page/view lifecycle methods

MapView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("MapView has been loaded");
}

MapView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("MapView is about to become visible");
}

MapView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("MapView is now visible");
}

MapView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("MapView's markup is now final");
  
  var address = this.nuParams.address;
  var city = this.nuParams.city;
  var zip = this.nuParams.zip;
  
  setTimeout(function(){
	  var lat = $('.map').data('lat');
	  var lng = $('.map').data('lng');
	  var venue = $('.map').data('venue');
	  
	  console.log(lat + ', ' + lng);
	  
	  var maplink = 'http://maps.google.com/maps?z=15&t=m&q='+ venue + '+' + address + '+' + city + '+' + zip;
	  
	  var contentString = '<div class="event-info clearfix" style="cursor:pointer;">'+
	  											'<div class="flex1">'+
	  											'<div class="venue-name" style="font-family: Helvetica, Arial; font-size:12px; font-weight:600; width: 175px; overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ venue +'</div>'+
	  											'<div class="venue-addr" style="font-family: Helvetica, Arial; font-size:12px; color:#d4d4d4; width: 175px; overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ address +'</div>'+
	  											'<div class="venue-citystatezip" style="font-family: Helvetica, Arial; font-size:12px; color:#d4d4d4; width: 175px; overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ city +' CA, '+ zip +'</div>'+
	  											'</div>'+
	  											'<div class="right-arrow" style="font-family:\'modern_pictograms_proregular\' !important; font-size:40px !important; color:#d4d4d4;">&#8212;</div>'+
	  										'</div>';
	  
	  $('.map').html('<div class="googlemap"><a class="infobubble" href="'+ maplink +'" target="_blank">'+ contentString +'</a></div>');
	  
	  // Lazy load image
		var objImage = new Image();
		objImage.onload = function(){
				$('.map .googlemap')
		  	.css({
			  	'background-image': 'url(https://maps.googleapis.com/maps/api/staticmap?center='+ lat +','+ lng +'&zoom=15&scale=2&size=640x640&key=AIzaSyBycztWmnF7abv_NxCIkC9tpP3jcoPSghw)',
			  	'opacity': 1
			  });
		}
		objImage.src = 'https://maps.googleapis.com/maps/api/staticmap?center='+ lat +','+ lng +'&zoom=15&scale=2&size=640x640&key=AIzaSyBycztWmnF7abv_NxCIkC9tpP3jcoPSghw';
	}, 1);
}

MapView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("MapView's markup is about to become invisible");
}

MapView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("MapView's markup is now invisible");
}