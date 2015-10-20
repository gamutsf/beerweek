neutrino.provide ("EelView");
neutrino.require ("neutrino.View");

var	EelView = function ()
{
	neutrino.View.call (this);
};
neutrino.inherits (EelView, neutrino.View);

EelView.prototype.onDOMReady = function ()
{
	neutrino.View.prototype.onDOMReady.call (this);

	console.log ("EelView.onDOMReady()");
	
	this.setContentElement ();
	
	this.contentItemCache = new Array ();
	this.firstVisibleIndex = 0;
	this.lastVisibleIndex = 0;
	this.previousFirstVisibleIndex = 0;
	this.lastLoadedIndex = 0;
	this.deferredScrollPosition = -1;
	
	this.isLoading = false;
	this.isFullyLoaded = false;
	this.scrollingEnabled = true;
	
	this.windowSize = neutrino.DOM.getIntegerAttribute (this.nuElement, "windowsize", 100);
	this.loadSize = neutrino.DOM.getIntegerAttribute (this.nuElement, "loadsize", 50);
	this.loadThreshold = neutrino.DOM.getIntegerAttribute (this.nuElement, "loadthreshold", 20);

	this.localStorageCache = neutrino.DOM.getBooleanAttribute (this.nuElement, "localstorage", false);
	this.optimiseListSize = neutrino.DOM.getBooleanAttribute (this.nuElement, "optimise", true);
	this.expandAfterSpacer = neutrino.DOM.getBooleanAttribute (this.nuElement, "expandafterspacer", true);
	this.scrollWhileLoading = neutrino.DOM.getBooleanAttribute (this.nuElement, "scrollwhileloading", true);
	
	this.pageAttribute = this.nuElement.getAttribute ("pageattribute");
	this.queryAttribute = this.nuElement.getAttribute ("query");
	this.loaderVisible = false;
	
	if (this.pageAttribute && this.pageAttribute.length)
	{
		// page mode, where we have page & count
		// as opposed to offset & limit
		// like WP's JSON API, for example
		this.countAttribute = this.nuElement.getAttribute ("countAttribute");
	}
	else
	{
		this.offsetAttribute = this.nuElement.getAttribute ("offsetattribute");
		this.limitAttribute = this.nuElement.getAttribute ("limitattribute");
	}
	
	this.viewAttribute = this.nuElement.getAttribute ("viewattribute");
	
	this.contentHeight = this.getComputedHeight (this.contentElement);
	$("#content-height").html (this.contentHeight);
	
	this.beforeSpacer = document.createElement ("li");
	$(this.beforeSpacer).attr ("class", "eel-before-spacer");
	$(this.beforeSpacer).css ({
		"visibility": "hidden", 
		"height": "0px", 
		"padding": "0px"
	});
	this.contentElement.appendChild (this.beforeSpacer);
	
	this.afterSpacer = document.createElement ("li");
	$(this.afterSpacer).attr ("class", "eel-after-spacer");
	$(this.afterSpacer).css ({
		"visibility": "hidden", 
		"height": "0px", 
		"padding": "0px"
	});
	this.contentElement.appendChild (this.afterSpacer);
	
	// console.log ("onDOMReady() requesting load");
	
	this.load ();
}

/*
EelView.prototype.refresh = function ()
{
	console.log ("EelView.refresh()");
	
	// actually don't call the superclass
	// as we handle the refresh
	// this is a HACK and eel should operate properly within Neu view rules
	// neutrino.View.prototype.refresh.call (this);
	
	this.contentElement.innerHTML = "";

	this.contentHeight = this.getComputedHeight (this.contentElement);
	$("#content-height").html (this.contentHeight);
	
	this.beforeSpacer = document.createElement ("li");
	$(this.beforeSpacer).attr ("class", "eel-before-spacer");
	$(this.beforeSpacer).css ({
		"visibility": "hidden", 
		"height": "0px", 
		"padding": "0px"
	});
	this.contentElement.appendChild (this.beforeSpacer);

	this.afterSpacer = document.createElement ("li");
	$(this.afterSpacer).attr ("class", "eel-after-spacer");
	$(this.afterSpacer).css ({
		"visibility": "hidden", 
		"height": "0px", 
		"padding": "0px"
	});
	this.contentElement.appendChild (this.afterSpacer);
	
	this.contentItemCache = new Array ();
	this.firstVisibleIndex = 0;
	this.lastVisibleIndex = 0;
	this.previousFirstVisibleIndex = 0;
	this.lastLoadedIndex = 0;
	
	this.isLoading = false;
	this.isFullyLoaded = false;
	this.scrollingEnabled = true;
	
	// console.log ("refresh() requesting load");
	
	this.load ();
	
	window.scrollTo (0, 0);
}
*/

EelView.prototype.disableScrolling = function ()
{
	console.log ("EelView.disableScrolling()");
	
	this.scrollingEnabled = false;
}

