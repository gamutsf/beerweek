// single.js

var SingleView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (SingleView, neutrino.View);

// page/view lifecycle methods

SingleView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("SingleView has been loaded");
}

SingleView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("SingleView is about to become visible");
}

SingleView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("SingleView is now visible");
}

SingleView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("SingleView's markup is now final");
  
  $('.right-column').css('opacity', 1);
	
	$(window).smartresize(function(){
		$('.single-event .venue').addClass('hidden');
		$('.single-event .details').css({'-webkit-transform': 'translateY(0)'});		
		//$('.single-event .event-map .location-more').addClass('hidden');
		//$('.single-event .event-map .location-more').first().removeClass('hidden');
	});
  
}

SingleView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("SingleView's markup is about to become invisible");
}

SingleView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("SingleView's markup is now invisible");
  
  this.slideDown();
}

SingleView.prototype.slideUp = function ()
{
  console.log ("sliding up");
  
  // Get top offset for location details
	var eventH = $('.single-event').height();	
	var mapOffset = $('.single-event .event-map.visibility-mobile').position().top;
	
	console.log(eventH);
	console.log(mapOffset);
	
	//var viewportHeight = $(window).height();
	
	$('.single-event .details').css({'-webkit-transform': 'translateY(-'+ Math.round((mapOffset + 1)) +'px)', '-webkit-transition-duration': '300ms', '-webkit-transition-timing-function': 'ease-out'});
	
	//$('.location-more').css({'opacity': '0', '-webkit-transition': 'opacity .25s ease-in-out'});

}

SingleView.prototype.slideDown = function ()
{

  console.log ("sliding down");
  
  //$('.single-event div').removeClass('slide-up');
  //var viewportHeight = $(window).height();
  
  $('.single-event .venue').addClass('hidden');
  $('.single-event .details').css({'-webkit-transform': 'translateY(0)', '-webkit-transition-duration': '300ms', '-webkit-transition-timing-function': 'ease-out'});
  
 // $('.location-more').css({'opacity': '1', '-webkit-transition': 'opacity .25s ease-in-out'});

}

SingleView.prototype.addToItinerary = function ()
{
  
  // run a check here to see if user is set, else show modal
	if( gApplication.user != 0){
		console.log('Adding '+ this.nuParams.title + ' ('+ this.nuParams.id +') to itinerary!');
		sfbw.itinerary.add(this.nuParams.id, gApplication.user);
		
		var title = this.nuParams.title;
		var venue = this.nuParams.venue;
		_gaq.push(['_trackEvent', venue, 'Itinerary Add', title]);
		console.log ("Tracking itinerary added on event: "+ venue + " : " + title);
	}
	else {
		sfbw.modal.load('login', 'itinerary-not-logged-in');
	}
}

SingleView.prototype.removeFromItinerary = function ()
{

  console.log('Removing '+ this.nuParams.title + ' ('+ this.nuParams.id +') from itinerary!');
  sfbw.itinerary.remove(this.nuParams.id, gApplication.user);

}

SingleView.prototype.shareFacebook = function ()
{
	//alert('Facebook share: '+ this.nuParams.name);
	
	var winWidth = 520;
	var winHeight = 350;
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	
	// Facebook
	var url = $('.facebook.share').data('url');
	var title = $('.facebook.share').data('title');
	
	//var name = this.nuParams.name;
	//var url = this.nuParams.url;
	
	window.open('http://www.facebook.com/sharer.php?u='+ url, 'SF Beer Week 2015', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
	
}

SingleView.prototype.shareTwitter = function ()
{
	//alert('Twitter share: '+ this.nuParams.name);
	
	var winWidth = 520;
  var winHeight = 350;
  var winTop = (screen.height / 2) - (winHeight / 2);
  var winLeft = (screen.width / 2) - (winWidth / 2);
  
  var url = $('.twitter.share').data('url');
	var title = $('.twitter.share').data('title');
	var hashtag = '#sfbeerweek'
	var text = encodeURIComponent(title) +' '+ url +' '+ encodeURIComponent(hashtag);
	
	//var name = this.nuParams.name;
	//var url = this.nuParams.url;
	
	var twitterUrl = 'http://twitter.com/intent/tweet?text='+ text;		
	window.open(twitterUrl, 'SF Beer Week 2015', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
	
}

SingleView.prototype.back = function ()
{
	gApplication.hideView('venueevents');
	
	if (Modernizr.history) {
	  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
	  window.history.pushState({path:newurl},'',newurl);
	}
}