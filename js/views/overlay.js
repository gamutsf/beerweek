// overlay.js

var OverlayView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (OverlayView, neutrino.View);

// page/view lifecycle methods

OverlayView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("OverlayView has been loaded");
}

OverlayView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("OverlayView is about to become visible");
}

OverlayView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("OverlayView is now visible");
}

OverlayView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("OverlayView's markup is now final");
  
  document.querySelector('.overlay').addEventListener('touchmove', function (e) { 
		e.preventDefault(); 
	});
	
	// Region
	$('#overlay .region-selector .selector').removeClass('active');
	$('#overlay .region-selector #'+ gApplication.region).addClass('active');
	
	// Date
	$('#overlay .date-selector .selector').removeClass('active');
	$('#overlay .date-selector #'+ gApplication.date).addClass('active');
	
		// Event Format
		$('#overlay .date-selector .format-selector').removeClass('active');
		$('#overlay .date-selector .format-selector#'+ gApplication.format).addClass('active');
		
		if(gApplication.format == "week-long-specials"){
			$('#overlay .date-selector #week-long-specials').addClass('active');
		}
		else {
			$('#overlay .date-selector #week-long-specials').removeClass('active');
		}
	
	// Event Type
	if(gApplication.type){
		$('#overlay .type-selector .selector').removeClass('active');
		$('#overlay .type-selector #'+ gApplication.type).addClass('active');
	}
	
	// Date
	if(gApplication.time){
		$('#overlay .time-selector .selector').removeClass('active');
		$('#overlay .time-selector #'+ gApplication.time).addClass('active');
	}
	
	// Lists
	if(gApplication.list){
		$('#overlay .lists-selector .selector').removeClass('active');
		$('#overlay .lists-selector #'+ gApplication.list).addClass('active');
	}
}

OverlayView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("OverlayView's markup is about to become invisible");
}

OverlayView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("OverlayView's markup is now invisible");
}

OverlayView.prototype.toggleList = function ()
{
  console.log ("toggleList()");
  
  var list = this.nuParams.list;
  
  if (Modernizr.history) {
	  var newurl = 'http://www.sfbeerweek.org/lists/'+ list + '/';
	  window.history.pushState({path:newurl},'',newurl);
	}
	
	if( $('html').hasClass('isHandheld') ){
		gApplication.hideView('listsintro');
	}
}