EelView.prototype.enableScrolling = function ()
{
	console.log ("EelView.enableScrolling()");
	
	this.scrollingEnabled = true;
}

// EVENTS

EelView.prototype.onScroll = function (inScrollPosition)
{
	// on mobile, we attach scroller to window
	// so we only take scroll events if our page is visible
	if (! this.nuPage.isVisible ())
	{
		return;
	}
	
	if (! this.scrollingEnabled)
	{
		return;
	}
	
	if (!this.scrollWhileLoading && this.isLoading)
	{
		// console.log ("scroll to " + inScrollPosition + " while loading, deferring...");
		
		// we'll do the scroll after the load is complete
		this.deferredScrollPosition = inScrollPosition;
		
		return;
	}
	
	//console.log ("scroll to " + inScrollPosition);
	
	$("#scroll-position").html (inScrollPosition);
	
	
	/* Parallax */

	//var elHeight = $('.eventlist').outerHeight( true );
	//console.log( elHeight );
	
	
	// determine first and last visible indexes
	
	// note the total height does *not* start at the size of the before spacer
	// because we include hidden items in the calculation
	var	totalHeight = 0;
	var	visible = false;
	
	for (var i = 0; i < this.contentItemCache.length; i++)
	{
		var	item = this.contentItemCache [i];
		
		var	itemHeight = this.getItemHeight (item);
		totalHeight += itemHeight;
		
		if (visible)
		{
			if (totalHeight >= (inScrollPosition + this.contentHeight))
			{
				// console.log ("marking " + i + " as last visible index");
				
				this.lastVisibleIndex = i;
				break;
			}
		}
		else
		{
			if (totalHeight > inScrollPosition)
			{
				// console.log ("marking " + i + " as first visible index");
				
				visible = true;
				this.firstVisibleIndex = i;
				this.lastVisibleIndex = i;
			}
		}
	}

	// console.log ("first visible index = " + this.firstVisibleIndex);
	// console.log ("last visible index = " + this.lastVisibleIndex);
	// console.log ("last loaded index = " + this.lastLoadedIndex);
	
	// optimise() will ensure all the items are in the right shape!
	
	$("#first-visible-index").html (this.firstVisibleIndex);
	$("#last-visible-index").html (this.lastVisibleIndex);

	var	forwards = this.firstVisibleIndex > this.previousFirstVisibleIndex;
	this.previousFirstVisibleIndex = this.firstVisibleIndex;

	// remember the last loaded index is exclusive
	var	remainingItems = (this.lastLoadedIndex - this.lastVisibleIndex) - 1;

	if (forwards)
	{
		// console.log ("remaining items is " + remainingItems);
		// console.log ("load threshold is " + this.loadThreshold);
		
		if (remainingItems < this.loadThreshold)
		{
			if (!this.isFullyLoaded)
			{
				if (this.isLoading)
				{
					 if(!this.loaderVisible){
					 	 $('.eventlist').append('<li id="loading-indicator"><span><img src="https://sfbeerweek.s3-us-west-1.amazonaws.com/images/loader.gif" width="36" height="36"></span></li>');
					 	 this.loaderVisible = true;
					 }
					 console.error ("need to load but can't....");
				}
				else
				{
					// console.log ("onScroll() requesting load");
					this.load ();
				}
			}
		}
	}

	$("#remaining-items").html (remainingItems);

	if (! this.isLoading)
	{
		this.optimise ();
	}
}

// PRIVATE

EelView.prototype.decreaseHeight = function (inElement, inHeight)
{
	var	height = this.getCSSHeight (inElement);
	height -= inHeight;
	
	// console.log ("decreasing element " + $(inElement).attr ("class") + " height to " + height);
	
	if (height < 0)
	{
		console.error ("height of element reduced to below zero");
		height = 0;
	}
	
	$(inElement).css ("height", height + "px");
	
	if ($(inElement).hasClass ("eel-before-spacer"))
	{
		var	itemsHeight = 0;
		
		for (var i = 0; i < this.contentItemCache.length; i++)
		{
			var	item = this.contentItemCache [i];
			
			if ($(item).hasClass ("eel-hidden-before"))
			{
				itemsHeight += this.getItemHeight (item);
			}
		}
		
		if (itemsHeight != height)
		{
			console.error ("decrease: before spacer height is " + height + " should be " + itemsHeight);
		}
	}
}

EelView.prototype.increaseHeight = function (inElement, inHeight)
{
	var	height = this.getCSSHeight (inElement);
	height += inHeight;

	// console.log ("increasing element " + $(inElement).attr ("class") + " height to " + height);
	
	$(inElement).css ("height", height + "px");

	
	if ($(inElement).hasClass ("eel-before-spacer"))
	{
		var	itemsHeight = 0;
		
		for (var i = 0; i < this.contentItemCache.length; i++)
		{
			var	item = this.contentItemCache [i];
			
			if ($(item).hasClass ("eel-hidden-before"))
			{
				itemsHeight += this.getItemHeight (item);
			}
		}
		
		if (itemsHeight != height)
		{
			console.error ("increase: before spacer height is " + height + " should be " + itemsHeight);
		}
	}
}

