// filters.js

var FiltersView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (FiltersView, neutrino.View);

// page/view lifecycle methods

FiltersView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("FiltersView has been loaded");
}

FiltersView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("FiltersView is about to become visible");
}

FiltersView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("FiltersView is now visible");
}

FiltersView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("FiltersView's markup is now final");
  
  // Show the callout
  $('.rail .callout').removeClass('hidden');
  
  if(this.nuParams.time && (this.nuParams.time != "all")){
	  console.log('selected time is: '+ this.nuParams.time);
	  
	  var selection = this.nuParams.time;
	  var times = selection.split(',');
	  
	  for(var x = 0; x < times.length; x++){
		  $('.filter-time li[data-slug="'+ times[x] +'"]').addClass('active');
	  }
	  
	  // Show the clear button
		$('.filter-time .clear').removeClass('hidden');
  }
  
  if(this.nuParams.type && (this.nuParams.time != "all")){
	  console.log('selected type is: '+ this.nuParams.type);
	  
	  var selection = this.nuParams.type;
	  var types = selection.split(',');
	  
	  for(var x = 0; x < types.length; x++){
		  $('.filter-event-type li[data-slug="'+ types[x] +'"]').addClass('active');
	  }
	  
	  // Show the clear button
		$('.filter-event-type .clear').removeClass('hidden');
  }
  
  // Show sort options
  gApplication.showView('sortdropdown');
}

FiltersView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("FiltersView's markup is about to become invisible");
}

FiltersView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("FiltersView's markup is now invisible");
}

// Event Type
FiltersView.prototype.eventType = function ()
{	
	// Clear open event
	this.clear();
	
  // Load up existing values
  var temp = gApplication.type.split(',');
  		temp = $.grep(temp,function(n){ return(n) });
	  
  var value = this.nuParams.slug;
  if(value != ""){
  
	  // First, remove all
	  if(temp.indexOf("all") > -1){			  
		  temp.splice(temp.indexOf("all"), 1);
	  }
	  
	  // If it's already there, remove it
	  if(temp.indexOf(value) > -1){
		  console.log('Removing '+ value);			  
		  temp.splice(temp.indexOf(value), 1);
	  }
	  // Not there, so add it
	  else {
		  temp.push(value);
	  }
	  
	  // If it's empty, empty it
	  if(temp.length < 1){
		  temp = null;
		  temp = [];
		  
		  // Hide the clear button
			$('.filter-event-type .clear').addClass('hidden');
	  }
	  else {
		  // Show the clear button
			$('.filter-event-type .clear').removeClass('hidden');
	  }
	  
	  console.log(temp);
	  
	  // Make it a global
	  gApplication.type = temp.join();
	  
  }
  else {
	  gApplication.type = '';
	  
	  // Hide the clear button
	  $('.filter-event-type .clear').addClass('hidden');
  }
  
  var params = new Object();
  		params.type = gApplication.type;
  
  gApplication.showView('eeljson', params);
  //gApplication.showView('filters', params);
}

// Time
FiltersView.prototype.time = function ()
{	
	// Clear open event
	this.clear();
	
  // Load up existing values
  var temp = gApplication.time.split(',');
  		temp = $.grep(temp,function(n){ return(n) });
	  
  var value = this.nuParams.slug;
  if(value != ""){
  
	  // First, remove all
	  if(temp.indexOf("all") > -1){			  
		  temp.splice(temp.indexOf("all"), 1);
	  }
	  
	  // If it's already there, remove it
	  if(temp.indexOf(value) > -1){			  
		  temp.splice(temp.indexOf(value), 1);
	  }
	  // Not there, so add it
	  else {
		  temp.push(value);
	  }
	  
	  // If it's empty, empty it
	  if(temp.length < 1){
		  temp = null;
		  temp = [];
		  
		  // Hide the clear button
			$('.filter-time .clear').addClass('hidden');
	  }
	  else {
		  // Show the clear button
			$('.filter-time .clear').removeClass('hidden');
	  }
	  
	  console.log(value);
	  
	  // Make it a global
	  gApplication.time = temp.join();
	  
  }
  else {
	  gApplication.time = '';
	  
	  // Hide the clear button
	  $('.filter-time .clear').addClass('hidden');
  }
  
  var params = new Object();
  		params.time = gApplication.time;
  
  gApplication.showView('eeljson', params);
  //gApplication.showView('filters', params);	
}

FiltersView.prototype.clear = function ()
{	
	console.log('FiltersView.clear()');
	
	SingleView.prototype.back.call(this);
}