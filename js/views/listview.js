// listview.js

var ListviewView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (ListviewView, neutrino.View);

// page/view lifecycle methods

ListviewView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("ListviewView has been loaded");
}

ListviewView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("ListviewView is about to become visible");
}

ListviewView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("ListviewView is now visible");
}

ListviewView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("ListviewView's markup is now final");
}

ListviewView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("ListviewView's markup is about to become invisible");
}

ListviewView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("ListviewView's markup is now invisible");
}