EelView.prototype.getComputedHeight = function (inElement)
{
	var	height = 0;
	var	computedStyle = getComputedStyle (inElement);
	
	if (computedStyle)
	{
		var	elementHeight = computedStyle.height;
		elementHeight = parseInt (elementHeight);
		
		if (isNaN (elementHeight) || (elementHeight == 0))
		{
			// console.error ("can't get height for");
			// console.error (inElement);
		}
		else
		{
			// HACK do all parseInt()s survive "331.1px" ?
			// seems like it
			height = parseInt (elementHeight);
		}
	}
	else
	{
		console.error ("no computed style for");
		console.error (inElement);
	}
	
	return height;
}

EelView.prototype.getCSSHeight = function (inElement)
{
	var	elementHeight = inElement.style.height;
	elementHeight = elementHeight.replace (/[^0-9]/g, "");
	return parseInt (elementHeight);
}

EelView.prototype.getItemHeight = function (inItem)
{
	var	height = this.getComputedHeight (inItem);
	
	if (isNaN (height) || (height == 0))
	{
		var	eelHeight = $(inItem).attr ("eel-height");
		
		if (eelHeight && eelHeight.length)
		{
			height = parseInt (eelHeight);
		}
	}
	
	if (isNaN (height) || (height == 0))
	{
		// console.error ("could not get height for item...");
		// console.error (inItem);
	}
	
	return height;
}

EelView.prototype.optimise = function ()
{
	// console.log ("EelView.optimise()");
	
	if (! this.optimiseListSize)
	{
		console.log ("optimise disabled");
		return;
	}
	
	// this.sanityCheck ();
	
	// this is the border area at the top and bottom of the visible window
	// that is kept active
	var	padding = Math.floor (this.loadSize / 2);
	
	// first, hide anything before the window - padding
	var	offset = 0;
	var	limit = Math.max (this.firstVisibleIndex - padding, 0);
	
	// console.log ("marking " + offset + " to " + limit + " as in before-spacer");
	
	for (var i = offset; i < limit; i++)
	{
		var	item = this.contentItemCache [i];
		
		if ($(item).hasClass ("eel-hidden-before"))
		{
			// item already hidden
		}
		else
		if ($(item).hasClass ("eel-hidden-after"))
		{
			// in the after-spacer, but before the visible position
			// so shift to the before-spacer
			var	itemHeight = this.getItemHeight (item);
			$(item).removeClass ("eel-hidden-after");
			
			if (this.expandAfterSpacer)
			{
				this.decreaseHeight (this.afterSpacer, itemHeight);
			}
			
			$(item).addClass ("eel-hidden-before");
			this.increaseHeight (this.beforeSpacer, itemHeight);
		}
		else
		{
			var	itemHeight = this.getComputedHeight (item);
			$(item).attr ("eel-height", itemHeight);
			$(item).addClass ("eel-hidden-before");
			this.increaseHeight (this.beforeSpacer, itemHeight);
			this.hiddenElement.appendChild (item);
		}
	}
	
	// second, show anything in the visible window + padding
	offset = Math.max (this.firstVisibleIndex - padding, 0);
	limit = Math.min (this.lastVisibleIndex + padding, this.lastLoadedIndex);
	
	// console.log ("marking " + offset + " to " + limit + " as visible");
	
	var	referenceElement = this.beforeSpacer.nextSibling;

	for (var i = offset; i < limit; i++)
	{
		var	item = this.contentItemCache [i];
		
		if ($(item).hasClass ("eel-hidden-before"))
		{
			// console.log ("restoring item " + i + " from before-spacer to before " + $(referenceElement).attr ("class"));

			// item is hidden and its height is included in the before spacer
			$(item).removeClass ("eel-hidden-before");
			var	itemHeight = parseInt ($(item).attr ("eel-height"));
			this.decreaseHeight (this.beforeSpacer, itemHeight);
			
			this.contentElement.insertBefore (item, referenceElement);
		}
		else
		if ($(item).hasClass ("eel-hidden-after"))
		{
			// console.log ("restoring item " + i + " from after-spacer");

			// item is hidden and its height is included in the after spacer
			$(item).removeClass ("eel-hidden-after");

			if (this.expandAfterSpacer)
			{
				var	itemHeight = parseInt ($(item).attr ("eel-height"));
				this.decreaseHeight (this.afterSpacer, itemHeight);
			}

			try
			{
				this.contentElement.insertBefore (item, this.afterSpacer);
			}
			catch (inError)
			{
				console.log ("error restoring item from after-spacer");
				// console.log (this.contentElement);
				// console.log (this.afterSpacer);
				// console.log (inError);
			}
		}
	}
	
	// third, hide anything beyond visible window + padding
	offset = Math.min (this.lastVisibleIndex + padding, this.lastLoadedIndex);
	limit = this.lastLoadedIndex;
	
	// console.log ("marking " + offset + " to " + limit + " as after-spacer");

	for (var i = offset; i < limit; i++)
	{
		var	item = this.contentItemCache [i];

		if ($(item).hasClass ("eel-hidden-before"))
		{
			// in the before-spacer, but after the visible position
			// so shift to the after-spacer
			var	itemHeight = this.getItemHeight (item);
			$(item).removeClass ("eel-hidden-before");
			this.decreaseHeight (this.beforeSpacer, itemHeight);
			$(item).addClass ("eel-hidden-after");

			if (this.expandAfterSpacer)
			{
				this.increaseHeight (this.afterSpacer, itemHeight);
			}
		}
		else
		if ($(item).hasClass ("eel-hidden-after"))
		{
			// item already hidden
		}
		else
		{

			var	itemHeight = this.getComputedHeight (item);
			$(item).attr ("eel-height", itemHeight);
			$(item).addClass ("eel-hidden-after");

			if (this.expandAfterSpacer)
			{
				this.increaseHeight (this.afterSpacer, itemHeight);
			}

			this.hiddenElement.appendChild (item);
		}
	}
	
	// this.sanityCheck ();
}


