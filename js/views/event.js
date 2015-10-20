// venue.js

var EventView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (EventView, neutrino.View);

// page/view lifecycle methods

EventView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("EventView has been loaded");
}

EventView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("EventView is about to become visible");
}

EventView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("EventView is now visible");
}

EventView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("EventView's markup is now final");
  
  //$('#single-loader').addClass('hidden');
  
  var event_detail = document.querySelector(".event-detail");
	new ScrollFix(event_detail);
	
	this.setCurrent(this.nuParams.id);
  
  function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
	}
  
  // Fix URLs that don't have http set (because of base tag)
  $('.single-event .event-description').find('a').each(function(){  
		var url = $(this).attr('href');
		if(url.substr(0,4) != "http"){
			$(this).attr({'href': 'http://' + url});
		}		
	});
	
	// Line Breaks in descriptions
	function nl2br(str, is_xhtml) {
  	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
		return (str + '')
    	.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}

	$('.single-event .event-description.nl2br').each(function(){
				
		var description = $(this).html();
		var new_description = linkify(description.replace(/(<br\s*\/?>){3,}/gi, '<br><br>'));
		
		$(this).html(new_description);
	});
	
	// Load Social buttons
	// Twitter
	var twitterUrl = $('.twitter.share').data('url');
	var twitterTitle = $('.twitter.share').data('title');
	$('.twitter.share').html('<a href="https://twitter.com/share" class="twitter-share-button" data-lang="en" data-url="'+ twitterUrl +'" data-text="'+ twitterTitle +'" data-count="none" data-hashtags="sfbeerweek">Tweet</a>');
	
	twttr.widgets.load();
	
	// Facebook
	var fbUrl = $('.facebook.share').data('url');
	var fbTitle = $('.facebook.share').data('title');
	$('.facebook.share').html('<div id="fb"><fb:share-button href="'+ fbUrl +'" width="57" type="button"></fb:share-button></div>');
	
	FB.XFBML.parse();

}

EventView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("EventView's markup is about to become invisible");
}

EventView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("EventView's markup is now invisible");
}

EventView.prototype.setCurrent = function (id)
{
  // Set newly selected events
  if(id != undefined){
	  console.log ("Set new event as current: "+ id);
  	$('.location-more').attr({'data-id': id}).data('id', id);
  }
}

EventView.prototype.saveOrigin = function ()
{
	var id = this.nuParams.origin;
	
  // Set origin event
  if(id != undefined){
	  console.log ("Set event as origin: "+ id);
  	$('div[nu-view-key="venueevents"] .back-btn').attr({'data-origin': id}).data('origin', id);
  	
  	// Mark event in venue list as current
  	$('.venue .event').removeClass('current');
		$('.venue .event[data-id="'+ id +'"]').addClass('current');
  }
}