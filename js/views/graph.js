// graph.js

var GraphView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (GraphView, neutrino.View);

// page/view lifecycle methods

GraphView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("GraphView has been loaded");
}

GraphView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("GraphView is about to become visible");
}

GraphView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("GraphView is now visible");
}

GraphView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("GraphView's markup is now final");
  
	setTimeout(function(){
	  $('.visualization').each(function(i){
	  
		  var start = $(this).data('start');
		  var end = $(this).data('end');
		  
		  // Define start position offset
		  if(start < 9){
			  var offset = -22;
		  } 
		  else if(start == 9){
		  	var offset = 0;
		  } 
		  else {
		  	var offset = (start - 9) * 23;
		  }
		  
		  // Define width
		  if(end < 9 || end == 0){
		  	var differential = (end + 24) - start;
		  } 
		  else {
		  	var differential = end - start;
		  }
		  
		  if(start < 9){
		  	var width = differential * 23;
		  } 
		  else {
		  	var width = differential * 23;
		  }
		  
		  $(this).css({'width': width, 'left': offset});
	  });
  }, 1);
  
}

GraphView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("GraphView's markup is about to become invisible");
}

GraphView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("GraphView's markup is now invisible");
}