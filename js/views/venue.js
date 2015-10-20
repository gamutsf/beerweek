// venue.js

var VenueView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (VenueView, neutrino.View);

// page/view lifecycle methods

VenueView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("VenueView has been loaded");
}

VenueView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("VenueView is about to become visible");
}

VenueView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("VenueView is now visible");
}

VenueView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("VenueView's markup is now final");
}

VenueView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("VenueView's markup is about to become invisible");
}

VenueView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("VenueView's markup is now invisible");
}

VenueView.prototype.checkitinerary = function ()
{
  console.log ("Checking if this event is in the itinerary");
}