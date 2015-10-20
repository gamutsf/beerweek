// subnav.js

var SubnavView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (SubnavView, neutrino.View);

// page/view lifecycle methods

SubnavView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("SubnavView has been loaded");
}

SubnavView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("SubnavView is about to become visible");
}

SubnavView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("SubnavView is now visible");
}

SubnavView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("SubnavView's markup is now final");
}

SubnavView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("SubnavView's markup is about to become invisible");
}

SubnavView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("SubnavView's markup is now invisible");
}

SubnavView.prototype.toggleRegion = function ()
{
	console.log('region toggle: '+ this.nuParams.filter);
	
	var el = $('.sub-nav .region.selector');
	
	$('.sub-nav .date.selector').removeClass('active');
	
	if(el.hasClass('active')){
		el.removeClass('active');
		gApplication.hideView('overlay');
	}
	else {
		el.addClass('active');
		var params = new Object();
				params.filtertype = this.nuParams.filter;
				
		gApplication.showView('overlay', params);
	}
}

SubnavView.prototype.toggleDate = function ()
{
  console.log('date toggle: '+ this.nuParams.filter);
  
  var el = $('.sub-nav .date.selector');
  
  $('.sub-nav .region.selector').removeClass('active');
	
	if(el.hasClass('active')){
		el.removeClass('active');
		gApplication.hideView('overlay');
	}
	else {
		el.addClass('active');
		var params = new Object();
				params.filtertype = this.nuParams.filter;
				
		gApplication.showView('overlay', params);
	}
}

SubnavView.prototype.toggleLists = function ()
{
  console.log('lists toggle: '+ this.nuParams.filter);
  
  var el = $('.sub-nav .lists.selector');
	
	if(el.hasClass('active')){
		el.removeClass('active');
		gApplication.hideView('overlay');
	}
	else {
		el.addClass('active');
		var params = new Object();
				params.filtertype = this.nuParams.filter;
				
		gApplication.showView('overlay', params);
	}
}