EelView.prototype.sanityCheck = function ()
{
	console.log ("EelView.sanityCheck()");
	
	var	lastIndex = -1;
	
	for (var i = 0; i < this.contentElement.childNodes.length; i++)
	{
		var	child = this.contentElement.childNodes [i];
		
		var	indexString = child.getAttribute ("data-index");
		
		if (indexString)
		{
			var	index = parseInt (indexString);
			
			if (lastIndex >= 0)
			{
				if ((index - lastIndex) != 1)
				{
					console.error ("INDEX CONTINUITY ERROR at index " + index);
				}
			}
				
			lastIndex = index;
		}
	}
}


EelView.prototype.setContentElement = function ()
{
	var	contentSelector = this.nuElement.getAttribute ("content-selector");
	
	if (contentSelector && contentSelector.length)
	{
		this.contentElement = document.querySelector (contentSelector);
		
		if (this.contentElement)
		{
			// ASSUME we're in initial setup
			// but we could be inheriting a content selector, so blow it away
			neutrino.DOM.removeChildren (this.contentElement);
		}
		else
		{
			console.error ("EelView: content element not found");
		}
	}

	var	hiddenSelector = this.nuElement.getAttribute ("hidden-selector");
	
	if (hiddenSelector && hiddenSelector.length)
	{
		this.hiddenElement = document.querySelector (hiddenSelector);
		
		if (this.hiddenElement)
		{
			// ASSUME we're in initial setup
			// but we could be inheriting a content selector, so blow it away
			neutrino.DOM.removeChildren (this.hiddenElement);
		}
		else
		{
			console.error ("EelView: hidden element not found");
		}
	}
	
	var	templateSelector = this.nuElement.getAttribute ("template-selector");
	
	if (templateSelector && templateSelector.length)
	{
		this.templateElement = document.querySelector (templateSelector);
		this.templateHTML = this.templateElement.innerHTML;
	}
	
	var	self = this;
	
	// we have to make sure that we only have one scroll handler
	// if we refresh, we should overwrite the previous one
	
	EelView.setScrollHandler
	(
		this.nuKey,
		function (inEvent)
		{
			self.onScroll.call (self, $(document).scrollTop());
		}
	);
	
	/*
	
	// if ("ontouchstart" in window)
	// if (gApplication.nuBrowser.isMobile)
	if (true)
	{
		window.addEventListener
		(
			"scroll", 
			function (inEvent)
			{
				self.onScroll.call (self, $(document).scrollTop());
			}
		);
	}
	else
	{
		this.contentElement.addEventListener
		(
			"scroll", 
			function (inEvent)
			{
				console.log ("scrolling to " + inEvent.target.scrollTop);
				self.onScroll.call (self, inEvent.target.scrollTop);
			}
		);
	}
	
	*/
}

// this is STATIC
EelView.scrollHandlers = new Object ();

EelView.setScrollHandler = function (inViewKey, inScrollHandler)
{
	var	scrollHandler = EelView.scrollHandlers [inViewKey];
	
	if (scrollHandler)
	{
		window.removeEventListener ("scroll", scrollHandler);
	}
	
	EelView.scrollHandlers [inViewKey] = inScrollHandler;
	window.addEventListener ("scroll", inScrollHandler);
}
