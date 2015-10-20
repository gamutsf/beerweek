// listsintroview.js

var ListsintroView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (ListsintroView, neutrino.View);

// page/view lifecycle methods

ListsintroView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("ListsintroView has been loaded");
}

ListsintroView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("ListsintroView is about to become visible");
}

ListsintroView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("ListsintroView is now visible");
}

ListsintroView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("ListsintroView's markup is now final");
  
  var slug = this.nuParams.slug;
  var name = this.nuParams.name;
  var title = this.nuParams.title;
  var twitter = this.nuParams.twitter;
  
  console.log(slug + '/' + name + '/' + title + '/' + twitter);
  
  $('.sub-nav .selector.lists .value').html(name);
  gApplication.list = slug;
  
  /***/
  
  if( $('html').hasClass('isHandheld') ){
	  var filterW = 0;
		$('nav.sub-nav .nav li:visible').each(function() {
		    filterW += $(this).outerWidth(true);
		});
		console.log(filterW);
		
		$('nav.sub-nav .nav').css({
			'width': filterW + 20
		});
		
		$('nav.sub-nav').addClass('scrollable horizontal');
		$('nav.sub-nav.scrollable').on('touchstart', function(event){});
	}
  
  /***/
  
  $('.lists .sub-nav .share').on('click', function(){
	  sfbw.lists.share('http://www.sfbeerweek.org/lists/'+ slug +'/', name, title, twitter); 
	  setTimeout(function(){
	  	sfbw.modal.load('listshare');
	  }, 1);
  });
  
  // Load Social buttons
  
  // Facebook
	FB.XFBML.parse();
  
  // Twitter
	$('.lists .right-column.intro .twitter').html('<a href="https://twitter.com/'+ twitter +'" class="twitter-follow-button" data-show-count="false">Follow @'+ twitter +'</a>');
	
	twttr.widgets.load();

}

ListsintroView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("ListsintroView's markup is about to become invisible");
}

ListsintroView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("ListsintroView's markup is now invisible");
}