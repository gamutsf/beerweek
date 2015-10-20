// header.js

var HeaderView = function ()
{
  neutrino.View.call (this);
}
neutrino.inherits (HeaderView, neutrino.View);

// page/view lifecycle methods

HeaderView.prototype.onLoaded = function ()
{
  neutrino.View.prototype.onLoaded.call (this);
  
  console.log ("HeaderView has been loaded");
}

HeaderView.prototype.onBeforeVisible = function (inRunDynamics)
{
  neutrino.View.prototype.onBeforeVisible.call (this, inRunDynamics);

  console.log ("HeaderView is about to become visible");
}

HeaderView.prototype.onVisible = function ()
{
  neutrino.View.prototype.onVisible.call (this);

  console.log ("HeaderView is now visible");
}

HeaderView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);

  console.log ("HeaderView's markup is now final");
}

HeaderView.prototype.onBeforeInvisible = function ()
{
  neutrino.View.prototype.onBeforeInvisible.call (this);

  console.log ("HeaderView's markup is about to become invisible");
}

HeaderView.prototype.onInvisible = function ()
{
  neutrino.View.prototype.onInvisible.call (this);

  console.log ("HeaderView's markup is now invisible");
}

HeaderView.prototype.login = function ()
{
	sfbw.modal.load('login');
}

HeaderView.prototype.logout = function ()
{
  sfbw.user.logout('true');
}