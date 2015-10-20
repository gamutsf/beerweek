// graphheader.js

var GraphheaderView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (GraphheaderView, neutrino.View);

// page/view lifecycle methods

GraphheaderView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("GraphheaderView has been loaded");
}

GraphheaderView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("GraphheaderView is about to become visible");
}

GraphheaderView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("GraphheaderView is now visible");
}

GraphheaderView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("GraphheaderView's markup is now final");  
}

GraphheaderView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("GraphheaderView's markup is about to become invisible");
}

GraphheaderView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("GraphheaderView's markup is now invisible");
}