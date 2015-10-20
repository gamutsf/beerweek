/*

Copyright (c) 2012 Subatomic Systems, Inc

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Janx Dynamic HTML Engine Copyright (c) 2012 Jason Proctor

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


*/

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// neutrino.js

// note that non-closure ports do not require that provide() and require() actually work
// however inherits() is *always* required of course

var	neutrino = neutrino || new Object ();

/**
 * @param {string} inProvided
 */
neutrino.provide = function (inProvided)
{
	// ensure that the "packages" are there
	var	packageElements = inProvided.split (".");
	
	var	package = window;
	
	// don't make the last element, it's the class name
	for (var i = 0; i < packageElements.length - 1; i++)
	{
		if (typeof (package [packageElements [i]]) == "undefined")
		{
			package [packageElements [i]] = new Object ();
		}
		
		package = package [packageElements [i]];
	}
};

/**
 * @param {string} inRequired
 */
neutrino.require = function (inRequired)
{
};

neutrino.inherits = function (inSubClass, inSuperClass)
{
	function
	tempCtor()
	{
	};

	tempCtor.prototype = inSuperClass.prototype;
	inSubClass.superClass_ = inSuperClass.prototype;
	inSubClass.prototype = new tempCtor();
	inSubClass.prototype.constructor = inSubClass;
  
  // handy notation for "blind" superclass reference
  // as the superClass_ above won't work (needs to be off prototype)
  inSubClass.prototype.superClass = inSuperClass.prototype;
};

// This is not really needed in non-closure-neutrino since there is no
// obfuscation going on.
neutrino.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  // this part intentionally left blank :)
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino");

/**
 * @constructor
 * @param {Object=} inDelegate
 */
neutrino.janx.DelegateHashMap = function (inDelegate)
{
	// instance member setup
	this.map = new Object ();
	this.delegate = inDelegate;
};
neutrino.exportSymbol('neutrino.janx.DelegateHashMap', neutrino.janx.DelegateHashMap);

neutrino.janx.DelegateHashMap.prototype.get = function (inKey)
{
	var	result = this.map [inKey];

	// don't test if(result) here, it will fail for zero integers
	if (typeof (result) == "undefined" || (typeof (result) == "object" && result == null))
	{
		if (this.delegate)
		{
			result = this.delegate.get (inKey);
		}
	}
	
	return result;
};

neutrino.janx.DelegateHashMap.prototype.put = function (inKey, inValue)
{
	this.map [inKey] = inValue;
};

neutrino.janx.DelegateHashMap.prototype.remove = function (inKey)
{
	delete this.map [inKey];
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.Taglet");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.Taglet = function ()
{
	this.requiredAttributes = new Array ();
};
neutrino.exportSymbol('neutrino.janx.Taglet', neutrino.janx.Taglet);

// inElement: DOM element
// return: true/false
neutrino.janx.Taglet.prototype.checkRequiredAttributes = function (inElement)
{
	var	checked = true;
	
	if (this.requiredAttributes)
	{
		for (var i = 0; i < this.requiredAttributes.length; i++)
		{
		  var attribute = inElement.getAttribute (this.requiredAttributes [i]);

      // careful here, a blank attribute value fails if(attribute) ...
      // Js bug #35000
		  if (typeof (attribute) == "undefined" || attribute == null)
			{
				checked = false;
				break;
			}
		}
	}
	
	return checked;
};

// METHODS

// inParent: old parent node
// inNewParent: new parent node
neutrino.janx.Taglet.prototype.copyChildren = function (inParent, inNewParent)
{
	for (var i = 0; i < inParent.childNodes.length; i++)
	{
		inNewParent.appendChild (inParent.childNodes [i].cloneNode (true));
	}
};

// inElement: DOM element
// inContext: DelegateHashMap
// inTreeWalker: JanxTreeWalker
// return: true if the element is still in the tree
// the taglet is expected to manage its own tree
neutrino.janx.Taglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
console.log ("Taglet.expand() called, should be overridden");

	return inElement;
};

// inElement: DOM element
// return: string
neutrino.janx.Taglet.prototype.getDefaultPrefix = function (inElement)
{
  // check for namespaces
  var	tagNameElements = null;
  var	tagName = inElement.tagName.toLowerCase ();
  
  if (tagName.indexOf (":") > 0)
  {
	  tagNameElements = inElement.tagName.toLowerCase ().split (":");
  }
  else
  {
	  tagNameElements = inElement.tagName.toLowerCase ().split ("-");
  }

  return tagNameElements [tagNameElements.length - 1];  
};

// inElement: DOM element
// inParam: attribute name
// return: int
neutrino.janx.Taglet.prototype.getIntValue = function (inElement, inParam)
{
	return parseInt (this.getValue (inElement, inParam), 10);
};

// inElement: DOM element
// inParam: attribute name
// inDefault: default value
// return: int
neutrino.janx.Taglet.prototype.getIntValueWithDefault = function (inElement, inParam, inDefault)
{
	var	value = this.getValue (inElement, inParam);
	
	if (value)
	{
		value = parseInt (value, 10);
		
		if (isNaN (value))
		{
			value = inDefault;
		}
	}
	else
	{
		value = inDefault;
	}
	
	return value;
};

// inElement: DOM element
// return: string
neutrino.janx.Taglet.prototype.getPrefix = function (inElement)
{
	var	prefix = this.getValue (inElement, "prefix");
	
	if (!prefix)
	{
		prefix = this.getDefaultPrefix (inElement);
	}
	
	return prefix;
};

// inElement: DOM element
// return: string
neutrino.janx.Taglet.prototype.getPrefixDot = function (inElement)
{
	var	prefix = this.getValue (inElement, "prefix");
	
	if (!prefix)
	{
		prefix = this.getDefaultPrefix (inElement);
	}

	if (prefix.length > 0)
	{
		prefix += '.';
	}
	else
	{
		// leave as blank
	}
	
	return prefix;
};

// use this instead of getAttribute() directly
// as getAttribute() returns an empty string if the attribute isn't there
// retarded!!!

// inElement: DOM element
// inParam: attribute name
// return: string
neutrino.janx.Taglet.prototype.getValue = function (inElement, inParam)
{
	var	value = null;
	
	var	attributeNode = inElement.getAttributeNode (inParam);
	
	if (attributeNode)
	{
		value = inElement.getAttribute (inParam);
		
		if (value == null)
		{
		  value = "";
		}
	}
	
	return value;
};

// inElement: DOM element
// inParam: attribute name
// inDefault: default value
// return: string
neutrino.janx.Taglet.prototype.getValueWithDefault = function (inElement, inParam, inDefault)
{
	var	result = this.getValue (inElement, inParam);
	
	if (!result)
	{
		result = inDefault;
	}
	
	return result;
};

// inParent: old parent node
// inNewParent: new parent node
neutrino.janx.Taglet.prototype.moveChildren = function (inParent, inNewParent)
{
	var	child = null;
	
	do
	{
		child = inParent.firstChild;
		
		if (child)
		{
			inParent.removeChild (child);
			inNewParent.appendChild (child);
		}
	}
	while (child);
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.AsyncTaglet");

neutrino.require ("neutrino.janx.Taglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.AsyncTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.AsyncTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.AsyncTaglet', neutrino.janx.AsyncTaglet);

// the default expand() simply setTimeout()s
neutrino.janx.AsyncTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var timeout = this.getIntValueWithDefault (inElement, "timeout", 100);
  
  this.fireAsyncStart (inElement);
  
  // for callbacks
  var self = this;
  
  setTimeout
  (
    function ()
    {
      gApplication.nuJanx.janxifyChildren (inElement, inContext);
      neutrino.DOM.insertChildrenBefore (inElement, inElement);
      self.fireAsyncEnd (inElement, null);
      inElement.parentNode.removeChild (inElement);
    },
    timeout
  );
}

neutrino.janx.AsyncTaglet.prototype.fireAsyncStart = function (inElement)
{
if (gApplication.isLogging (gApplication.kLogAsync)) console.log ("AsyncTaglet.fireAsyncStart()");

  // call the taglet, too
  this.onAsyncStart (inElement);
  
  var parents = neutrino.DOM.getParents (inElement);

  for (var i = 0; i < parents.length; i++)
  {
    var parent = parents [i];

		var view = neutrino.DOM.getData (parent, "view");
		
		if (view)
		{
			view.onAsyncStart (inElement);
			
			// if this is the master dynamic view, end here
			if (view.nuJanxElement)
			{
				break;
			}
		}
		else
		{
			var nuView = parent.getAttribute ("nu-view");
			
			if (nuView && nuView.length)
			{
				if (gApplication.isLogging (gApplication.kLogAsync)) console.error ("onAsyncStart() on an unloaded nu-view");
				if (gApplication.isLogging (gApplication.kLogAsync)) console.error (inElement);
			}
		}
	}
  
};

neutrino.janx.AsyncTaglet.prototype.fireAsyncEnd = function (inElement, inData)
{
if (gApplication.isLogging (gApplication.kLogAsync)) console.log ("AsyncTaglet.fireAsyncEnd()");

  // call the taglet, too
  this.onAsyncEnd (inElement, inData);
  
  var parents = neutrino.DOM.getParents (inElement);

  for (var i = 0; i < parents.length; i++)
  {
    var parent = parents [i];
    
		var view = neutrino.DOM.getData (parent, "view");
		
		if (view)
		{
			view.onAsyncEnd (inData);
			
			// if this is the master dynamic view, end here
			if (view.nuJanxElement)
			{
				break;
			}
		}
		else
		{
			var nuView = parent.getAttribute ("nu-view");
			
			if (nuView && nuView.length)
			{
				if (gApplication.isLogging (gApplication.kLogAsync)) console.error ("onAsyncEnd() on an unloaded nu-view");
				if (gApplication.isLogging (gApplication.kLogAsync)) console.error (inElement);
			}
		}
  }

};

// override to do fun stuff
neutrino.janx.AsyncTaglet.prototype.onAsyncStart = function (inElement)
{
};

// override to do fun stuff
neutrino.janx.AsyncTaglet.prototype.onAsyncEnd = function (inElement, inData)
{
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.ConditionTaglet");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.ConditionTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.ConditionTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.ConditionTaglet', neutrino.janx.ConditionTaglet);

// inElement: DOM element
// inContext: map<string,string>
// return: true/false
neutrino.janx.ConditionTaglet.prototype.matches = function (inElement, inContext)
{
	return false;
},

// TAGLET 

// inElement: DOM element
// inContext: map<string,string>
// inTreeWalker: tree walker
neutrino.janx.ConditionTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	if (this.matches (inElement, inContext))
	{
		inTreeWalker.walkChildren (inElement, inContext);
	  neutrino.DOM.replaceWithChildren (inElement, inElement);
	}
	else
	{
	  inElement.parentNode.removeChild (inElement);
	}
	
	return null;
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet does basic string casing
  usage: <uppercase> <lowercase> <changecase case="lower|upper">
*/

neutrino.provide ("neutrino.janx.ChangeCaseTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.ChangeCaseTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "value";
};
neutrino.inherits (neutrino.janx.ChangeCaseTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.ChangeCaseTaglet', neutrino.janx.ChangeCaseTaglet);


neutrino.janx.ChangeCaseTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var value = inElement.getAttribute ("value");
  
  var tagNameElements = inElement.tagName.toLowerCase ().split (":");
  var tagName = tagNameElements [tagNameElements.length - 1];  

  var newValue = null;
  
  var mode = null;
  
  if (tagName == "uppercase")
  {
    mode = "upper";
  }
  else
  if (tagName == "lowercase")
  {
    mode = "lower";
  }
  else
  if (tagName == "capitalcase")
  {
    mode = "capital";
  }
  else
  {
    mode = inElement.getAttribute ("mode");
  }
  
  if (mode == "upper")
  {
    newValue = value.toUpperCase ();
  }
  else
  if (mode == "lower")
  {
    newValue = value.toLowerCase ();
  }
  else
  if (mode == "capital")
  {
    newValue = value.substring (0 ,1).toUpperCase () + value.substring (1).toLowerCase ();
  }
  else
  {
    console.error ("<changecase> supplied with bad mode parameter: " + mode);
  }
  
	var newContext = new neutrino.janx.DelegateHashMap (inContext);
	newContext.put (this.getPrefixDot (inElement) + "value", newValue);
	
  inTreeWalker.walkChildren (inElement, newContext);
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet does unicode conversion, almost
*/

neutrino.provide ("neutrino.janx.ConvertTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.ConvertTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.ConvertTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.ConvertTaglet', neutrino.janx.ConvertTaglet);


neutrino.janx.ConvertTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var value = inElement.getAttribute ("value");
  
  if (value && value.length)
  {
    // ok then
  }
  else
  {
    var valueKey = inElement.getAttribute ("valuekey");
    
    if (valueKey && valueKey.length)
    {
      // can't use inContext.get() because the key may be compound
      // requiring walking, etc
      value = inTreeWalker.getContextReference (valueKey, inContext);
      
      if (typeof (value) == "string")
      {
        // fine
      }
      else
      if (typeof (value) == "number")
      {
        value = "" + value;
      }
      else
      {
        value = null;
      }
    }
  }
  
  if (value)
  {
    var newValue = this.convertUnicode2Char (value);
    
    var newContext = new neutrino.janx.DelegateHashMap (inContext);
    newContext.put (this.getPrefixDot (inElement) + "value", newValue);
    
    inTreeWalker.walkChildren (inElement, newContext);
  }
  else
  {
    console.error ("ConvertTaglet could not get value");

    inTreeWalker.walkChildren (inElement, inContext);
  }
  
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

neutrino.janx.ConvertTaglet.prototype.convertUnicode2Char = function (str)
{
  console.log ("ConvertTaglet.convertUnicode2Char() in");
  console.log (str);
  
  // for callbacks
  var self = this;

	str = str.replace
	(
	  /\\u([A-Fa-f0-9]{4})/g,
    function(matchstr, parens)
    {
      var replaced = self.hex2char(parens);
      
      console.log ("replaced " + parens + " with " + replaced);
      
      return replaced;
    }
  );

  console.log ("ConvertTaglet.convertUnicode2Char() in");
  console.log (str);
  
  return str;
}

neutrino.janx.ConvertTaglet.prototype.hex2char = function (hex)
{
  // converts a single hex number to a character
  // note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
  // hex: string, the hex codepoint to be converted
  var result = '';
  var n = parseInt(hex, 16);
  if (n <= 0xFFFF)
  {
    result += String.fromCharCode(n);
  } 
  else
  if (n <= 0x10FFFF)
  {
    n -= 0x10000
    result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
  } 
  else
  {
    result += 'hex2Char error: Code point out of range: ' + n;
  }

  return result;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  a comment that doesn't appear in the final DOM
*/

neutrino.provide ("neutrino.janx.CommentTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.CommentTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.CommentTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.CommentTaglet', neutrino.janx.CommentTaglet);


neutrino.janx.CommentTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	inElement.parentNode.removeChild (inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.CSSTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.CSSTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "valuekey";
};
neutrino.inherits (neutrino.janx.CSSTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.CSSTaglet', neutrino.janx.CSSTaglet);


neutrino.janx.CSSTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var valueKey = inElement.getAttribute ("valuekey");
	
	if (valueKey && valueKey.length)
	{
		// can't use inContext.get() because the key may be compound
		// requiring walking, etc
		value = inTreeWalker.getContextReference (valueKey, inContext);
		
		if (typeof (value) != "string")
		{
			value = null;
		}
  }
  
  if (value)
  {
		var	browserSpecificStyles = document.querySelector ("#nu-browser-specific-css");
		browserSpecificStyles.innerHTML += neutrino.CSS.resolveCSS (value);
  }
  else
  {
    // console.error ("CSSTaglet could not get value");
  }
  
  inTreeWalker.walkChildren (inElement, inContext);
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

// datetaglet.js

neutrino.provide ("neutrino.janx.DateTaglet");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.DateTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "ms";
};
neutrino.inherits (neutrino.janx.DateTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol ("neutrino.janx.DateTaglet", neutrino.janx.DateTaglet);

neutrino.janx.DateTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var ms = inElement.getAttribute ("ms");
	ms = parseInt (ms);
	
	if (isNaN (ms))
	{
		console.error ("DateTaglet: bad value for ms attribute");
		inTreeWalker.walkChildren (inElement, inContext);
	}
	else
	{
		var	format = inElement.getAttribute ("format");
		
		var	newValue = null;
		
		var	date = new Date (ms);
		
		if (format && format.length)
		{
			newValue = this.formatDate (date, format);
		}
		else
		{
			newValue = date.toString ();
		}

		// note there are two month fields
		// one for the zero-based one that comes out of the date object (and that dude should be shot)
		// one for the one-based one that makes any amount of sense
		var newContext = new neutrino.janx.DelegateHashMap (inContext);
		newContext.put (this.getPrefixDot (inElement) + "value", newValue);
		newContext.put (this.getPrefixDot (inElement) + "year", date.getFullYear ());
		newContext.put (this.getPrefixDot (inElement) + "month", date.getMonth ());
		newContext.put (this.getPrefixDot (inElement) + "month_1", date.getMonth () + 1);
		newContext.put (this.getPrefixDot (inElement) + "day", date.getDate ());
		newContext.put (this.getPrefixDot (inElement) + "hour", date.getHours ());
		newContext.put (this.getPrefixDot (inElement) + "minute", date.getMinutes ());
		newContext.put (this.getPrefixDot (inElement) + "second", date.getSeconds ());

		var	hours = date.getHours ();

		if (hours > 0 && hours < 13)
		{
			newContext.put (this.getPrefixDot (inElement) + "hour_12", hours);
		}
		else
		{
			newContext.put (this.getPrefixDot (inElement) + "hour_12", Math.abs (hours - 12));
		}
		
		newContext.put (this.getPrefixDot (inElement) + "ampm", hours < 12 ? "am" : "pm");

		inTreeWalker.walkChildren (inElement, newContext);
	}
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
};

// assumed date.toString() format is --
// Mon Mar 05 2012 14:49:15 GMT-0800
// allowed tokens are
// HH - 04
// mm - 00
// ss - 00
// dd - 19
// EE - Thu
// MM - Aug
// yyyy - 2012
// Z - GMT-800
neutrino.janx.DateTaglet.prototype.formatDate = function (inDate, inFormat)
{
	var	dateString = inDate.toString ();
	var	dateElements = dateString.split (" ");
	var	timeElements = dateElements [4].split (":");
	
	var	formatted = inFormat;
	
	formatted = formatted.replace ("EE", dateElements [0]);
	formatted = formatted.replace ("MM", dateElements [1]);
	formatted = formatted.replace ("dd", dateElements [2]);
	formatted = formatted.replace ("yyyy", dateElements [3]);
	
	formatted = formatted.replace ("HH", timeElements [0]);
	formatted = formatted.replace ("mm", timeElements [1]);
	formatted = formatted.replace ("ss", timeElements [2]);
	
	formatted = formatted.replace ("Z", dateElements [5]);
	
	return formatted;
};

/**
*
* @license
* Copyright Â© 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.DistanceTaglet");

neutrino.require ("neutrino.janx.Taglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

/*
  this taglet does distance maths
*/

// CONSTRUCTOR

neutrino.janx.DistanceTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (4);
	this.requiredAttributes [0] = "lat1";
	this.requiredAttributes [1] = "lon1";
	this.requiredAttributes [2] = "lat2";
	this.requiredAttributes [3] = "lon2";
};
neutrino.inherits (neutrino.janx.DistanceTaglet, neutrino.janx.Taglet);

neutrino.janx.DistanceTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	lat1 = parseFloat (inElement.getAttribute ("lat1")) * (Math.PI / 180);
	var	lon1 = parseFloat (inElement.getAttribute ("lon1")) * (Math.PI / 180);
	var	lat2 = parseFloat (inElement.getAttribute ("lat2")) * (Math.PI / 180);
	var	lon2 = parseFloat (inElement.getAttribute ("lon2")) * (Math.PI / 180);
	
	var newContext = new neutrino.janx.DelegateHashMap (inContext);

	var	distance = this.distance (lat1, lon1, lat2, lon2);

	for (var key in distance)
	{
		newContext.put (this.getPrefixDot (inElement) + key, distance [key]);
	}
	
  inTreeWalker.walkChildren (inElement, newContext);
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

neutrino.janx.DistanceTaglet.prototype.distance = function (inLat1, inLon1, inLat2, inLon2)
{
	var	distance = new Object ();
	
	var radiusM = 6371000;

	distance.m = Math.acos (Math.sin (inLat1) * Math.sin (inLat2) + 
		Math.cos (inLat1) * Math.cos (inLat2) *
		Math.cos (inLon2 - inLon1)) * radiusM;

	distance.km = distance.m / 1000;
	distance.mi = (distance.km * 5) / 8;
	distance.yards = distance.mi * 1760;
	distance.feet = distance.mi * 5280;
	
	return distance;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  reconstitutes an element held in js representation
*/

neutrino.provide ("neutrino.janx.ElementTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.ElementTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "key";
};
neutrino.inherits (neutrino.janx.ElementTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.ElementTaglet', neutrino.janx.ElementTaglet);

neutrino.janx.ElementTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	key = inElement.getAttribute ("key");
  var	jsElement = inTreeWalker.getContextReference (key, inContext);
  var	element = neutrino.Utils.jsToElement (jsElement);

	inElement.appendChild (element);
  inTreeWalker.walkChildren (inElement, inContext);

	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet does basic string casing
  usage: <uppercase> <lowercase> <changecase case="lower|upper">
*/

neutrino.provide ("neutrino.janx.GetTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.GetTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "key";
};
neutrino.inherits (neutrino.janx.GetTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.GetTaglet', neutrino.janx.GetTaglet);


neutrino.janx.GetTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var key = inElement.getAttribute ("key");
  var	value = inTreeWalker.getContextReference (key, inContext);
  
	var newContext = new neutrino.janx.DelegateHashMap (inContext);
	newContext.put (this.getPrefixDot (inElement) + "value", value);
	
  inTreeWalker.walkChildren (inElement, newContext);
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.HTMLTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.HTMLTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "valuekey";
};
neutrino.inherits (neutrino.janx.HTMLTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.HTMLTaglet', neutrino.janx.HTMLTaglet);


neutrino.janx.HTMLTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var valueKey = inElement.getAttribute ("valuekey");
	
	if (valueKey && valueKey.length)
	{
		// can't use inContext.get() because the key may be compound
		// requiring walking, etc
		value = inTreeWalker.getContextReference (valueKey, inContext);
		
		if (typeof (value) != "string")
		{
			value = null;
		}
  }
  
  if (value)
  {
		inElement.innerHTML = value;
  	inTreeWalker.walkChildren (inElement, inContext);
  }
  else
  {
    // console.error ("HTMLTaglet could not get value");
  }
  
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// if_taglet.js

neutrino.provide ("neutrino.janx.IfTaglet");
neutrino.require ("neutrino.janx.ConditionTaglet");

/**
 * @constructor
 */
neutrino.janx.IfTaglet = function ()
{
	neutrino.janx.ConditionTaglet.call (this);
};
neutrino.inherits (neutrino.janx.IfTaglet, neutrino.janx.ConditionTaglet);
neutrino.exportSymbol('neutrino.janx.IfTaglet', neutrino.janx.IfTaglet);


// inElement: DOM element
// inContext: map<string,string>
// return: true/false
neutrino.janx.IfTaglet.prototype.matches = function (inElement, inContext)
{
	var	operation = this.getValue (inElement, "operation");
	
	if (operation && operation.length && (operation == "and" || operation == "or"))
	{
		// ok then
	}
	else
	{
		operation = "and";
	}
	
	var	matches = false;
	
	for (var i = -1; true; i++)
	{
		var	lhsName = "lhs";
		var	rhsName = "rhs";
		
		if (i >= 0)
		{
			lhsName += "-" + i;
			rhsName += "-" + i;
		}
		
		var	lhs = this.getValue (inElement, lhsName);
		var	rhs = this.getValue (inElement, rhsName);
		
		// baffled that i can't write "if (lhs && rhs)" here
		if (lhs != null && rhs != null)
		{
			var	thisMatches = lhs == rhs;
			
			if (thisMatches)
			{
				matches = true;
				
				if (operation == "or")
				{
					break;
				}
			}
			else
			{
				if (operation == "and")
				{
					matches = false;
					break;
				}
			}
		}
		else
		{
			// the "lhs" and "lhs-0" ones are optional
			if (i > 0)
			{
				break;
			}
		}
	}
	
	return matches;
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// ifnottaglet.js

neutrino.provide ("neutrino.janx.IfNotTaglet");
neutrino.require ("neutrino.janx.ConditionTaglet");

/**
 * @constructor
 */
neutrino.janx.IfNotTaglet = function ()
{
	neutrino.janx.ConditionTaglet.call (this);
};
neutrino.inherits (neutrino.janx.IfNotTaglet, neutrino.janx.ConditionTaglet);
neutrino.exportSymbol('neutrino.janx.IfNotTaglet', neutrino.janx.IfNotTaglet);


// inElement: DOM element
// inContext: map<string,string>
// return: true/false
neutrino.janx.IfNotTaglet.prototype.matches = function (inElement, inContext)
{
	var	operation = this.getValue (inElement, "operation");
	
	if (operation && operation.length && (operation == "and" || operation == "or"))
	{
		// ok then
	}
	else
	{
		operation = "and";
	}
	
	var	matches = false;
	
	for (var i = -1; true; i++)
	{
		var	lhsName = "lhs";
		var	rhsName = "rhs";
		
		if (i >= 0)
		{
			lhsName += "-" + i;
			rhsName += "-" + i;
		}
		
		var	lhs = this.getValue (inElement, lhsName);
		var	rhs = this.getValue (inElement, rhsName);
		
		// baffled that i can't write "if (lhs && rhs)" here
		if (lhs != null && rhs != null)
		{
			var	thisMatches = lhs != rhs;
			
			if (thisMatches)
			{
				matches = true;
				
				if (operation == "or")
				{
					break;
				}
			}
			else
			{
				if (operation == "and")
				{
					matches = false;
					break;
				}
			}
		}
		else
		{
			// the "lhs" and "lhs-0" ones are optional
			if (i > 0)
			{
				break;
			}
		}
	}
	
	return matches;
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
this taglet provides a solution for the situation where the browser
sees tags with templated attribute values in markup, which results in errors.
examples would be <img>, <movie>, etc

simply point nu:img, nu:movie, etc at this taglet and it will transform to img, movie, etc
*/

neutrino.provide ("neutrino.janx.IsolatorTaglet");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.IsolatorTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.IsolatorTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.IsolatorTaglet', neutrino.janx.IsolatorTaglet);

neutrino.janx.IsolatorTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	newTag = null;
	
  var	tagNameElements = null;
  var	tagName = inElement.tagName.toLowerCase ();
  
  if (tagName.indexOf (":") > 0)
  {
	  tagNameElements = tagName.toLowerCase ().split (":");
  }
  else
  {
	  tagNameElements = tagName.toLowerCase ().split ("-");
  }
	
	if (tagNameElements.length > 1)
	{
		var	newTagName = tagNameElements [1].toLowerCase ();
		
		if (newTagName.length > 0)
		{
			newTag = document.createElement (newTagName);
			
			if (inElement.hasAttributes)
			{
				var	attributes = inElement.attributes;
		
				for (var i = 0; i < attributes.length; i++)
				{
					newTag.setAttribute (attributes [i].name, attributes [i].value);
				}
			}

			this.moveChildren (inElement, newTag);
			inElement.parentNode.replaceChild (newTag, inElement);

			inTreeWalker.walkChildren (newTag, inContext);
		}
		else
		{
console.error ("IsolatorTaglet called on tag with zero length tag name");
		}
	}
	else
	{
console.error ("IsolatorTaglet called on tag without namespace qualification");
	}

	return newTag ? newTag : inElement;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.JSTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.JSTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "valuekey";
};
neutrino.inherits (neutrino.janx.JSTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.JSTaglet', neutrino.janx.JSTaglet);


neutrino.janx.JSTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var valueKey = inElement.getAttribute ("valuekey");
	
	if (valueKey && valueKey.length)
	{
		// can't use inContext.get() because the key may be compound
		// requiring walking, etc
		value = inTreeWalker.getContextReference (valueKey, inContext);
		
		if (typeof (value) != "string")
		{
			value = null;
		}
  }
  
  if (value)
  {
		neutrino.DOM.globalEval (value);
  }
  else
  {
    // console.error ("JSTaglet could not get value");
  }
  
	inTreeWalker.walkChildren (inElement, inContext);
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.LinkTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.LinkTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "href";
};
neutrino.inherits (neutrino.janx.LinkTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.LinkTaglet', neutrino.janx.LinkTaglet);


neutrino.janx.LinkTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	linkElement = document.createElement ("link");
	linkElement.setAttribute ("href", inElement.getAttribute ("href"));
	
	var	type = inElement.getAttribute ("type");
	
	if (type && type.length)
	{
		linkElement.setAttribute ("type", type);
	}
	
	var	className = inElement.getAttribute ("class");
	
	if (className && className.length)
	{
		linkElement.setAttribute ("class", className);
	}
	
	// check for our browser neutral stylesheet
	var	browserNeutralStyles = document.querySelector (".nu-browser-neutral-css");
	
	if (browserNeutralStyles)
	{
		browserNeutralStyles.parentNode.insertBefore (linkElement, browserNeutralStyles);
	}
	else
	{
		var	head = document.querySelector ("head");
		
		head.appendChild (linkElement);
	}
	
  inTreeWalker.walkChildren (inElement, inContext);
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.ListTaglet");

neutrino.require ("neutrino.janx.Taglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.ListTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};

neutrino.inherits (neutrino.janx.ListTaglet, neutrino.janx.Taglet);

// ITAGLET IMPLEMENTATION

// inElement: DOM element
// return: true/false
neutrino.janx.ListTaglet.prototype.checkRequiredAttributes = function (inElement)
{
	return this.getValue (inElement, "key");
};

// inElement: DOM element
// inContext: map<string,string>
// inTreeWalker: tree walker
// return: node to replace inElement
neutrino.janx.ListTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	prefix = this.getPrefix (inElement);
	
	var	fragment = document.createElement ("div");
	fragment.setAttribute ("class", "nu-list-place-holder");
	inElement.parentNode.replaceChild (fragment, inElement);

	var	elements = this.getElements (inElement, inContext, inTreeWalker);

	if (elements && (typeof (elements.length) == "number"))
	{
		var	offset = 0;
	  var limit = elements.length;
	  
	  var offsetAttribute = inElement.getAttribute ("offset");
	  
	  if (offsetAttribute && offsetAttribute.length)
	  {
	    offset = parseInt (offsetAttribute);
	    offset = Math.max (offset, 0);
	  }
	  
	  var limitAttribute = inElement.getAttribute ("limit");
	  
	  if (limitAttribute && limitAttribute.length)
	  {
	    limit = parseInt (limitAttribute);
	    limit = Math.min (limit, elements.length);
	  }
	  
	  var	searchKey = inElement.getAttribute ("searchkey");
	  
	  if (searchKey && (searchKey.length == 0))
	  {
	  	searchKey = null;
	  }
	  
	  var	searchValue = inElement.getAttribute ("searchvalue");
	  
	  if (searchValue && (searchValue.length == 0))
	  {
	  	searchValue = null;
	  }
	  
		for (var i = offset; (i < offset + limit) && (i < elements.length); i++)
		{
			var	include = true;
			
			if (searchKey != null && searchValue != null)
			{
				var	element = elements [i];
				
				include = typeof (element) == "object" && element [searchKey] == searchValue;
			}
			
			if (include)
			{
				var	elementFragment = document.createElement ("div");
				elementFragment.setAttribute ("class", "nu-list-element-place-holder");
				fragment.appendChild (elementFragment);
				
				var	elementContext = new neutrino.janx.DelegateHashMap (inContext);
				elementContext.put (prefix, elements [i]);
	
				// stick some meta in there, ooo
				var	index = i - offset;
	
				// global stuff, pertaining into the entire collection
				elementContext.put (prefix + ".meta.globalindex", i);
				elementContext.put (prefix + ".meta.globalcount", elements.length);
				
				// local stuff, pertaining to the elements we are including
				elementContext.put (prefix + ".meta.index", index);
				elementContext.put (prefix + ".meta.count", limit);
				elementContext.put (prefix + ".meta.isfirst", index == 0);
				elementContext.put (prefix + ".meta.islast", index == (limit - 1));
				
				this.copyChildren (inElement, elementFragment);
				
				inTreeWalker.walkChildren (elementFragment, elementContext);
				
				neutrino.DOM.replaceWithChildren (elementFragment, elementFragment);
			}
		}
		
		neutrino.DOM.replaceWithChildren (fragment, fragment);
	}
	else
	{
		console.error ("ListTaglet could not find elements for key " + this.getValue (inElement, "key"));
	  fragment.parentNode.removeChild (fragment);
	}
	
	return null;
};

// DEFAULT IMPLEMENTATION

// inElement: DOM element
// inContext: map<string,string>
// inTreeWalker: tree walker
// return: array
neutrino.janx.ListTaglet.prototype.getElements = function (inElement, inContext, inTreeWalker)
{
	var	elements = null;
	
	// check for a Js array
	var	elementsRefAttribute = this.getValue (inElement, "key");

	if (elementsRefAttribute)
	{
		var	elementsArray = inTreeWalker.getContextReference (elementsRefAttribute, inContext);

		if (typeof (elementsArray) == 'object')
		{
			if (elementsArray && (typeof (elementsArray.length) == "number"))
			{
				elements = elementsArray;
			}
		}
	}

	return elements;
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet logs stuff
  values, values from keys, or the current context
  
  <nu:log
    value="value" OR valuekey="valuekey" OR nothing
    >
  </nu:log>
  
  this element pulls itself after logging
*/

neutrino.provide ("neutrino.janx.LogTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.LogTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.LogTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.LogTaglet', neutrino.janx.LogTaglet);


neutrino.janx.LogTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var value = inElement.getAttribute ("value");
  var valueKey = inElement.getAttribute ("valuekey");
  
  if (value && value.length)
  {
    // value is the direct value
  }
  else
  if (valueKey && valueKey.length)
  {
    // can't use inContext.get() because the key may be compound
    // requiring walking, etc
    value = inTreeWalker.getContextReference (valueKey, inContext);
  }
  else
  {
    value = inContext;
  }
  
	console.log ("LogTaglet logs");
	console.log (value + " (type = " + typeof (value) + ")");

  inElement.parentNode.removeChild (inElement);

	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.MapTaglet");

neutrino.require ("neutrino.janx.Taglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.MapTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};

neutrino.inherits (neutrino.janx.MapTaglet, neutrino.janx.Taglet);

// ITAGLET IMPLEMENTATION

// inElement: DOM element
// return: true/false
neutrino.janx.MapTaglet.prototype.checkRequiredAttributes = function (inElement)
{
	return this.getValue (inElement, "key");
};

// inElement: DOM element
// inContext: map<string,string>
// inTreeWalker: tree walker
// return: node to replace inElement
neutrino.janx.MapTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	prefix = this.getPrefix (inElement);
	
	var	fragment = document.createElement ("div");
	fragment.setAttribute ("class", "nu-map-place-holder");
	inElement.parentNode.replaceChild (fragment, inElement);

	var	map = this.getMap (inElement, inContext, inTreeWalker);

	if (map)
	{
	  // check for a limit attribute
	  var limitAttribute = inElement.getAttribute ("limit");
	  
	  if (limitAttribute && limitAttribute.length)
	  {
	    elementsLength = parseInt (limitAttribute);
	    elementsLength = Math.min (elementsLength, elements.length);
	  }
	  
	  // accumulate the keys
	  var	keys = new Array ();
	  
	  for (var key in map)
	  {
	  	if (typeof (key) == "string")
	  	{
	  		var	value = map [key];
	  		
	  		if (typeof (value) != "function")
	  		{
		  		keys.push (key);
		  	}
	  	}
	  }
	  
		for (var i = 0; i < keys.length; i++)
		{
			var	elementFragment = document.createElement ("div");
			elementFragment.setAttribute ("class", "nu-map-element-place-holder");
			fragment.appendChild (elementFragment);
			
			var	elementContext = new neutrino.janx.DelegateHashMap (inContext);
			elementContext.put (prefix + ".key", keys [i]);
			elementContext.put (prefix + ".value", map [keys [i]]);

			// stick some meta in there, ooo
			elementContext.put (prefix + ".meta.index", i);
			elementContext.put (prefix + ".meta.count", keys.length);
			
			elementContext.put (prefix + ".meta.isfirst", i == 0);
			elementContext.put (prefix + ".meta.islast", i == (keys.length - 1));
			
			this.copyChildren (inElement, elementFragment);
			
			inTreeWalker.walkChildren (elementFragment, elementContext);
			
			neutrino.DOM.replaceWithChildren (elementFragment, elementFragment);
		}
		
		neutrino.DOM.replaceWithChildren (fragment, fragment);
	}
	else
	{
		console.error ("MapTaglet could not find elements for key " + this.getValue (inElement, "key"));
	  fragment.parentNode.removeChild (fragment);
	}
	
	return null;
};

// DEFAULT IMPLEMENTATION

// inElement: DOM element
// inContext: map<string,string>
// inTreeWalker: tree walker
// return: map
neutrino.janx.MapTaglet.prototype.getMap = function (inElement, inContext, inTreeWalker)
{
	var	map = null;
	
	// check for a Js object
	var	keyAttribute = this.getValue (inElement, "key");

	if (keyAttribute)
	{
		map = inTreeWalker.getContextReference (keyAttribute, inContext);

		if (typeof (map) != 'object')
		{
			map = null;
		}
	}

	return map;
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet does basic string substitution
*/

neutrino.provide ("neutrino.janx.NumberFormatTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.NumberFormatTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (3);
	this.requiredAttributes [0] = "value";
	this.requiredAttributes [1] = "type";
	this.requiredAttributes [2] = "digits";
};
neutrino.inherits (neutrino.janx.NumberFormatTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.NumberFormatTaglet', neutrino.janx.NumberFormatTaglet);


neutrino.janx.NumberFormatTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var value = parseFloat (inElement.getAttribute ("value"));
	var type = inElement.getAttribute ("type");
	var digits = parseInt (inElement.getAttribute ("digits"));

  var newValue = null;
  
  if (type == "fixed")
  {
    newValue = value.toFixed (digits);
  }
  else
  if (type == "precision")
  {
    newValue = value.toPrecision (digits);
  }
  else
  if (type == "frontpad")
  {
  	newValue = value;

  	while (newValue.toString ().length < digits)
  	{
  		newValue = "0" + newValue;
  	}
  }
  else
  {
    console.error ("bad type passed to <numberformat>");
  }
  
	var newContext = new neutrino.janx.DelegateHashMap (inContext);
	newContext.put (this.getPrefixDot (inElement) + "value", newValue);
	
  inTreeWalker.walkChildren (inElement, newContext);
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright Â© 2013 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.NumbersTaglet");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.NumbersTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
	
	this.requiredAttributes.push ("offset");
	this.requiredAttributes.push ("limit");
};
neutrino.inherits (neutrino.janx.NumbersTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.NumbersTaglet', neutrino.janx.NumbersTaglet);

neutrino.janx.NumbersTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	offset = this.getIntValueWithDefault (inElement, "offset", 0);
	var	limit = this.getIntValueWithDefault (inElement, "limit", 10);
	var	step = this.getIntValueWithDefault (inElement, "step", 1);
	
	// check here that the params make sense
	// ie that if limit > offset, then step > 0, etc
	
	var	numbers = new Array ();
	
	for (var i = offset; i < limit; i += step)
	{
		numbers.push (i);
	}
	
	var	newContext = new neutrino.janx.DelegateHashMap (inContext);
	newContext.put (this.getPrefix (inElement), numbers);

	inTreeWalker.walkChildren (inElement, newContext);
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}
/**
*
* @license
* Copyright Â© 2013 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.QueryTaglet");
neutrino.require ("neutrino.janx.AsyncTaglet");

/**
 * @constructor
 */
neutrino.janx.QueryTaglet = function ()
{
	neutrino.janx.AsyncTaglet.call (this);
	
	this.requiredAttributes.push ("database");
	this.requiredAttributes.push ("query");
};
neutrino.inherits (neutrino.janx.QueryTaglet, neutrino.janx.AsyncTaglet);
neutrino.exportSymbol('neutrino.janx.QueryTaglet', neutrino.janx.QueryTaglet);

neutrino.janx.QueryTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	databaseName = inElement.getAttribute ("database");
	var	query = inElement.getAttribute ("query");

	var	version = inElement.getAttribute ("version");
	
	if (version == null || version.length == 0)
	{
		version = "1.0";
	}

	var	size = inElement.getAttribute ("size");
	
	if (size == null || size.length == 0)
	{
		size = 5 * 1024 * 1024;
	}
	else
	{
		size = parseInt (size);
	}

	var	parameters = inElement.getAttribute ("parameters");
	
	if (parameters != null && parameters.length > 0)
	{
		parameters = parameters.split (",");
	}
	else
	{
		parameters = new Array ();
	}
	
	var	database = openDatabase (databaseName, version, "", size);
	
	if (database)
	{
		this.fireAsyncStart (inElement);
		
		// for callbacks
		var	self = this;
		
		database.transaction
		(
			function (inTransaction)
			{
				inTransaction.executeSql
				(
					query,
					parameters,
					function (inTransaction, inResultSet)
					{
						var	results = [];
						
						if (inResultSet.rows && inResultSet.rows.length)
						{
							for (var i = 0; i < inResultSet.rows.length; i++)
							{
								var	item = inResultSet.rows.item (i);
								var	result = new Object ();
								
								for (var key in item)
								{
									result [key] = item [key];
								}
								
								results.push (result);
							}
						}
						
						var	newContext = new neutrino.janx.DelegateHashMap (inContext);
						newContext.put (self.getPrefix (inElement), results);
						
						try
						{
							gApplication.nuJanx.janxifyChildren (inElement, newContext);
						}
						catch (inError)
						{
							console.error (inError);
						}
						
						neutrino.DOM.insertChildrenBefore (inElement, inElement);
						self.fireAsyncEnd (inElement, results);
						inElement.parentNode.removeChild (inElement);
					},
					function (inTransaction, inError)
					{
						console.error (inError);
						
						// must call fireAsyncEnd()
						// so catch any subwalk errors
						try
						{
							gApplication.nuJanx.janxifyChildren (inElement, inContext);
						}
						catch (inError)
						{
							console.error (inError);
						}
						
						neutrino.DOM.insertChildrenBefore (inElement, inElement);
						self.fireAsyncEnd (inElement, null);
						inElement.parentNode.removeChild (inElement);
					}
				);
			}
		);
	}
	else
	{
		console.error ("can't open database: " + databaseName);
		inElement.parentNode.removeChild (inElement);
	}
	
	return null;
}
/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet does basic string substitution
*/

neutrino.provide ("neutrino.janx.ReplaceTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.ReplaceTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (3);
	this.requiredAttributes [0] = "value";
	this.requiredAttributes [1] = "replace";
	this.requiredAttributes [2] = "with";
};
neutrino.inherits (neutrino.janx.ReplaceTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.ReplaceTaglet', neutrino.janx.ReplaceTaglet);


neutrino.janx.ReplaceTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var value = inElement.getAttribute ("value");
	var replaceString = inElement.getAttribute ("replace");
	var withString = inElement.getAttribute ("with");
	
  var newString = value.replace (replaceString, withString);
  
	var newContext = new neutrino.janx.DelegateHashMap (inContext);
	newContext.put (this.getPrefixDot (inElement) + "value", newString);
	
  inTreeWalker.walkChildren (inElement, newContext);
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

/*
  this taglet does copying of values from one key to another
  AND MORE IMPORTANTLY AND USEFULLY
  promotion of context values in scope
  
  <nu:set
    key="somekey"
    value="value" OR valuekey="valuekey"
    context="application,window,page"
    >
  </nu:set>

  value OR valuekey
  context is optional
*/

neutrino.provide ("neutrino.janx.SetTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.SetTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (1);
	this.requiredAttributes [0] = "key";
};
neutrino.inherits (neutrino.janx.SetTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.SetTaglet', neutrino.janx.SetTaglet);


neutrino.janx.SetTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var key = inElement.getAttribute ("key");
  var value = inElement.getAttribute ("value");
  var valueKey = inElement.getAttribute ("valuekey");
  var scope = inElement.getAttribute ("context");
  
  if (value && value.length)
  {
    // value is the direct value
  }
  else
  if (valueKey && valueKey.length)
  {
    // can't use inContext.get() because the key may be compound
    // requiring walking, etc
    value = inTreeWalker.getContextReference (valueKey, inContext);
  }
  else
  {
    console.error ("SetTaglet called with neither value nor valuekey");
    console.error (inElement);
  }
  
  // the context we use for walking the subtree
  var walkContext = inContext;
  
  // the context we are altering
  var putContext = null;
  
  if (scope && scope.length)
  {
    if (scope == "application")
    {
      putContext = gApplication.nuRootJanxContext;
    }
    else
    if (scope == "window")
    {
      var body = document.querySelector ("body");
      var window = neutrino.DOM.getData (body, "page");
      
      putContext = window.nuJanxContext;
    }
    else
    if (scope == "page")
    {
      putContext = gApplication.nuPage.nuJanxContext;
    }
    else
    {
      console.error ("SetTaglet called with bad context: " + scope);
    }
  }
  else
  {
    // assume immediate scope, so make a new context
    putContext = new neutrino.janx.DelegateHashMap (inContext);
    
    // and walk with this context, too
    walkContext = putContext;
  }
  
  if (putContext)
  {
    putContext.put (key, value);
  }

  inTreeWalker.walkChildren (inElement, walkContext);

	// we *never* stay in the tree
  neutrino.DOM.replaceWithChildren (inElement, inElement);

	return null;
}

/**
*
* @license
* Copyright Â© 2013 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.SyncTaglet");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.SyncTaglet = function ()
{
	neutrino.janx.Taglet.call (this);
};
neutrino.inherits (neutrino.janx.SyncTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol('neutrino.janx.SyncTaglet', neutrino.janx.SyncTaglet);

neutrino.janx.SyncTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	syncViewElement = document;
	var	syncViewKey = inElement.getAttribute ("view");
	
	if (syncViewKey && syncViewKey.length)
	{
		var	syncView = gApplication.getView (syncViewKey);
		
		if (syncView)
		{
			syncViewElement = syncView.nuElement;
		}
	}
	
	var	syncElement = syncViewElement;
	var	syncSelector = inElement.getAttribute ("selector");
	
	if (syncSelector && syncSelector.length)
	{
		syncElement = syncViewElement.querySelector (syncSelector);
	}
	
	if (syncElement)
	{
		// run the subtree to generate our final output
		inTreeWalker.walkChildren (inElement, inContext);
	
		var	condemned = new Array ();
		
		for (var i = 0; i < syncElement.childNodes.length; i++)
		{
			var	syncChild = syncElement.childNodes [i];

			if (syncChild.nodeType == syncChild.ELEMENT_NODE)
			{
				// console.log ("processing existing child with ID " + syncChild.getAttribute ("id"));
			
				var	syncChildID = syncChild.getAttribute ("id");
				
				if (syncChildID && syncChildID.length)
				{
					if (condemned == null)
					{
						condemned = new Array ();
					}
					
					var	newChild = inElement.querySelector ("#" + syncChildID);
					
					// if the child is there in the new list, update its attributes
					// if not, delete it
					
					if (newChild)
					{
						// console.log ("updating child with ID " + syncChildID);

						for (var j = 0; j < newChild.attributes.length; j++)
						{
							var	name = newChild.attributes.item (j).nodeName;
							var	newValue = newChild.attributes.item (j).nodeValue;
							
							var	syncValue = syncChild.getAttribute (name);
							
							if (newValue != syncValue)
							{
								syncChild.setAttribute (name, newValue);
							}
						}
						
						condemned.push (newChild);
					}
					else
					{
						// console.log ("condemning child with ID " + syncChildID);
						condemned.push (syncChild);
					}
				}
			}
		}
		
		if (condemned)
		{
			for (var i = 0; i < condemned.length; i++)
			{
				condemned [i].parentNode.removeChild (condemned [i]);
			}
		}
		
		// we've already updated existing ones
		// and removed old ones
		// so just add the new ones
		for (var i = 0; i < inElement.childNodes.length; i++)
		{
			var	newChild = inElement.childNodes [i];
			
			if (newChild.nodeType == newChild.ELEMENT_NODE)
			{
				// console.log ("adding child with ID " + newChild.getAttribute ("id"));
				
				syncElement.appendChild (newChild);
			}
		}
	}
	else
	{
		console.error ("synctaglet has no sync element");
		console.error (inElement);
	}
	
	inElement.parentNode.removeChild (inElement);
	
	return null;
}

/**
*
* @license
* Copyright © 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

// TimeAgoTaglet.js

neutrino.provide ("neutrino.janx.TimeAgoTaglet");
neutrino.require ("neutrino.janx.Taglet");

/**
 * @constructor
 */
neutrino.janx.TimeAgoTaglet = function ()
{
	neutrino.janx.Taglet.call (this);

	this.requiredAttributes = new Array (0);
};
neutrino.inherits (neutrino.janx.TimeAgoTaglet, neutrino.janx.Taglet);
neutrino.exportSymbol ("neutrino.janx.TimeAgoTaglet", neutrino.janx.TimeAgoTaglet);

neutrino.janx.TimeAgoTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
  var ms = inElement.getAttribute ("ms");
  
  if (ms && ms.length)
  {
  	ms = parseInt (ms);
  	
  	if (isNaN (ms))
  	{
  		ms = 0;
  	}
  }
  else
	{
		var	seconds = inElement.getAttribute ("s");
		
		if (seconds && seconds.length)
		{
			seconds = parseInt (seconds);
			
			if (isNaN (seconds))
			{
				seconds = 0;
			}
		}
		else
		{
			seconds = 0;
		}
		
		ms = seconds * 1000;
	}
	
	if (ms == 0)
	{
		console.error ("TimeAgoTaglet: error parsing ms/s attributes, defaulting to zero ms");
	}
	
	var newContext = new neutrino.janx.DelegateHashMap (inContext);

	var	then = new Date (ms);
	var	now = new Date ();

	var	milliseconds = now.getTime () - then.getTime ();
	var	seconds = milliseconds / 1000;
	
	var	firstNonZeroName = null;
	var	firstNonZeroValue = 0;
	
	for (var i = 0; i < this.kTimeUnits.length; i++)
	{
		var	unit = this.kTimeUnits [i];
		
		var	value = Math.floor (seconds / unit.divisor);
		
		if (value > 0 && firstNonZeroName == null)
		{
			console.log ("first nonzero value: " + value + " " + unit.name);
			
			firstNonZeroName = unit.name;
			firstNonZeroValue = value;
		}
		
		seconds -= (value * unit.divisor);
		
		newContext.put (this.getPrefixDot (inElement) + unit.name, value);
	}
	
	if (firstNonZeroName == null)
	{
		newContext.put (this.getPrefixDot (inElement) + "units", "milliseconds");
		newContext.put (this.getPrefixDot (inElement) + "value", milliseconds);
	}
	else
	{
		newContext.put (this.getPrefixDot (inElement) + "units", firstNonZeroName);
		newContext.put (this.getPrefixDot (inElement) + "value", firstNonZeroValue);
	}
	
  inTreeWalker.walkChildren (inElement, newContext);
	
	neutrino.DOM.replaceWithChildren (inElement, inElement);
	
	return null;
};

neutrino.janx.TimeAgoTaglet.prototype.kTimeUnits = 
[	
	{
		name: "years",
		divisor: 31536000
	},
	{
		name: "months",
		divisor: 2529000
	},
	{
		name: "days",
		divisor: 86400
	},
	{
		name: "hours",
		divisor: 3600
	},
	{
		name: "minutes",
		divisor: 60
	},
	{
		name: "seconds",
		divisor: 1
	},
]

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.AjaxTaglet");

neutrino.require ("neutrino.janx.AsyncTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.AjaxTaglet = function ()
{
	neutrino.janx.AsyncTaglet.call (this);
};
neutrino.inherits (neutrino.janx.AjaxTaglet, neutrino.janx.AsyncTaglet);
neutrino.exportSymbol('neutrino.janx.AjaxTaglet', neutrino.janx.AjaxTaglet);

// INTERFACE

// HACK should the default be json?
neutrino.janx.AjaxTaglet.prototype.getDataType = function (inElement)
{
	console.error ("AjaxTaglet.getDataType() called! #abstract");
	return "ajax";
};

neutrino.janx.AjaxTaglet.prototype.onContentReceived = function (inElement, inContext, inData)
{
	console.error ("AjaxTaglet.onContentReceived() called! #abstract");
	return inContext;
};

// ITAGLET IMPLEMENTATION

// inElement: DOM element
// return: true/false
neutrino.janx.AjaxTaglet.prototype.checkRequiredAttributes = function (inElement)
{
	return this.getValue (inElement, "url");
};

// inElement: DOM element
// inContext: map<string,string>
// inTreeWalker: tree walker
// return: true if the tag remains in the tree (in this case, mostly false)
neutrino.janx.AjaxTaglet.prototype.expand = function (inElement, inContext, inTreeWalker)
{
	var	cacheKey = inElement.getAttribute ("cachekey");
	
	if (cacheKey && cacheKey.length)
	{
		var	cacheEntry = gApplication.nuCache.get (cacheKey);
	
		if (cacheEntry)
		{
			if (gApplication.isLogging (gApplication.kLogCache))
				console.log ("AjaxTaglet: cache hit on " + cacheKey);
	
			var newContext = this.onContentReceived (inElement, inContext, cacheEntry);
	
			inTreeWalker.walkChildren (inElement, newContext);
			neutrino.DOM.replaceWithChildren (inElement, inElement);
		}
		else
		{
			if (gApplication.isLogging (gApplication.kLogCache)) console.log
				("AjaxTaglet: cache miss on " + cacheKey);
		}
	}
	
	if (cacheEntry == null)
	{
		// we stash the data in the cache in onAsyncEnd()
		this.doExpansion (inElement, inContext, inTreeWalker);
	}
};


// inElement: DOM element
// inContext: DelegateHashMap
// inTreeWalker: JanxTreeWalker
// return: true if the tag remains in the tree (in this case, mostly false)
neutrino.janx.AjaxTaglet.prototype.doExpansion = function (inElement, inContext, inTreeWalker)
{
// console.log ("AjaxTaglet.expand()");
// console.log (inElement);

  var tagNameElements = inElement.tagName.toLowerCase ().split (":");
  var tagName = tagNameElements [tagNameElements.length - 1];  

	var	url = this.getValue (inElement, "url");

  var	dataType = this.getDataType (inElement);
  var	method = this.getValue (inElement, "method");

  if (method == null || method.length == 0)
  {
  	method = "GET";
  }
  
	var	data = "";
	
	var	queryIndex = url.indexOf ("?");
	
	if (queryIndex >= 0 && (queryIndex < (url.length - 2)))
	{
	  var fullURL = url;
		url = fullURL.substring (0, queryIndex);
		data = fullURL.substring (queryIndex + 1);
	}

	var	offlineURL = inElement.getAttribute ("offlineurl");
	var	offlineData = "";
	
	if (offlineURL && offlineURL.length)
	{
		queryIndex = offlineURL.indexOf ("?");
		
		if (queryIndex >= 0 && (queryIndex < (offlineURL.length - 2)))
		{
			fullURL = offlineURL;
			offlineURL = fullURL.substring (0, queryIndex);
			offlineData = fullURL.substring (queryIndex + 1);
		}
	}
	
  // for callbacks
  var self = this;
  
	var request = 
	{
		url: url,
		data: data,
		offlineURL: offlineURL,
		offlineData: offlineData,
		dataType: dataType,
		async: true,
		type: method,
		success: function (inData, inTextStatus, inXHR)
		{
			var	context = self.onContentReceived (inElement, inContext, inData);
			
			// must call fireAsyncEnd()
			// so catch any subwalk errors
			try
			{
				gApplication.nuJanx.janxifyChildren (inElement, context);
			}
			catch (inError)
			{
				console.error (inError);
			}

			neutrino.DOM.insertChildrenBefore (inElement, inElement);
			
      self.fireAsyncEnd (inElement, inData);
      inElement.parentNode.removeChild (inElement);
		},
		error: function (inXHR, inTextStatus, inError)
		{
			console.error ("load of " + url + " failed");
			console.error (inError);
			
			// must call fireAsyncEnd()
			// so catch any subwalk errors
			try
			{
      	gApplication.nuJanx.janxifyChildren (inElement, inContext);
			}
			catch (inError)
			{
				console.error (inError);
			}

      neutrino.DOM.insertChildrenBefore (inElement, inElement);
      self.fireAsyncEnd (inElement, null);
      inElement.parentNode.removeChild (inElement);
		}
	};
	
  this.fireAsyncStart (inElement);
  
	// allow the application to do app-wide stuff to each request if necessary
	
	if (typeof (gApplication.onBeforeRequest) == "function")
	{
		gApplication.onBeforeRequest (request);
	}

  // this is now async
  // we populate when the call completes
  // wheee
	neutrino.Utils.getURLContents (request);

  return null;
};

// note that this depends on the new-style async taglets which don't use temporary fragments
// the element passed in here *must* be the element passed to expand()
neutrino.janx.AjaxTaglet.prototype.onAsyncEnd = function (inElement, inData)
{
  neutrino.janx.AsyncTaglet.prototype.onAsyncEnd.call (inElement, inData);
  
  var cacheKey = inElement.getAttribute ("cachekey");
  
  if (cacheKey && cacheKey.length)
  {
		var cacheLifeTime = inElement.getAttribute ("cachelifetime");
		
		if (cacheLifeTime && cacheLifeTime.length)
		{
			cacheLifeTime = parseInt (cacheLifeTime);
		}
		else
		{
			// if you're using cache with a taglet
			// and don't specify a lifetime
			// your record sits there for a while! :-)
			if (gApplication.isLogging (gApplication.kLogCache))
				console.log ("AjaxTaglet: using default lifetime on " + cacheKey);
	
			cacheLifeTime = 15 * 60 * 1000;
		}
		
		gApplication.nuCache.put (cacheKey, inData, cacheLifeTime);
	}
};
/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.JSONTaglet");

neutrino.require ("neutrino.janx.AsyncTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.JSONTaglet = function ()
{
	neutrino.janx.AjaxTaglet.call (this);
};
neutrino.inherits (neutrino.janx.JSONTaglet, neutrino.janx.AjaxTaglet);
neutrino.exportSymbol('neutrino.janx.JSONTaglet', neutrino.janx.JSONTaglet);

// AJAXTAGLET OVERRIDES

neutrino.janx.JSONTaglet.prototype.getDataType = function (inElement)
{
  var jsonp = this.getValue (inElement, "jsonp");
  jsonp = jsonp && jsonp.toLowerCase () == "true";
  
  return jsonp ? "jsonp" : "json";
};

neutrino.janx.JSONTaglet.prototype.onContentReceived = function (inElement, inContext, inData)
{
	var	context = new neutrino.janx.DelegateHashMap (inContext);
	context.put (this.getPrefix (inElement), inData);
	
	return context;
};
/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.XMLTaglet");

neutrino.require ("neutrino.janx.AsyncTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.XMLTaglet = function ()
{
	neutrino.janx.AjaxTaglet.call (this);
};
neutrino.inherits (neutrino.janx.XMLTaglet, neutrino.janx.AjaxTaglet);
neutrino.exportSymbol("neutrino.janx.XMLTaglet", neutrino.janx.XMLTaglet);

// AJAXTAGLET OVERRIDES

neutrino.janx.XMLTaglet.prototype.getDataType = function (inElement)
{
	return "xml";
};

neutrino.janx.XMLTaglet.prototype.onContentReceived = function (inElement, inContext, inData)
{
	var	context = new neutrino.janx.DelegateHashMap (inContext);
	context.put (this.getPrefix (inElement), neutrino.Utils.elementToJs (inData));
	
	return context;
};
/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.TagletManager");

// CONSTRUCTOR

// map tagname->instance, sod the whole eval() thing
/**
 * @constructor
 */
neutrino.janx.TagletManager = function (inTagletProperties)
{
	this.tagletProperties = inTagletProperties;
};
neutrino.exportSymbol('neutrino.janx.TagletManager', neutrino.janx.TagletManager);

// METHODS

neutrino.janx.TagletManager.prototype.getTaglet = function (inTagName)
{
	return this.tagletProperties [inTagName];
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.JanxTreeWalker");

neutrino.require ("neutrino.LoadTreeWalker");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.JanxTreeWalker = function (inTagletManager)
{
	this.tagletManager = inTagletManager;
	this.loadTreeWalker = gApplication.createLoadTreeWalker ();
};
neutrino.exportSymbol('neutrino.janx.JanxTreeWalker', neutrino.janx.JanxTreeWalker);

// METHODS

// resolve a potentially multi-type thing
// some of the key could be in context
// like this.that could be a map, off which the.other works
// or somesuch
// iirc, the longest resolving thing from context should take it
// like this.that.the should override this.that

// inContextKey: complex key, eg this.that.the.other
// inContext: current context
// return: resolved value, or null
neutrino.janx.JanxTreeWalker.prototype.getContextReference = function (inContextKey, inContext)
{
// console.log ("TreeWalker.getContextReference() on " + inContextKey);
	
	var	value = null;

	var	validContextIndex = 0;
	var	validContextKey = null;
	var	validContextObject = null;
	
	var	expressionElements = inContextKey.split ('.');

	var	contextKey = "";
	
	for (var i = 0; i < expressionElements.length; i++)
	{
		if (contextKey.length > 0)
		{
			contextKey += '.';
		}
		
		contextKey += expressionElements [i];

		var	contextObject = inContext.get (contextKey);

		// do NOT use if (contextObject) here
		// as it will fail if it's the number zero!
		if (typeof (contextObject) != "undefined")
		{
			validContextObject = contextObject;
			validContextKey = contextKey;
			validContextIndex = i;
		}
	}

	if (validContextKey)
	{
		value = validContextObject;
		
		for (var i = validContextIndex + 1; i < expressionElements.length; i++)
		{
			value = value [expressionElements [i]];
			
			if (typeof (value) == "undefined" || value == null)
			{
				// bzzzt
				break;
			}

			if (typeof (value) == "function")
			{
				value = value.call (this);
			}
			else
			if (typeof (value) == "object")
			{
				// keep going
			}
			else
			{
				// do nothing, wait till next indirect
				break;
			}
		}
	}
	
	return value;
};

// inText: text with variable references, maybe
// inContext: current context
// return: expanded text
neutrino.janx.JanxTreeWalker.prototype.expandText = function (inText, inContext)
{
	var	inEntity = false;
	var	result = "";
	var	textBuffer = "";

	for (var i = 0; i < inText.length; i++)
	{
		var	ch = inText.charAt (i);

		if (ch == '$')
		{
			if (inEntity)
			{
				textBuffer = '$' + textBuffer;
			}
			else
			{
				inEntity = true;
			}
			
			result += textBuffer;
			textBuffer = "";
		}
		else
		if (ch == ';')
		{
			if (inEntity)
			{
				if (textBuffer.length > 0)
				{
					var	value = this.getContextReference (textBuffer, inContext);

					if (typeof (value) == "undefined" || value == null)
					{
						// add nothing to the buffer
						// note here that typeof (null) == "object"
						// therefore this check has to be here
					}
					else
					{
						if (typeof (value) == "string")
						{
							result += value;
						}
						else
						if (typeof (value) == "number")
						{
							result += "" + value;
						}
						else
						if (typeof (value) == "boolean")
						{
							result += value;
						}
						else
						if (typeof (value) == "object")
						{
							// anything but ""
							// as the existence needs to fail against "" in <ifnot>
							result += "OBJECT";
						}
					}
					
					textBuffer = "";
				}
				
				inEntity = false;
			}
			else
			{
				textBuffer += ch;
			}
		}
		else
		if (ch >= 'A' && ch <= 'Z')
		{
			textBuffer += ch;
		}
		else
		if (ch >= 'a' && ch <= 'z')
		{
			textBuffer += ch;
		}
		else
		if (ch >= '0' && ch <= '9')
		{
			textBuffer += ch;
		}
		else
		if (ch == '_' || ch == '.' || ch == ':' || ch == '-')
		{
			textBuffer += ch;
		}
		else
		{
			textBuffer += ch;
			
			// illegal character for variable reference
			if (inEntity)
			{
				textBuffer = '$' + textBuffer;
				
				inEntity = false;
			}
		}
	}
	
	if (textBuffer.length > 0)
	{
		if (inEntity)
		{
			result += '$';
		}
		
		result += textBuffer;
	}

	return result;
};

// inNode: DOM node
// return: node type as string
neutrino.janx.JanxTreeWalker.prototype.getNodeDescription = function (inNode)
{
	var	description = "unknown";
	
	if (inNode.nodeType == 1) // Node.ELEMENT_NODE
	{
		description = "element: " + inNode.nodeName;
	}
	else
	if (inNode.nodeType == 2) // Node.ATTRIBUTE_NODE
	{
		description = "attribute: " + inNode.nodeName;
	}
	else
	if (inNode.nodeType == 3) // Node.TEXT_NODE
	{
		description = "text: " + inNode.nodeValue;
	}
	else
	if (inNode.nodeType == 4) // Node.CDATA_SECTION_NODE
	{
		description = "cdata";
	}
	else
	if (inNode.nodeType == 5) // Node.ENTITY_REFERENCE_NODE
	{
		description = "entityref";
	}
	else
	if (inNode.nodeType == 6) // Node.ENTITY_NODE
	{
		description = "entity";
	}
	else
	if (inNode.nodeType == 7) // Node.PROCESSING_INSTRUCTION_NODE
	{
		description = "processinginstr";
	}
	else
	if (inNode.nodeType == 8) // Node.COMMENT_NODE
	{
		description = "comment";
	}
	else
	if (inNode.nodeType == 9) // Node.DOCUMENT_NODE
	{
		description = "document";
	}
	else
	if (inNode.nodeType == 10) // Node.DOCUMENT_TYPE_NODE
	{
		description = "documenttype";
	}
	else
	if (inNode.nodeType == 11) // Node.DOCUMENT_FRAGMENT_NODE
	{
		description = "documentfragment";
	}
	else
	if (inNode.nodeType == 12) // Node.NOTATION_NODE
	{
		description = "notation";
	}
	
	return description;
};

// we ended up with an element, let's do any Neutrinoisms associated with it
neutrino.janx.JanxTreeWalker.prototype.handleElementPreWalk = function (inElement)
{
	this.loadTreeWalker.onElement (inElement);
	
	var	view = neutrino.DOM.getData (inElement, "view");
	
	if (view)
	{
		// janxification happens as a result of onBeforeVisible()
		// so call this on the new element
		// this will not run the dynamics though, as we're in an expansion already
		view.onBeforeVisible (false);
		
		// note this is different to a regular janx expansion
		// as we're in the *middle* of one
		// and just need to make the template markup available in the right place

		if (view.nuTemplateHTML)
		{
			// console.log ("view with key " + view.key + " is dynamic, copying template markup");

			view.nuElement.innerHTML = view.nuTemplateHTML;
		}
	}
};

neutrino.janx.JanxTreeWalker.prototype.handleElementPostWalk = function (inElement)
{
	var	view = neutrino.DOM.getData (inElement, "view");

	if (view)
	{
		if (view.nuAsyncCount == 0)
		{
			view.onDOMReady ();
		}
		else
		{
			// wait for the view's async count to reach zero before calling onDOMReady()
		}
	}
}

neutrino.janx.JanxTreeWalker.prototype.walk = function (inNode, inContext)
{
// console.log ("TreeWalker.walk() on " + inNode.nodeName + "/" + inNode.nodeValue + " (" + inNode.nodeType + ")");

	if (inNode.nodeType == inNode.ENTITY_REFERENCE_NODE)
	{
		// in the Js version of Janx, we do not of course parse the HTML
		// therefore we don't convert $value; references into entity references
		// we expand the value references in text nodes etc
	}
	else
	if (inNode.nodeType == inNode.TEXT_NODE)
	{
		var	expandedText = this.expandText (inNode.nodeValue, inContext);

		if (expandedText != inNode.nodeValue)
		{
      // if there's some HTML in there then <span> it
      if (expandedText.indexOf ('<') >= 0 || expandedText.indexOf ('&') >= 0)
      {
        var span = document.createElement ("span");
        span.innerHTML = expandedText;
        
        inNode.parentNode.replaceChild (span, inNode);
      }
      else
      {
        inNode.nodeValue = expandedText;
      }
		}
	}
	else
	{
		var	taglet = null;
		
		if (inNode.nodeType == inNode.ELEMENT_NODE)
		{
      // if it's a neutrino template, we ignore it...
      if (neutrino.DOM.hasClass (inNode, "nu-template"))
      {
        // hack return here, but clearer than anything else
        console.error ("Janx encountered nu-template during walk, ignoring");

        return null;
      }

      this.walkAttributes (inNode, inContext);        
			
			var	tag = inNode.nodeName.toLowerCase ();
			taglet = this.tagletManager.getTaglet (tag);
		}
		
		if (taglet == null)
		{
			if (inNode.nodeType == inNode.ELEMENT_NODE)
			{
	 			this.handleElementPreWalk (inNode);
	 		}
	 		
			this.walkChildren (inNode, inContext);

			if (inNode.nodeType == inNode.ELEMENT_NODE)
			{
				this.handleElementPostWalk (inNode);
			}
		}
		else
		{
			if (taglet.checkRequiredAttributes (inNode))
			{
				var newNode = taglet.expand (inNode, inContext, this);
				
				// if some element remained in the tree after the taglet expansion
				// go off and check it for Neutrinoisms
        if (newNode)
        {
        	this.handleElementPreWalk (newNode);
        	this.handleElementPostWalk (newNode);
        }
			}
			else
			{
console.error ("taglet '" + inNode.nodeName.toLowerCase () + "' rejected attributes");
			}
		}
	}
};

// with a regular working DOM this shouldn't be necessary
// however, FireFox and IE9 together...
neutrino.janx.JanxTreeWalker.prototype.walkAttributes = function (inElement, inContext)
{
  if (inElement.attributes && inElement.attributes.length)
  {
    for (var i = 0; i < inElement.attributes.length; i++)
    {
      var attribute = inElement.attributes.item (i);
      
      var expandedValue = this.expandText (attribute.value, inContext);
      
      if (expandedValue != attribute.value)
      {
        attribute.value = expandedValue;
      }
    }
  }
};

neutrino.janx.JanxTreeWalker.prototype.walkChildren = function (inNode, inContext)
{
// console.log ("TreeWalker.walk() on " + inNode.nodeName + "/" + inNode.nodeValue + " (" + inNode.nodeType + ")");

  var child = null;
  var nextChild = inNode.firstChild;
  
  // walk this way because children can disappear in walk()
  do
  {
    child = nextChild;
    nextChild = null;
    
    if (child)
    {
      nextChild = child.nextSibling;
  
      this.walk (child, inContext);
    }
  }
  while (nextChild);
  
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.janx.Janx");

neutrino.require ("neutrino.janx.JanxTreeWalker");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.janx.Janx = function (inTagletManager, inDelegate)
{
	this.tagletManager = inTagletManager;
	this.delegate = inDelegate;
};
neutrino.exportSymbol('neutrino.janx.Janx', neutrino.janx.Janx);

// METHODS

// inElement: DOM element
// inContext: DelegateHashMap
neutrino.janx.Janx.prototype.janxify = function (inElement, inContext)
{
// console.log ("Janx.janxify() on ");
// console.log (inElement);
// console.log (inContext);

	var	walker = new neutrino.janx.JanxTreeWalker (this.tagletManager, this.delegate);
	walker.walk (inElement, inContext);
};

// inElement: DOM element
// inContext: DelegateHashMap
neutrino.janx.Janx.prototype.janxifyChildren = function (inElement, inContext)
{
// console.log ("Janx.janxify() on ");
// console.log (inElement);
// console.log (inContext);

	var	walker = new neutrino.janx.JanxTreeWalker (this.tagletManager, this.delegate);
	walker.walkChildren (inElement, inContext);
};

// inFromElement: tree containing taglet & context references
// outToElement: parent of resolved tree
// inContext: DelegateHashMap
// this is currently done the dumb way
// Janx should be able to janxify from->to
neutrino.janx.Janx.prototype.janxifyTo = function (inFromElement, outToElement, inContext, inAppend)
{
	// if not appending, blow away the output tree
	if (!inAppend)
	{
		while (outToElement.childNodes.length > 0)
		{
			outToElement.removeChild (outToElement.childNodes [0]);
		}
	}
	
	if (false)
	{
    // if IE, clone the tree the stupid way
  	console.error ("IE9 mode, cloning the template the slow way");
  	
  	this.copyChildren (inFromElement, outToElement);
	}
	else
	{
    // clone the output tree the quick way? 
    outToElement.innerHTML = inFromElement.innerHTML;
  }
  
	// now janxify
	this.janxifyChildren (outToElement, inContext);
};

neutrino.janx.Janx.prototype.janxifyText = function (inText, inContext)
{
// console.log ("Janx.janxifyText() on ");
// console.log (inText);

	// kinda wasteful for one string, but it's not done too often thankfully
	var	walker = new neutrino.janx.JanxTreeWalker (this.tagletManager, this.delegate);
	return walker.expandText (inText, inContext);
};

// leave this in here just in case IE9 or some hosed environment needs it
neutrino.janx.Janx.prototype.copyChildren = function (inFromElement, outToElement)
{
  if (inFromElement.hasChildNodes)
  {
    for (var i = 0; i < inFromElement.childNodes.length; i++)
    {
      var child = inFromElement.childNodes [i];
      
      if (child.nodeType == child.ELEMENT_NODE)
      {
        var newElement = document.createElement (child.tagName);
        
        if (child.attributes)
        {
          for (var j = 0; j < child.attributes.length; j++)
          {
            var attribute = child.attributes.item (j);
            
            newElement.setAttribute (attribute.name, attribute.value);
          }
        }
        
        outToElement.appendChild (newElement);
        
        this.copyChildren (child, newElement);
      }
      else
      if (child.nodeType == child.TEXT_NODE)
      {
        outToElement.appendChild (document.createTextNode (child.nodeValue));
      }
      else
      if (child.nodeType == child.CDATA_NODE || child.nodeType == child.COMMENT_NODE)
      {
        outToElement.appendChild (document.createComment (child.data));
      }
      else
      {
        console.error ("encountered node of type " + child.nodeType + ", not doing anything");
      }
    }
  }
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// css.js
// isolation on top of -webkit-transform, -moz-transform, etc

neutrino.provide ("neutrino.CSS");

neutrino.CSS = new Object ();
neutrino.exportSymbol("neutrino.CSS", neutrino.CSS);

neutrino.CSS.parseStyleSheet = function (inStyleSheet)
{
	// remove CSS comments from stylesheet
	inStyleSheet = neutrino.CSS.removeComments (inStyleSheet);
	
	var	styleSheet = new Array ();
	
	var	buffer = new Object ();
	buffer.style = inStyleSheet;
	buffer.offset = 0;
	
	do
	{
		neutrino.CSS.readSelector (buffer);
		
		var	selector = neutrino.Utils.stripSpaces (buffer.result);
		
		if (selector.length)
		{
			var	declaration = new Object ();
			declaration.selectorText = selector;
			
			if (selector.charAt (0) == "@")
			{
				declaration.directive = selector.split (" ")[0];
			}
			else
			{
				declaration.directive = null;
			}

			neutrino.CSS.readProperties (buffer);
			
			var	properties = neutrino.Utils.stripSpaces (buffer.result);
			declaration.propertyText = properties;
			
			if (declaration.directive == "@media"
				|| declaration.directive == "@-webkit-keyframes"
				|| declaration.directive == "@keyframes")
			{
				// inside @media is basically another stylesheet
				declaration.subDeclarations = neutrino.CSS.parseStyleSheet (properties);
			}
			else
			{
				// just properties
				declaration.properties = neutrino.CSS.parseProperties (properties);
			}
			
			styleSheet.push (declaration);
		}
	}
	while (buffer.offset < buffer.style.length);
	
	return styleSheet;
};
neutrino.exportSymbol("neutrino.CSS.parse", neutrino.CSS.parse);

neutrino.CSS.unparseStyleSheet = function (inStyleList, inIndentLevel)
{
	var	indentLevel = 0;
	
	if (typeof (inIndentLevel) == "number" && inIndentLevel > 0)
	{
		indentLevel = inIndentLevel;
	}
	
	// if this is the top level style sheet
	// then start with a couple of blank lines
	var	styleSheet = null;
	
	if (indentLevel > 0)
	{
		styleSheet = "";
	}
	else
	{
		styleSheet = "\n\n";
	}
	
	for (var i = 0; i < inStyleList.length; i++)
	{	
		var	style = inStyleList [i];
		
		for (var indent = 0; indent < indentLevel; indent++)
		{
			styleSheet += "\t";
		}
		
		styleSheet += style.selectorText;
		styleSheet += "\n";

		for (var indent = 0; indent < indentLevel; indent++)
		{
			styleSheet += "\t";
		}

		styleSheet += "{\n";
		
		// is this a sub-style, like @media?
		if (style.subDeclarations)
		{
			styleSheet += neutrino.CSS.unparseStyleSheet (style.subDeclarations, indentLevel + 1);
		}
		else
		{
			// do this to keep the formatting nice
			for (var key in style.properties)
			{
				for (var indent = 0; indent < indentLevel + 1; indent++)
				{
					styleSheet += "\t";
				}

				styleSheet += key;
				styleSheet += ": ";
				styleSheet += style.properties [key];
				styleSheet += ";";
				styleSheet += "\n";
			}
		}
		
		for (var indent = 0; indent < indentLevel; indent++)
		{
			styleSheet += "\t";
		}

		styleSheet += "}\n";
		styleSheet += "\n";
	}
	
	if (indentLevel == 0)
	{
		styleSheet += "\n";
	}

	return styleSheet;
}
neutrino.exportSymbol("neutrino.CSS.unparseStyleSheet", neutrino.CSS.unparseStyleSheet);

// convert browser neutral CSS into browser specific CSS
neutrino.CSS.resolveCSS = function (inCSS)
{
	var	browserSpecificStyle = inCSS;
	
	if (gApplication.isLogging (gApplication.kLogCSS)) console.log ("resolve css, browser type is " + gApplication.nuBrowser.type);

	var	resolutionTable = neutrino.CSS.resolutionTable [gApplication.nuBrowser.type];

	if (resolutionTable)
	{
		var	styleSheet = neutrino.CSS.parseStyleSheet (inCSS);
		
		for (var i = 0; i < styleSheet.length; i++)
		{
			var	style = styleSheet [i];
			
			// is this a sub-style, like @media?
			if (style.subDeclarations)
			{
				if (style.directive)
				{
					var	browserSpecificDirective = resolutionTable [style.directive];
					
					if (browserSpecificDirective)
					{
						style.directive = browserSpecificDirective;
						
						var	directiveElements = style.selectorText.split (" ");
						directiveElements [0] = browserSpecificDirective;
						
						style.selectorText = directiveElements.join (" ");
					}
				}
				
				for (var j = 0; j < style.subDeclarations.length; j++)
				{	
					var	subStyle = style.subDeclarations [j];
					
					// can't have substyles inside substyles, iirc
					neutrino.CSS.resolveCSSProperties (subStyle.properties, resolutionTable);
				}
			}
			else
			{
				neutrino.CSS.resolveCSSProperties (style.properties, resolutionTable);
			}
		}
		
		browserSpecificStyle = neutrino.CSS.unparseStyleSheet (styleSheet);
	}
	else
	{
		console.error ("no resolution table for browser type: " + gApplication.nuBrowser.type);
	}
	
	return browserSpecificStyle;
};
neutrino.exportSymbol("neutrino.CSS.resolveCSS", neutrino.CSS.resolveCSS);

neutrino.CSS.resolveCSSProperties = function (ioProperties, inResolutionTable)
{
	for (var property in ioProperties)
	{
		var	value = ioProperties [property];

		var	browserSpecificProperty = inResolutionTable [property];
		
		if (browserSpecificProperty)
		{

			// might want to tableify these properties, too
			if (property == "transition-property")
			{
				value = neutrino.CSS.resolveCSSProperty (value, inResolutionTable);
			}
			
			ioProperties [browserSpecificProperty] = value;
		}

		// some browser neutral properties require value mapping
		if (property == "display")
		{
			value = neutrino.CSS.resolveCSSProperty (value, inResolutionTable);
			ioProperties [property] = value;
		}
		
		// potentially rewrite some units
		var	newValue = this.resolveCSSUnits (value);
		
		if (newValue && newValue.length)
		{
			ioProperties [property] = newValue;
		}
	}
};
neutrino.exportSymbol("neutrino.CSS.resolveCSSProperties", neutrino.CSS.resolveCSSProperties);

neutrino.CSS.resolveCSSProperty = function (inProperty, inResolutionTable)
{
	var	newProperty = "";
	
	var	propertyElements = inProperty.split (",");
	
	for (var i = 0; i < propertyElements.length; i++)
	{
		var	property = neutrino.Utils.stripSpaces (propertyElements [i]);
		
		var	browserSpecificProperty = inResolutionTable [property];
		
		if (browserSpecificProperty)
		{
			property = browserSpecificProperty;
		}
		
		if (newProperty.length)
		{
			newProperty += ", ";
		}

		newProperty += property;
	}
	
	return newProperty;
};
neutrino.exportSymbol("neutrino.CSS.resolveCSSProperty", neutrino.CSS.resolveCSSProperty);

// rewrite vw and vh
neutrino.CSS.resolveCSSUnits = function (inValue)
{
	var	newValue = null;
	var	value = inValue.toLowerCase ();
	
	var	vwIndex = inValue.indexOf ("vw");
	
	if (vwIndex > 0 && vwIndex == (inValue.length - 2))
	{
		var	numerator = parseInt (inValue.substring (0, vwIndex));
		var	vwUnits = window.innerWidth / 100;
		
		newValue = "" + (numerator * vwUnits) + "px";
	}
	else
	{
		var	vhIndex = inValue.indexOf ("vh");
		
		if (vhIndex > 0 && vhIndex == (inValue.length - 2))
		{
			var	numerator = parseInt (inValue.substring (0, vhIndex));
			var	vhUnits = window.innerHeight / 100;
			
			newValue = "" + (numerator * vhUnits) + "px";
		}
	}
	
	return newValue;
};
neutrino.exportSymbol("neutrino.CSS.resolveCSSUnits", neutrino.CSS.resolveCSSUnits);

// replacement tables for CSS resolution

// some comments

// opera
// supports column-count & column-gap directly
// no support for appearance:
// no support for box-*:
// --
// ie
// no support for column-count & column-gap
// no support for appearance:
// no support for box-*:

neutrino.CSS.resolutionTable = 
{
	"webkit":
	{
    "align-content": "-webkit-align-content",
    "align-items": "-webkit-align-items",
    "align-self": "-webkit-align-self",
		"animation": "-webkit-animation",
		"animation-delay": "-webkit-animation-delay",
		"animation-direction": "-webkit-animation-direction",
		"animation-duration": "-webkit-animation-duration",
		"animation-fill-mode": "-webkit-animation-fill-mode",
		"animation-iteration-count": "-webkit-animation-iteration-count",
		"animation-name": "-webkit-animation-name",
		"animation-play-state": "-webkit-animation-play-state",
		"animation-timing-function": "-webkit-animation-timing-function",
		"appearance": "-webkit-appearance",
		"border-radius": "-webkit-border-radius",
		"border-top-left-radius": "-webkit-border-top-left-radius",
		"border-top-right-radius": "-webkit-border-top-right-radius",
		"border-bottom-right-radius": "-webkit-border-bottom-right-radius",
		"border-bottom-left-radius": "-webkit-border-bottom-left-radius",
		"box": "-webkit-box",	// for display: value mapping only
		"box-align": "-webkit-box-align",
		"box-direction": "-webkit-box-direction",
		"box-flex": "-webkit-box-flex",
		"box-flex-group": "-webkit-box-flex-group",
		"box-lines": "-webkit-box-lines",
		"box-ordinal-group": "-webkit-box-ordinal-group",
		"box-orient": "-webkit-box-orient",
		"box-pack": "-webkit-box-pack",
		"box-sizing": "-webkit-box-sizing",
		"box-group": "-webkit-box-group",
    "backface-visibility": "-webkit-backface-visibility",
    "break-after": "-webkit-break-after",
    "break-inside": "-webkit-break-inside",
		"column-count": "-webkit-column-count",
		"column-gap": "-webkit-column-gap",
		"filter": "-webkit-filter",
    "flex": "-webkit-flex",
    "flex-basis": "-webkit-flex-basis",
    "flex-direction": "-webkit-flex-direction",
    "flex-flow": "-webkit-flex-flow",
    "flex-grow": "-webkit-flex-grow",
    "flex-shrink": "-webkit-flex-shrink",
    "flex-wrap": "-webkit-flex-wrap",
    "justify-content": "-webkit-justify-content",
    "line-clamp": "-webkit-line-clamp",
    "order": "-webkit-order",
		"perspective": "-webkit-perspective",
		"text-transform": "-webkit-text-transform",
		"transform": "-webkit-transform",
		"transform-origin": "-webkit-transform-origin",
		"transform-style": "-webkit-transform-style",
		"transition": "-webkit-transition",
		"transition-delay": "-webkit-transition-delay",
		"transition-duration": "-webkit-transition-duration",
		"transition-property": "-webkit-transition-property",
		"transition-timing-function": "-webkit-transition-timing-function",
		"user-select": "-webkit-user-select",
		"@keyframes": "@-webkit-keyframes"
	},
	"gecko":
	{
    "align-content": "-moz-align-content",
    "align-items": "-moz-align-items",
    "align-self": "-moz-align-self",
		"animation": "-moz-animation",
		"animation-delay": "-moz-animation-delay",
		"animation-direction": "-moz-animation-direction",
		"animation-duration": "-moz-animation-duration",
		"animation-fill-mode": "-moz-animation-fill-mode",
		"animation-iteration-count": "-moz-animation-iteration-count",
		"animation-name": "-moz-animation-name",
		"animation-play-state": "-moz-animation-play-state",
		"animation-timing-function": "-moz-animation-timing-function",
		"appearance": "-moz-appearance",
    "backface-visibility": "-moz-backface-visibility",
		"border-radius": "-moz-border-radius",
		"border-top-left-radius": "-moz-border-radius-topleft",
		"border-top-right-radius": "-webkit-border-radius-top-right",
		"border-bottom-right-radius": "-webkit-border-radius-bottom-right",
		"border-bottom-left-radius": "-webkit-border-radius-bottom-left",
		"box": "-moz-box",	// for display: value mapping only
		"box-align": "-moz-box-align",
		"box-direction": "-moz-box-direction",
		"box-flex": "-moz-box-flex",
		"box-flex-group": "-moz-box-flex-group",
		"box-lines": "-moz-box-lines",
		"box-ordinal-group": "-moz-box-ordinal-group",
		"box-orient": "-moz-box-orient",
		"box-pack": "-moz-box-pack",
		"box-sizing": "-moz-box-sizing",
		"box-group": "-moz-box-group",
    "break-after": "-moz-break-after",
    "break-inside": "-moz-break-inside",
		"column-count": "-moz-column-count",
		"column-gap": "-moz-column-gap",
		"filter": "-moz-filter",
    "flex": "-moz-flex",
    "flex-basis": "-moz-flex-basis",
    "flex-direction": "-moz-flex-direction",
    "flex-flow": "-moz-flex-flow",
    "flex-grow": "-moz-flex-grow",
    "flex-shrink": "-moz-flex-shrink",
    "flex-wrap": "-moz-flex-wrap",
    "justify-content": "-moz-justify-content",
    "line-clamp": "-moz-line-clamp",
    "order": "-moz-order",
		"perspective": "-moz-perspective",
		"transform": "-moz-transform",
		"transform-origin": "-moz-transform-origin",
		"transform-style": "-moz-transform-style",
		"transition": "-moz-transition",
		"transition-delay": "-moz-transition-delay",
		"transition-duration": "-moz-transition-duration",
		"transition-property": "-moz-transition-property",
		"transition-timing-function": "-moz-transition-timing-function",
		"user-select": "-moz-user-select",
		"@keyframes": "@-moz-keyframes"
	},
	"opera":
	{
    "align-content": "-o-align-content",
    "align-items": "-o-align-items",
    "align-self": "-o-align-self",
		"animation": "-o-animation",
		"animation-delay": "-o-animation-delay",
		"animation-direction": "-o-animation-direction",
		"animation-duration": "-o-animation-duration",
		"animation-fill-mode": "-o-animation-fill-mode",
		"animation-iteration-count": "-o-animation-iteration-count",
		"animation-name": "-o-animation-name",
		"animation-play-state": "-o-animation-play-state",
		"animation-timing-function": "-o-animation-timing-function",
    "backface-visibility": "-o-backface-visibility",
		"box": "-o-box",	// for display: value mapping only
		"box-align": "-o-box-align",
		"box-direction": "-o-box-direction",
		"box-flex": "-o-box-flex",
		"box-flex-group": "-o-box-flex-group",
		"box-lines": "-o-box-lines",
		"box-ordinal-group": "-o-box-ordinal-group",
		"box-orient": "-o-box-orient",
		"box-pack": "-o-box-pack",
		"box-sizing": "-o-box-sizing",
		"box-group": "-o-box-group",
    "break-after": "-o-break-after",
    "break-inside": "-o-break-inside",
		"filter": "-o-filter",
    "flex": "-o-flex",
    "flex-basis": "-o-flex-basis",
    "flex-direction": "-o-flex-direction",
    "flex-flow": "-o-flex-flow",
    "flex-grow": "-o-flex-grow",
    "flex-shrink": "-o-flex-shrink",
    "flex-wrap": "-o-flex-wrap",
    "justify-content": "-o-justify-content",
    "line-clamp": "-o-line-clamp",
    "order": "-o-order",
		"perspective": "-o-perspective",
		"transform": "-o-transform",
		"transform-origin": "-o-transform-origin",
		"transform-style": "-o-transform-style",
		"transition": "-o-transition",
		"transition-delay": "-o-transition-delay",
		"transition-duration": "-o-transition-duration",
		"transition-property": "-o-transition-property",
		"transition-timing-function": "-o-transition-timing-function",
		"user-select": "-o-user-select",
		"@keyframes": "@-o-keyframes"
	},
	"ie":
	{
    "align-content": "-ms-align-content",
    "align-items": "-ms-align-items",
    "align-self": "-ms-align-self",
		"animation": "-ms-animation",
		"animation-delay": "-ms-animation-delay",
		"animation-direction": "-ms-animation-direction",
		"animation-duration": "-ms-animation-duration",
		"animation-fill-mode": "-ms-animation-fill-mode",
		"animation-iteration-count": "-ms-animation-iteration-count",
		"animation-name": "-ms-animation-name",
		"animation-play-state": "-ms-animation-play-state",
		"animation-timing-function": "-ms-animation-timing-function",
    "backface-visibility": "-ms-backface-visibility",
		"box": "-ms-box",	// for display: value mapping only
		"box-align": "-ms-box-align",
		"box-direction": "-ms-box-direction",
		"box-flex": "-ms-box-flex",
		"box-flex-group": "-ms-box-flex-group",
		"box-lines": "-ms-box-lines",
		"box-ordinal-group": "-ms-box-ordinal-group",
		"box-orient": "-ms-box-orient",
		"box-pack": "-ms-box-pack",
		"box-sizing": "-ms-box-sizing",
		"box-group": "-ms-box-group",
    "break-after": "-ms-break-after",
    "break-inside": "-ms-break-inside",
		"filter": "-ms-filter",
    "flex": "-ms-flex",
    "flex-basis": "-ms-flex-basis",
    "flex-direction": "-ms-flex-direction",
    "flex-flow": "-ms-flex-flow",
    "flex-grow": "-ms-flex-grow",
    "flex-shrink": "-ms-flex-shrink",
    "flex-wrap": "-ms-flex-wrap",
    "justify-content": "-ms-justify-content",
    "line-clamp": "-ms-line-clamp",
    "order": "-ms-order",
		"perspective": "-ms-perspective",
		"transform": "-ms-transform",
		"transform-origin": "-ms-transform-origin",
		"transform-style": "-ms-transform-style",
		"transition": "-ms-transition",
		"transition-delay": "-ms-transition-delay",
		"transition-duration": "-ms-transition-duration",
		"transition-property": "-ms-transition-property",
		"transition-timing-function": "-ms-transition-timing-function",
		"user-select": "-ms-user-select",
		"@keyframes": "@-ms-keyframes"
	}
};

neutrino.CSS.setTransitionDuration = function (inElement, inDuration)
{
  if (gApplication.nuBrowser.isWebKit)
  {
    inElement.style.webkitTransitionDuration = inDuration;
  }
  else
  if (gApplication.nuBrowser.isGecko)
  {
    inElement.style.MozTransitionDuration = inDuration;
  }
  else
  if (gApplication.nuBrowser.isIE9)
  {
    inElement.style.msTransitionDuration = inDuration;
  }
};
neutrino.exportSymbol("neutrino.CSS.setTransitionDuration", neutrino.CSS.setTransitionDuration);


// big sigh here
// the property *itself* can be a browser specific one
neutrino.CSS.setTransitionProperty = function (inElement, inProperty)
{
  if (gApplication.nuBrowser.isWebKit)
  {
    if (inProperty == "transform")
    {
      inProperty = "-webkit-transform";
    }
    
    inElement.style.webkitTransitionProperty = inProperty;
  }
  else
  if (gApplication.nuBrowser.isGecko)
  {
    if (inProperty == "transform")
    {
      inProperty = "-moz-transform";
    }

    inElement.style.MozTransitionProperty = inProperty;
  }
  else
  if (gApplication.nuBrowser.isIE9)
  {
    inElement.style.msTransitionProperty = inProperty;
  }
};
neutrino.exportSymbol("neutrino.CSS.setTransitionProperty", neutrino.CSS.setTransitionProperty);


neutrino.CSS.setTransitionTimingFunction = function (inElement, inFunction)
{
  if (gApplication.nuBrowser.isWebKit)
  {
    inElement.style.webkitTransitionTimingFunction = inFunction;
  }
  else
  if (gApplication.nuBrowser.isGecko)
  {
    inElement.style.MozTransitionFunction = inFunction;
  }
  else
  if (gApplication.nuBrowser.isIE9)
  {
    inElement.style.msTransitionFunction = inFunction;
  }
};
neutrino.exportSymbol("neutrino.CSS.setTransitionTimingFunction", neutrino.CSS.setTransitionTimingFunction);


neutrino.CSS.setTranslate3D = function (inElement, inTranslateX, inTranslateY, inTranslateZ)
{
  if (gApplication.nuBrowser.isWebKit)
  {
    inElement.style.webkitTransform =
      "translate3d(" + inTranslateX + "," + inTranslateY + "," + inTranslateZ + ")";
  }
  else
  if (gApplication.nuBrowser.isGecko)
  {
    inElement.style.MozTransform =
      "translate(" + inTranslateX + "," + inTranslateY + ")"; // the MOZ still doesn"t support translate3d.
  }
  else
  if (gApplication.nuBrowser.isIE9)
  {
    inElement.style.msTransform =
      "translate(" + inTranslateX + "," + inTranslateY + ")"; // IE still doesn"t support translate3d.
  }
};
neutrino.exportSymbol("neutrino.CSS.setTranslate3D", neutrino.CSS.setTranslate3D);

// PRIVATE

neutrino.CSS.parseProperties = function (inProperties)
{
	var	properties = new Object ();
	
	var	propertiesElements = inProperties.split (";");
	
	for (var i = 0; i < propertiesElements.length; i++)
	{
		var	property = propertiesElements [i];
		
		// caution, property values can have colons! thanks, Matt Gloier
		var	colonIndex = property.indexOf (":");
		
		if (colonIndex > 0)
		{
			var	key = neutrino.Utils.stripSpaces (property.substring (0, colonIndex));
			var	value = neutrino.Utils.stripSpaces (property.substring (colonIndex + 1));

			properties [key] = value;
		}

	}
	
	return properties;
}

neutrino.CSS.readSelector = function (ioBuffer)
{
	ioBuffer.result = "";
	
	for (; ioBuffer.offset < ioBuffer.style.length; ioBuffer.offset++)
	{
		var	ch = ioBuffer.style.charAt (ioBuffer.offset);
		
		if (ch == "{")
		{
			ioBuffer.offset++;
			break;
		}

		ioBuffer.result += ch;
	}
}

// balances braces, for reading keyframes, etc
neutrino.CSS.readProperties = function (ioBuffer)
{
	var	braceCount = 0;
	
	ioBuffer.result = "";
	
	for (; ioBuffer.offset < ioBuffer.style.length; ioBuffer.offset++)
	{
		var	ch = ioBuffer.style.charAt (ioBuffer.offset);

		if (ch == "{")
		{
			braceCount++;
		}
		else
		if (ch == "}")
		{
			if (braceCount == 0)
			{
				ioBuffer.offset++;
				break;
			}
			else
			{
				braceCount--;
			}
		}

		ioBuffer.result += ch;
	}
}

neutrino.CSS.removeComments = function (inStyleSheet)
{
	var	styleSheet = "";
	
	var	inComment = false;
	var	inSlash = false;
	var	inStar = false;

	for (var i = 0; i < inStyleSheet.length; i++)
	{
		var	ch = inStyleSheet [i];
		
		if (inComment)
		{
			if (inStar)
			{
				inStar = false;
				
				if (ch == '/')
				{
					inComment = false;
				}
			}
			else
			{
				if (ch == '*')
				{
					inStar = true;
				}
			}
		}
		else
		{
			if (inSlash)
			{
				inSlash = false;

				if (ch == '*')
				{
					inComment = true;
				}
				else
				{
					styleSheet += '/';
					styleSheet += ch;
				}
			}
			else
			{
				if (ch == '/')
				{
					inSlash = true;
				}
				else
				{
					styleSheet += ch;
				}
			}
		}
	}
	
	return styleSheet;
}


/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// json.js
// abstracting json.parse() and json.stringify()

neutrino.provide ("neutrino.JSON");

neutrino.JSON = new Object ();
neutrino.exportSymbol('neutrino.JSON', neutrino.JSON);

neutrino.JSON.parse = function (inString)
{
  if (typeof (JSON) == "object" && typeof (JSON.parse) == "function")
  {
    return JSON.parse (inString);
  }
  
  console.error ("could not find JSON.parse()");
}

neutrino.JSON.stringify = function (inObject)
{
  if (typeof (JSON) == "object" && typeof (JSON.stringify) == "function")
  {
    return JSON.stringify (inObject);
  }
  
  console.error ("could not find JSON.stringify()");
  return "could not find JSON.stringify()";
};


/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// xml.js
// abstracting XML parsing etc

neutrino.provide ("neutrino.XML");

neutrino.XML = new Object ();
neutrino.exportSymbol('neutrino.XML', neutrino.XML);

neutrino.XML.parse = function (inXML)
{
	var	doc = null;
	
	if (window.DOMParser)
	{
		doc = new DOMParser ().parseFromString (inXML, "text/xml");
	}
	else
	{
		doc = new ActiveXObject ("Microsoft.XMLDOM");
		doc.async = "false";
		doc.loadXML (data);
	}
	
	return doc;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// utils.js

neutrino.provide ("neutrino.Utils");

neutrino.require ("neutrino.JSON");

neutrino.Utils = new Object ();
neutrino.exportSymbol("neutrino.Utils", neutrino.Utils);

// private function for elementToJs()
neutrino.Utils.elementDuplicateChildren = function (inNode)
{
	var	dups = new Object ();
	var	nodeNames = new Object ();
	
	for (var i = 0; i < inNode.childNodes.length; i++)
	{
		var	child = inNode.childNodes [i];
		
		if (child.nodeType == child.ELEMENT_NODE)
		{
			var	childName = child.nodeName.toLowerCase ();
			
			if (nodeNames [childName])
			{
				dups [childName] = childName;
			}
			else
			{
				nodeNames [childName] = childName;
			}
		}
	}
	
	return dups;
};

neutrino.Utils.elementToJs = function (inNode)
{
	var	receiver = new Object ();
	
	receiver.name = inNode.nodeName;
	receiver.type = inNode.nodeType;
	
	if (inNode.nodeValue)
	{
		receiver.value = inNode.nodeValue;
	}
	
	if (inNode.nodeType == inNode.ELEMENT_NODE || inNode.nodeType == inNode.DOCUMENT_NODE)
	{
		receiver.attributes = new Object ();
		
		if (inNode.attributes && inNode.attributes.length)
		{
			for (var i = 0; i < inNode.attributes.length; i++)
			{
				var	attribute = inNode.attributes.item (i);
				
				receiver.attributes [attribute.name] = attribute.value;
			}
		}
		
		if (inNode.hasChildNodes)
		{
			receiver.children = new Array ();
			
			for (var i = 0; i < inNode.childNodes.length; i++)
			{
				var	child = inNode.childNodes [i];
				
				receiver.children.push (neutrino.Utils.elementToJs (child));
			}
		}
	}
	
	return receiver;
};

// less faithful, but if you don't care about text ordering etc
// then much easier to use from markup
neutrino.Utils.elementToJs2 = function (inNode)
{
	var	receiver = new Object ();
	
	receiver._attributes = new Object ();
	
	if (inNode.attributes && inNode.attributes.length)
	{
		for (var i = 0; i < inNode.attributes.length; i++)
		{
			var	attribute = inNode.attributes.item (i);
			
			receiver._attributes [attribute.name] = attribute.value;
		}
	}
	
	if (inNode.hasChildNodes)
	{
		var	dups = neutrino.Utils.elementDuplicateChildren (inNode);
		
		for (var i = 0; i < inNode.childNodes.length; i++)
		{
			var	child = inNode.childNodes [i];
			
			if (child.nodeType == child.ELEMENT_NODE)
			{
				var	js = neutrino.Utils.elementToJs (child);
				
				var	childName = child.nodeName.toLowerCase ();
				
				// is this child one of the dups?
				if (dups [childName])
				{
					var	listReceiver = receiver [childName];
					
					if (listReceiver == null || typeof (listReceiver) == "undefined")
					{
						receiver [childName] = new Array ();
					}
					
					receiver [childName].push (js);
				}
				else
				{
					// can insert this directly
					receiver [childName] = js;
				}
			}
			else
			if (child.nodeType == child.TEXT_NODE || child.nodeType == child.CDATA_SECTION_NODE)
			{
				var	text = receiver._text;
				
				if (text == null || typeof (text) == "undefined")
				{
					receiver._text = "";
				}
				
				receiver._text += child.nodeValue;
			}
		}
	}
	
	return receiver;	
};
neutrino.exportSymbol("neutrino.Utils.elementToJs", neutrino.Utils.elementToJs);

neutrino.Utils.findViewFromElement = function (inElement)
{
	var	parent = inElement;
	
	do
	{
		var	view = neutrino.Utils.getData (parent, "view");
		
		if (view)
		{
			break;
		}
		
		parent = parent.parentNode;
	}
	while (parent);
	
	return view;
}

// does the opposite of elementToJs()
// assumes 
neutrino.Utils.jsToElement = function (inJS)
{
	var	node = null;
	
	if (inJS.nodeType == Node.ELEMENT_NODE)
	{
		node = document.createElement (inJS.name);
		
		if (inJS.attributes)
		{
			for (var name in inJS.attributes)
			{
				if (inJS.attributes.hasOwnProperty (name))
				{
					node.setAttribute (name, inJS.attributes [name]);
				}
			}
		}
		
		if (inJS.children && inJS.children.length)
		{
			for (var i = 0; i < inJS.children.length; i++)
			{
				var	child = inJS.children [i];
				
				node.appendChild (neutrino.Utils.jsToElement (child));
			}
		}
	}
	else
	if (inJS.nodeType == Node.TEXT_NODE)
	{
		node = document.createTextNode (inJS.value);
	}
	
	return node;
};
neutrino.exportSymbol("neutrino.Utils.jsToElement", neutrino.Utils.elementToJs);

// pretends to be jquery $.ajax
// CAUTION: inRequest.url && inRequest.data may be changed by this method
neutrino.Utils.getURLContents = function (inRequest)
{
	if (! gApplication.nuIsOnline)
	{
		// see whether we have an offline url & data specified
		if (inRequest.offlineURL && inRequest.offlineURL.length)
		{
  		if (gApplication.isLogging (gApplication.kLogLoader))
  		{
  			console.log ("Utils.getURLContents() detects offline browser");
  			console.log ("substituting offline URL " + inRequest.offlineURL + (inRequest.offlineData ? "?" + inRequest.offlineData : ""));
			}
			
			inRequest.url = inRequest.offlineURL;
			inRequest.data = inRequest.offlineData;
		}
	}
	
  var fullURL = inRequest.url;
  
  if (inRequest.data && inRequest.data.length)
  {
    fullURL += "?" + inRequest.data;
  }
  
  if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("Utils.getURLContents() with " + fullURL);

	var	type = inRequest.type && inRequest.type.length ? inRequest.type : "GET";
	var	async = inRequest.async ? true : false;

  if (typeof ($) == "function")
  {
   	$.ajax (inRequest);
  }
  else
  {
    if (inRequest.dataType == "jsonp")
    {
    	console.error ("jquery currently required for jsonp");
    }
    else
    {
      var	request = new XMLHttpRequest ();
    
      request.onreadystatechange = function ()
      {
        if (this.readyState == 4)
        {
          var	textStatus = null;
    
          // status is 0 if loading off the filesystem (success or failure, sigh)
          // status is 200 for success if loading off the network
          if (this.status == 0 || this.status == 200)
          {
            textStatus = "OK";
            
            if (typeof (inRequest.success) == "function")
            {
              var	data = this.responseText;
    
              // if loading off the filesystem, can"t tell the difference
              // between a file not found and an empty file
              // so if status = 0 and data is empty, call the error callback
              if ((data && data.length) || this.status == 200)
              {
                if (inRequest.dataType == "json")
                {
                  try
                  {
                    data = neutrino.JSON.parse (data);
                    inRequest.success (data, textStatus, this);
                  }
                  catch (inError)
                  {
                    if (gApplication.isLogging (gApplication.kLogLoader)) console.log (inError);
                    // inRequest.error (this, "ERROR", inError);
                  }
                }
                else
                if (inRequest.dataType == "xml")
                {
                	try
                	{
                		var	xmlDocument = neutrino.XML.parse (data);

                    inRequest.success (xmlDocument, textStatus, this);
                	}
                	catch (inError)
                	{
                    if (gApplication.isLogging (gApplication.kLogLoader)) console.log (inError);
                    // inRequest.error (this, "ERROR", inError);
                	}
                }
                else
                {
                  inRequest.success (data, textStatus, this);
                }
              }
              else
              {
                if (gApplication.isLogging (gApplication.kLogLoader)) console.log (this.status);
                if (gApplication.isLogging (gApplication.kLogLoader)) console.log (data);
                inRequest.error (this, "ERROR");
              }
            }
          }
          else
          {
            textStatus = "ERROR";
            
            if (typeof (inRequest.error) == "function")
            {
              inRequest.error (this, textStatus);
            }
          }
    
          if (typeof (inRequest.complete) == "function")
          {
            inRequest.complete (this, textStatus);
          }
        }
      }
  
      // the order of open(), setRequestHeader(), and send() is important
      
      var	url = inRequest.url;
      
      // also have to do this with GET urls
      if (type == "GET" || type == "HEAD")
      {
        if (inRequest.data && inRequest.data.length)
        {
          url += "?" + inRequest.data;
        }
      }
    
      request.open (type, url, async);
    
      if (typeof (inRequest.headers) == "object")
      {
        for (var key in inRequest.headers)
        {
          var	value = inRequest.headers [key];
          
          if (typeof (value) != "function")
          {
            request.setRequestHeader (key, value);
          }
        }
      }
      
			if (inRequest.type == "POST")
			{
				var	length = inRequest.data && inRequest.data.length ? inRequest.data.length : 0;
				
				try
				{
					request.setRequestHeader ("Content-type", "application/x-www-form-urlencoded");
					request.setRequestHeader ("Content-length", length);
					request.setRequestHeader ("Connection", "close");
	
					request.send (inRequest.data);
				}
				catch (inError)
				{
					if (typeof (inRequest.error) == "function")
					{
						inRequest.error (inRequest, inError);
					}
				}
			}
			else
			{
				request.send (null);
			}
    }
  }
};
neutrino.exportSymbol("neutrino.Utils.getURLContents", neutrino.Utils.getURLContents);

neutrino.Utils.handleEvent = function (inEvent, inElement)
{
	neutrino.Utils.handleActions (inEvent, inElement);
  
  // nu-click and nu-link code removed, please use nu-action instead
};
neutrino.exportSymbol("neutrino.Utils.handleEvent", neutrino.Utils.handleClick);

neutrino.Utils.handleAction = function (inEvent, inElement, inAction, inParams)
{
	var	success = true;
	
	if (gApplication.isLogging (gApplication.kLogActions)) console.log ("Utils.handleAction()");
	if (gApplication.isLogging (gApplication.kLogActions)) console.log (inAction);
	
	// it's a little easier this way
	var	argument1 = inAction.arguments.length > 0 ? inAction.arguments [0] : undefined;
	var	argument2 = inAction.arguments.length > 1 ? inAction.arguments [1] : undefined;
	var	argument3 = inAction.arguments.length > 2 ? inAction.arguments [2] : undefined;
	
	if (inAction.opcode == "call")
	{
		if (argument1 && argument1.length)
		{
			var	result = gApplication.callMethodOnEnclosingView (argument1, inElement, inEvent, inEvent, inParams);
			
			// don't insist that all call: methods return properly
			if (typeof (result) == "boolean")
			{
				success = result;
			}
		}
		else
		{
			console.error ("call without method name on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "addclass")
	{
		if (argument2 == "$this")
		{
			argument2 = inElement;
		}
		
		if (argument1 && argument1.length && argument2)
		{
			neutrino.DOM.addClass (argument2, argument1);
			success = true;
		}
		else
		{
			console.error ("addclass without enough arguments on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "removeclass")
	{
		if (argument2 == "$this")
		{
			argument2 = inElement;
		}
		
		if (argument1 && argument1.length && argument2)
		{
			neutrino.DOM.removeClass (argument2, argument1);
			success = true;
		}
		else
		{
			console.error ("removeclass without enough arguments on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "toggleclass")
	{
		if (argument2 == "$this")
		{
			argument2 = inElement;
		}
		
		if (argument1 && argument1.length && argument2)
		{
			neutrino.DOM.toggleClass (argument2, argument1);
			success = true;
		}
		else
		{
			console.error ("toggleclass without enough arguments on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "showview")
	{
		if (argument1 && argument1.length)
		{
			success = gApplication.showView (argument1, inParams, argument2);
		}
		else
		{
			console.error ("showview without view key on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "hideview")
	{
		if (argument1 && argument1.length)
		{
			success = gApplication.hideView (argument1, argument2);
		}
		else
		{
			console.error ("hideview without view key on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "toggleview")
	{
		if (argument1 && argument1.length)
		{
			success = gApplication.toggleView (argument1, inParams, argument2, argument3);
		}
		else
		{
			console.error ("toggleview without view key on");
			console.error (inElement);
			success = false;
		}
	}
	else
	if (inAction.opcode == "setpage")
	{
		if (argument1 && argument1.length)
		{
			success = gApplication.setPage (argument1, argument2, argument3, inParams);
		}
		else
		{
			if (gApplication.nuPage)
			{
				// effectively a current page refresh
				success = gApplication.setPage (gApplication.nuPage.nuKey, undefined, undefined, inParams);
			}
			else
			{
				console.error ("setpage without page key or current page on");
				console.error (inElement);
				success = false;
			}
		}
	}
	else
	if (inAction.opcode == "setparams")
	{
		var	receiver = null;
		
		if (argument1)
		{
			if (argument1 == "application")
			{
				receiver = gApplication;
			}
			else
			if (argument1 == "window")
			{
				receiver = gApplication.nuWindow;
			}
			else
			if (argument1 == "page")
			{
				var	page = null;
				
				// second arg is page key
				if (argument2 && argument2.length)
				{
					page = gApplication.getPage (argument2);
					
					if (page)
					{
						receiver = page;
					}
					else
					{
						console.error ("setparams could not find page: " + argument2);
					}
				}
				else
				{
					receiver = gApplication.nuPage;
				}
			}
			else
			if (argument1 == "view")
			{
				var	view = null;
				
				// second arg is view key
				if (argument2 && argument2.length)
				{
					view = gApplication.getView (argument2);
					
					if (view)
					{
						receiver = view;
					}
					else
					{
						console.error ("setparams could not find view: " + argument2);
					}
				}
				else
				{
					console.error ("setparams with no view key specified");
				}
			}

			if (receiver)
			{
				success = true;
				receiver.setParams (inParams);
			}
		}
		else
		{
			console.error ("setparams with no scope argument");
		}
	}
	else
	{
		console.error ("unknown nu-action opcode: " + inAction.opcode);
		console.error (inAction);
		success = false;
	}
	
	return success;
};
neutrino.exportSymbol("neutrino.Utils.handleAction", neutrino.Utils.handleAction);

neutrino.Utils.handleActions = function (inEvent, inElement)
{
	if (gApplication.isLogging (gApplication.kLogActions)) console.log ("Utils.handleActions()");

	var	success = true;
	
	// note the zero and unsuffixed cases are optional
	for (var i = -1; true; i++)
	{
		var	attributeName = "nu-action";
		
		if (i >= 0)
		{
			attributeName += "-" + i;
		}
		
		var	action = inElement.getAttribute (attributeName);
		
		if (action && action.length)
		{
			actionObject = neutrino.Utils.parseAction (action);
			
			if (actionObject.event == inEvent.type)
			{
				var	paramsObject = null;
				
				var	params = inElement.getAttribute (attributeName + "-params");

				if (params && params.length)
				{
					paramsObject = neutrino.Utils.parseParams (params);
				}
				
				success = this.handleAction (inEvent, inElement, actionObject, paramsObject);

				/*
				if (! success)
				{
					console.error ("failure processing the following action -- ");
					console.error (action);
					console.error ("ignoring subsequent actions");
					
					break;
				}
				*/
			}
			else
			{
				// event types don't match, ignore
			}
		}
		else
		{
			// the "nu-action" and "nu-action-0" ones are optional
			if (i > 0)
			{
				break;
			}
		}
	}
	
};
neutrino.exportSymbol("neutrino.Utils.handleActions", neutrino.Utils.handleActions);

neutrino.Utils.parseAction = function (inActionString)
{
	if (gApplication.isLogging (gApplication.kLogActions)) console.log ("Utils.parseAction() on " + inActionString);

	var	action = new Object ();
	var	args = null;
	
	action.text = inActionString;
	
	var	colonIndex = inActionString.indexOf (':');
	
	var	openParenIndex = inActionString.indexOf ('(');
	var	closeParenIndex = -1;
	
	if (openParenIndex >= 0)
	{
		closeParenIndex = inActionString.indexOf (')', openParenIndex);
		
		if (closeParenIndex > openParenIndex)
		{
			if (colonIndex == -1 || colonIndex > closeParenIndex)
			{
				action.event = inActionString.substring (openParenIndex + 1, closeParenIndex);
			}
		}
	}
	
	// event name is allowed a default of "click"
	if (!action.event || !action.event.length)
	{
		// maps to click on desktop and touchend on mobile
		action.event = "clickdown";
	}

	if (colonIndex >= 0)
	{
		if (closeParenIndex > openParenIndex && colonIndex > closeParenIndex)
		{
			action.opcode = inActionString.substring (closeParenIndex + 1, colonIndex);
		}
		else
		{
			action.opcode = inActionString.substring (0, colonIndex);
		}

		args = neutrino.Utils.stripSpaces (inActionString.substring (colonIndex + 1));
	}
	else
	{
		if (closeParenIndex >= 0)
		{
			action.opcode = inActionString.substring (closeParenIndex + 1);
		}
		else
		{
			action.opcode = inActionString;
		}
	}

	if (action.opcode)
	{
		action.opcode = neutrino.Utils.stripSpaces (action.opcode);
	}
	
	if (args && args.length)
	{
		action.arguments = args.split ("/");
		
		for (var i = 0; i < action.arguments.length; i++)
		{
			action.arguments [i] = neutrino.Utils.stripSpaces (action.arguments [i]);
		}
	}
	else
	{
		action.arguments = new Array ();
	}

	if (gApplication.isLogging (gApplication.kLogActions)) console.log (action);
	
	return action;	
};
neutrino.exportSymbol("neutrino.Utils.parseAction", neutrino.Utils.parseAction);

neutrino.Utils.parseParams = function (inParamString)
{
	var	params = new Object ();
	
	var	paramsList = inParamString.split (";");
	
	for (var i = 0; i < paramsList.length; i++)
	{
		var	paramString = neutrino.Utils.stripSpaces (paramsList [i]);
		
		if (paramString.length > 0)
		{
		  // don"t use split() here, preserve any colons in the parameter *value* instead
		  var colonIndex = paramString.indexOf (":");
		  
		  if (colonIndex > 0)
		  {
		    var paramName = neutrino.Utils.stripSpaces (paramString.substring (0, colonIndex));
		    var	paramValue = "";
		    
		    colonIndex++;
		    
		    if (colonIndex < paramString.length)
		    {
        	paramValue = neutrino.Utils.stripSpaces (paramString.substring (colonIndex));
				}
				
			  params [paramName] = paramValue;
		  }
		}
	}
	
	return params;
};
neutrino.exportSymbol("neutrino.Utils.parseParams", neutrino.Utils.parseParams);


neutrino.Utils.printStackTrace = function ()
{
console.error ("printStackTrace() doesn't work with any Js class system, so you can stop calling it");
};
neutrino.exportSymbol("neutrino.Utils.printStackTrace", neutrino.Utils.printStackTrace);

neutrino.Utils.stripSpaces = function (inString)
{
	return inString.replace (/^\s+|\s+$/g, "");
};
neutrino.exportSymbol("neutrino.Utils.stripSpaces", neutrino.Utils.stripSpaces);

neutrino.Utils.unparseAction = function (inAction)
{
	var	actionString = "(" + inAction.event + ") " + inAction.opcode + ": ";
	
	for (var i = 0; i < inAction.arguments.length; i++)
	{
		if (i > 0)
		{
			actionString += "/";
		}
		
		actionString += inAction.arguments [i];
	}
	
	return actionString;
}
neutrino.exportSymbol("neutrino.Utils.unparseAction", neutrino.Utils.unparseAction);

neutrino.Utils.unparseParams = function (inParams)
{
  var unparsed = "";
  
  if (inParams)
  {
    for (var key in inParams)
    {
      var value = inParams [key];
      
      if (typeof (key) == "string" && typeof ("value") == "string")
      {
        unparsed += key + ": " + value + ";";
      }
    }
  }
  
	return unparsed;
};
neutrino.exportSymbol("neutrino.Utils.unparseParams", neutrino.Utils.unparseParams);


neutrino.Utils.validateEmailAddress = function (inAddress)
{
	var	valid = inAddress.length > 0;
	
	var	hadAt = false;
	var	local = "";
	var	domainElements = [];

	var	buffer = "";
	
	for (var i = 0; i < inAddress.length; i++)
	{
		var	ch = inAddress.charAt (i);
		
		if (ch == "@")
		{
			if (hadAt)
			{
				// console.error ("rejecting email address " + inAddress + " due to extra @ symbols");
				valid = false;
				break;
			}

			if (buffer.length === 0)
			{
				// console.error ("rejecting email address " + inAddress + " due to zero length local element");
				valid = false;
				break;
			}
			
			local = buffer;
			buffer = "";
			
			hadAt = true;
		}
		else
		if (ch == ".")
		{
			if (hadAt)
			{
				if (buffer.length === 0)
				{
					// console.error ("rejecting email address " + inAddress + " due to empty domain element");
					valid = false;
					break;
				}
				
				domainElements [domainElements.length] = buffer;
				buffer = "";
			}
			else
			{
				buffer += ch;
			}
		}
		else
		if ((ch >= "a" && ch <= "z") ||
			(ch >= "A" && ch <= "Z") ||
			(ch >= "0" && ch <= "9") ||
			("!#$%&'*+-/=?^_`{|}~".indexOf (ch) >= 0))
		{
			buffer += ch;
		}
		else
		{
			// console.error ("rejecting email address " + inAddress + " due to bad character " + ch);
			valid = false;
			break;
		}
	}

	if (valid && (buffer.length > 0))
	{
		if (hadAt)
		{
			domainElements [domainElements.length] = buffer;
		}
		else
		{
			local = buffer;
		}
	}
	
	// ASSUME already checked:
	// local length
	// individual domain element length
	// 
	
	if (valid && (! hadAt))
	{
		// console.error ("rejecting email address " + inAddress + " due to no @ character");
		valid = false;
	}
	
	if (valid && (domainElements.length < 2))
	{
		// console.error ("rejecting email address " + inAddress + " due to insufficient domain elements");
		valid = false;
	}
	
	if (valid && (domainElements [domainElements.length - 1].length < 2))
	{
		// console.error ("rejecting email address " + inAddress + " due to short final domain element");
		valid = false;
	}
	
	return valid;
};
neutrino.exportSymbol("neutrino.Utils.validateEmailAddress", neutrino.Utils.validateEmailAddress);



/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// dom.js
// abstraction for DOM related stuff

neutrino.provide ("neutrino.DOM");

neutrino.DOM = new Object ();
neutrino.exportSymbol('neutrino.DOM', neutrino.DOM);


neutrino.DOM.listen = function (inElement, inEventName, inFunction, inCapturePhase, inThis)
{
	if (!inElement)
	{
		console.error ("null/undefined element passed to neutrino.DOM.listen()");
		return;
	}
	
  var handler = function (inEvent)
  {
    if (typeof (inEvent.getBrowserEvent) == "function")
    {
      inFunction.call (inThis, inEvent.getBrowserEvent ());
    }
    else
    {
      inFunction.call (inThis, inEvent);
    }
  };
  
  if (! inElement.eventHandlers)
  {
    inElement.eventHandlers = new Object ();
  }
  
  if (inElement.eventHandlers [inEventName])
  {
    console.error ("duplicate " + inEventName + " handlers on");
    console.error (inElement);
  }
  
  // have to keep track of the handler
  inElement.eventHandlers [inEventName] = handler;
  
  if (typeof (inElement.addEventListener) == "function")
  {
		inElement.addEventListener
		(
			inEventName,
			handler,
			inCapturePhase
		);
	}
	else
  if (typeof (inElement.attachEvent) == "function")
	{
		inElement.attachEvent
		(
			inEventName,
			handler
		);
	}
	else
	{
		console.error ("unable to determine event listener functionbcw");
	}
};
neutrino.exportSymbol('neutrino.DOM.listen', neutrino.DOM.listen);


neutrino.DOM.unlisten = function (inElement, inEventName, inFunction, inCapturePhase, inThis)
{
  var handler = inElement.eventHandlers && inElement.eventHandlers [inEventName];

  if (handler)
  {
		// TODO check for jquery
		inElement.removeEventListener
		(
			inEventName,
			handler,
			inCapturePhase
		);
    
    delete inElement.eventHandlers [inEventName];
  }
};
neutrino.exportSymbol('neutrino.DOM.unlisten', neutrino.DOM.unlisten);

// multiple space-delimited class names ARE supported
neutrino.DOM.addClass = function (inSelectorOrElement, inClassNames)
{
	if (typeof ($) == "function")
	{
		$(inSelectorOrElement).addClass (inClassNames);
	}
	else
	{
		if (inClassNames && inClassNames.length)
		{
			var	classNameElements = inClassNames.toLowerCase ().split (' ');
					
			var	elements = neutrino.DOM.getElementList (inSelectorOrElement);
			
			for (var i = 0; elements && (i < elements.length); i++)
			{
				var	element = elements [i];
				
				var	classAttribute = element.getAttribute ("class");
				
				// a little optimisation here
				// if classAttribute has nothing in it, just set it to the incoming class name
				if (classAttribute && classAttribute.length)
				{
					var	classAttributeElements = classAttribute.toLowerCase ().split (' ');
					
					for (var j = 0; j < classNameElements.length; j++)
					{
						var	className = classNameElements [j];
						
						var	found = false;
						
						for (var k = 0; k < classAttributeElements.length; k++)
						{
							if (classAttributeElements [k] == className)
							{
								found = true;
								break;
							}
						}

						if (! found)
						{
							var	classAttribute = element.getAttribute ("class");
							
							classAttribute += " " + className;
							
							element.setAttribute ("class", classAttribute);
						}
					}
				}
				else
				{
					element.setAttribute ("class", inClassNames);
				}
			}
		}
		else
		{
console.error ("Utils.addClass() called with bad class name: " + inClassName);
console.error (inSelectorOrElement);
		}
	}
};
neutrino.exportSymbol('neutrino.DOM.addClass', neutrino.DOM.addClass);

// multiple space-delimited class names ARE supported
neutrino.DOM.removeClass = function (inSelectorOrElement, inClassNames)
{
	if (typeof ($) == "function")
	{
		$(inSelectorOrElement).removeClass (inClassNames);
	}
	else
	{
		if (inClassNames && inClassNames.length)
		{
			var	classNameElements = inClassNames.toLowerCase ().split (' ');
			
			var	elements = neutrino.DOM.getElementList (inSelectorOrElement);
			
			for (var i = 0; elements && (i < elements.length); i++)
			{
				var	element = elements [i];
				
				var	classAttribute = element.getAttribute ("class");
				
				if (classAttribute && classAttribute.length)
				{
					var	classAttributeElements = classAttribute.toLowerCase ().split (" ");
					
					for (var j = 0; j < classNameElements.length; j++)
					{
						var	className = classNameElements [j];
								
						for (var k = 0; k < classAttributeElements.length; k++)
						{
							if (classAttributeElements [k] == className)
							{
								classAttributeElements.splice (k, 1);
								element.setAttribute ("class", classAttributeElements.join (" "));
	
								break;
							}
						}
					}
				}
			}
		}
		else
		{
console.error ("Utils.removeClass() called with bad class name: " + inClassName);
console.error (inSelectorOrElement);
		}
	}
};
neutrino.exportSymbol('neutrino.DOM.removeClass', neutrino.DOM.removeClass);

// multiple space-delimited class names ARE supported
neutrino.DOM.toggleClass = function (inSelectorOrElement, inClassNames)
{
	if (typeof ($) == "function")
	{
		$(inSelectorOrElement).toggleClass (inClassNames);
	}
	else
	{
		if (inClassNames && inClassNames.length)
		{
			// do this once
			var	classNameElements = inClassNames.split (' ');
				
			var	elements = neutrino.DOM.getElementList (inSelectorOrElement);

			for (var i = 0; elements && (i < elements.length); i++)
			{
				var	element = elements [i];
				
				for (var j = 0; j < classNameElements.length; j++)
				{
					var	className = classNameElements [j];
					
					if (neutrino.DOM.hasClass (element, className))
					{
						neutrino.DOM.removeClass (element, className);
					}
					else
					{
						neutrino.DOM.addClass (element, className);
					}
				}
			}
		}
		else
		{
console.error ("Utils.toggleClass() called with bad class name: " + inClassName);
console.error (inSelectorOrElement);
		}
	}
};
neutrino.exportSymbol('neutrino.DOM.toggleClass', neutrino.DOM.removeClass);


// returns true if ANY of the selected elements has the class :-S
neutrino.DOM.hasClass = function (inSelectorOrElement, inClassName)
{
	var	hasClass = false;
	
	if (typeof ($) == "function")
	{
		hasClass = $(inSelectorOrElement).hasClass (inClassName);
	}
	else
	{
		// wtf are we getting null class names???
		if (inClassName && inClassName.length)
		{
			var	lowerCaseClassName = inClassName.toLowerCase ();
	
			var	elements = neutrino.DOM.getElementList (inSelectorOrElement);
			
			for (var i = 0; i < elements.length; i++)
			{
				var	element = elements [i];
				
				var	className = element.getAttribute ("class");
				
				if (className && className.length)
				{
					var	classNameElements = className.split (" ");
					
					for (var i = 0; i < classNameElements.length; i++)
					{
						if (classNameElements [i].toLowerCase () == lowerCaseClassName)
						{
							hasClass = true;
							break;
						}
					}
				}
			}
		}
		else
		{
console.error ("Utils.hasClass() called with bad class name: " + inClassName);
console.error (inSelectorOrElement);
		}
	}
	
	return hasClass;
};
neutrino.exportSymbol('neutrino.DOM.hasClass', neutrino.DOM.hasClass);


// returns data for first element found ONLY
neutrino.DOM.getData = function (inSelectorOrElement, inKey)
{
	var	data = null;
	
	if (typeof ($) == "function")
	{
		data = $(inSelectorOrElement).data (inKey);
	}
	else
	{
		var	elements = neutrino.DOM.getElementList (inSelectorOrElement);
		
		if (elements.length > 0)
		{
			var	element = elements [0];
			
			if (element && element.data)
			{
				data = element.data [inKey];
			}
		}
	}
	
	return data;
};
neutrino.exportSymbol('neutrino.DOM.getData', neutrino.DOM.getData);

neutrino.DOM.putData = function (inSelectorOrElement, inKey, inValue)
{
	if (typeof ($) == "function")
	{
		$(inSelectorOrElement).data (inKey, inValue);
	}
	else
	{
		var	elements = neutrino.DOM.getElementList (inSelectorOrElement);
		
		for (var i = 0; i < elements.length; i++)
		{
			var	element = elements [i];
			
			if (! element.data)
			{
				element.data = new Object ();
			}
			
			element.data [inKey] = inValue;
		}
	}
};
neutrino.exportSymbol('neutrino.DOM.putData', neutrino.DOM.putData);

neutrino.DOM.find = function (inElement, inSpec)
{
	var	found = null;
	
	if (typeof ($) == "function")
	{
		var	foundList = $(inElement).find (inSpec);
		
		found = new Array ();
		
		// sigh
		for (var i = 0; i < foundList.length; i++)
		{
			found [i] = foundList.get (i);
		}
	}
	else
	{
		found = inElement.querySelectorAll (inSpec);
	}
	
	return found;
};
neutrino.exportSymbol('neutrino.DOM.find', neutrino.DOM.find);

neutrino.DOM.findImmediateChildWithClass = function (inElement, inClass)
{
	var	found = null;
	
	if (typeof ($) == "function")
	{
		found = $(inElement).children ("." + inClass).get (0);
	}
	else
	{
		if (inElement.hasChildNodes ())
		{
			for (var i = 0; i < inElement.childNodes.length; i++)
			{
				var	child = inElement.childNodes [i];
				
				if (child.nodeType == 1 && neutrino.DOM.hasClass (child, inClass))
				{
					found = child;
					break;
				}
			}
		}
	}
	
	return found;
};
neutrino.exportSymbol('neutrino.DOM.findImmediateChildWithClass', neutrino.DOM.findImmediateChildWithClass);

neutrino.DOM.showElementsBySelector = function (inSelector)
{
	var	elements = document.querySelectorAll (inSelector);
	
	for (var i = 0; i < elements.length; i++)
	{
	  var element = elements [i];
	  
		neutrino.DOM.removeClass (element, "nu-invisible");
	}
};
neutrino.exportSymbol('neutrino.DOM.showElementsBySelector', neutrino.DOM.showElementsBySelector);

neutrino.DOM.hideElementsBySelector = function (inSelector)
{
	var	elements = document.querySelectorAll (inSelector);
	
	for (var i = 0; i < elements.length; i++)
	{
	  var element = elements [i];
	  
		neutrino.DOM.addClass (element, "nu-invisible");
	}
};
neutrino.exportSymbol('neutrino.DOM.hideElementsBySelector', neutrino.DOM.hideElementsBySelector);

neutrino.DOM.getChildElements = function (inElement)
{
	var	childElements = new Array ();
	
	if (inElement.hasChildNodes ())
	{
		for (var i = 0; i < inElement.childNodes.length; i++)
		{
			var	child = inElement.childNodes [i];
			
			if (child.nodeType == 1)
			{
				childElements.push (child);
			}
		}
	}
	
	return childElements;
};
neutrino.exportSymbol('neutrino.DOM.getChildElements', neutrino.DOM.getChildElements);

neutrino.DOM.getElementList = function (inSelectorOrElement)
{
	var	elements = null;
	
	if (inSelectorOrElement && (typeof (inSelectorOrElement) == "string"))
	{
		elements = document.querySelectorAll (inSelectorOrElement);
	}
	else
	if (inSelectorOrElement && (typeof (inSelectorOrElement) == "object"))
	{
		// can't use typeof .length here, as form elements have length! :-S
		if (Array.isArray (inSelectorOrElement.length))
		{
			elements = inSelectorOrElement;
		}
		else
		{
			elements = new Array ();
			elements.push (inSelectorOrElement);
		}
	}
	else
	{
		elements = new Array ();
	}
	
	return elements;
};
neutrino.exportSymbol('neutrino.DOM.getElementList', neutrino.DOM.getElementList);

neutrino.DOM.getBooleanAttribute = function (inElement, inAttributeName, inDefaultValue)
{
	var	value = inDefaultValue;
	var	stringValue = inElement.getAttribute (inAttributeName);
	
	if (stringValue && stringValue.length)
	{
		value = stringValue.toLowerCase () == "true";
	}
	
	return value;
}

neutrino.DOM.getFloatAttribute = function (inElement, inAttributeName, inDefaultValue)
{
	var	value = inDefaultValue;
	var	stringValue = inElement.getAttribute (inAttributeName);
	
	if (stringValue && stringValue.length)
	{
		value = parseFloat (stringValue);
		
		if (isNaN (value))
		{
			value = inDefaultValue;
		}
	}
	
	return value;
}

neutrino.DOM.getIntegerAttribute = function (inElement, inAttributeName, inDefaultValue)
{
	var	value = inDefaultValue;
	var	stringValue = inElement.getAttribute (inAttributeName);
	
	if (stringValue && stringValue.length)
	{
		value = parseInt (stringValue);
		
		if (isNaN (value))
		{
			value = inDefaultValue;
		}
	}
	
	return value;
}

neutrino.DOM.getParents = function (inElement)
{
	var	parents = new Array ();
	
	var parent = inElement.parentNode;
	
	if (parent)
	{
    do
    {
      if (parent != null)
      {
        parents.push (parent);
      }
      
      parent = parent.parentNode;
    }
    while (parent != null && parent != document);
  }
  else
  {
    console.error ("could not find parent node for");
    console.error (inElement);
  }
  
	return parents;
};
neutrino.exportSymbol('neutrino.DOM.getParents', neutrino.DOM.getParents);

// idea nicked from jquery
neutrino.DOM.globalEval = function (inScript)
{
	if (window.execScript)
	{
		window.execScript (inScript);
	}
	else
	{
		window ["eval"].call (window, inScript);
	}
};
neutrino.exportSymbol('neutrino.DOM.globalEval', neutrino.DOM.globalEval);

// do *not* use jquery.children() here as it only references *elements*
neutrino.DOM.moveChildren = function (inFromElement, inToElement)
{
  if (inFromElement.childNodes && inFromElement.childNodes.length)
  {
    while (inFromElement.childNodes.length > 0)
    {
      inToElement.appendChild (inFromElement.firstChild);
    }
  }
};
neutrino.exportSymbol('neutrino.DOM.moveChildren', neutrino.DOM.moveChildren);

neutrino.DOM.insertChildrenBefore = function (inParentNode, inBeforeElement)
{
  if (inParentNode && inBeforeElement && inBeforeElement.parentNode)
  {
    if (inParentNode.childNodes && inParentNode.childNodes.length)
    {
      while (inParentNode.childNodes.length > 0)
      {
        inBeforeElement.parentNode.insertBefore (inParentNode.firstChild, inBeforeElement);
      }
    }
  }
  else
  {
    console.error ("null parent or parent element passed to DOM.insertChildrenBefore()");
  }
};
neutrino.exportSymbol('neutrino.DOM.insertChildrenBefore', neutrino.DOM.moveChildren);

neutrino.DOM.replaceWithChildren = function (inReplaceElement, inParentElement)
{
  neutrino.DOM.insertChildrenBefore (inParentElement, inReplaceElement);
  
  if (inReplaceElement.parentNode)
  {
    inReplaceElement.parentNode.removeChild (inReplaceElement);
  }
};
neutrino.exportSymbol('neutrino.DOM.replaceWithChildren', neutrino.DOM.replaceWithChildren);

neutrino.DOM.removeChildren = function (inElement)
{
  if (inElement.childNodes && inElement.childNodes.length)
  {
    while (inElement.childNodes.length > 0)
    {
      inElement.removeChild (inElement.firstChild);
    }
  }
};
neutrino.exportSymbol('neutrino.DOM.moveChildren', neutrino.DOM.moveChildren);

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// loader.js

neutrino.provide ("neutrino.Loader");

neutrino.require ("neutrino.Page");
neutrino.require ("neutrino.Utils");

neutrino.Loader = function ()
{
};
neutrino.exportSymbol('neutrino.Loader', neutrino.Loader);

neutrino.Loader.enableLoadCSS = true;
neutrino.Loader.enableLoadHTML = true;
neutrino.Loader.enableLoadJS = true;

// static "instance" variable setup
neutrino.Loader.htmlPaths = new Object ();
neutrino.Loader.cssPaths = new Object ();
neutrino.Loader.jsPaths = new Object ();

// PUBLIC API

// use this instead of partying on the boolean itself
neutrino.Loader.setEnabled = function (inEnabled)
{
  if (gApplication && gApplication.isLogging(gApplication.kLogLoader)) {
    console.error ("Loader.setEnabled() to " + inEnabled);
  }

	// the HTML loader stays enabled for partially compiled applications
  neutrino.Loader.enableLoadCSS = inEnabled;
  neutrino.Loader.enableLoadHTML = true;
  neutrino.Loader.enableLoadJS = inEnabled;
}
neutrino.exportSymbol('neutrino.Loader.setEnabled', neutrino.Loader.setEnabled);

// this only does the basics
// as setPageInternal() and preloadPage() operate in different environments
neutrino.Loader.loadPage = function (inPageKey)
{
  var page = null;
  
  var lowerCasePageKey = inPageKey.toLowerCase ();
  
  neutrino.Loader.loadJavaScript (lowerCasePageKey, "page");
  
  var	pageClassName = inPageKey.substring (0, 1).toUpperCase ()
    + inPageKey.substring (1)
    + "Page";
  
  try
  {
    page = eval ("new " + pageClassName + "()");
  }
  catch (inError)
  {
if (gApplication.isLogging (gApplication.kLogLoader)) console.error ("defaulting page class for key " + lowerCasePageKey);

    page = new neutrino.Page ();
  }

  neutrino.Loader.loadCSS (lowerCasePageKey, "page");
  
  return page;
}

neutrino.Loader.loadView = function (inViewClassName, inViewKey, inElement, inPage)
{
if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("Loader.loadView() with name/key " + inViewClassName + "/" + inViewKey);

	var	view = null;
	var	loadFlags = "jhc";
	
	var	keyElements = inViewClassName.split (":");
	
	if (keyElements.length > 1)
	{
	  inViewClassName = keyElements [0];
		loadFlags = keyElements [1];
	}

	var	componentClassName = inElement.getAttribute ("nu-component");
	
	if (componentClassName && componentClassName.length)
	{
		if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("found component " + componentClassName);

		// if a component is specified, it overrides any view class specified in nu-view
		view = neutrino.Loader.loadViewClass (componentClassName);
	}
	else
	{
		if (loadFlags.indexOf ("j") >= 0)
		{
			view = neutrino.Loader.loadViewClass (inViewClassName);
		}
		else
		{
	// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("flags prevented loading of Js class");
		}
	}
	
	if (view == null)
	{
if (gApplication.isLogging (gApplication.kLogLoader)) console.error ("defaulting view class for key " + inViewKey);

		// defer to the application to create views
		view = gApplication.createView ();
	}
	
	var	lowerCaseViewClassName = inViewClassName.toLowerCase ();
  
	// load view CSS
	if (loadFlags.indexOf ("c") >= 0)
	{
		neutrino.Loader.loadCSS (lowerCaseViewClassName, "view");
	}
	else
	{
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("flags prevented loading of css");
	}

	// set up the view class
	// this sets view.nuElement
	// and janx context, etc
	view.configure (inViewKey.toLowerCase (), inElement, inPage);
	
	var	children = neutrino.DOM.getChildElements (view.nuElement);
	
	if (children.length == 0)
	{
		var	html = null;
		
		if (loadFlags.indexOf ("h") >= 0)
		{
			html = neutrino.Loader.loadHTML (lowerCaseViewClassName, "view");
		}
		else
		{
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("flags prevented loading of markup");
		}
		
		if (html && html.length)
		{
		  view.nuElement.innerHTML = html;
    }
	}
	else
	{
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("found extant markup, not loading any");
	}

	var	paramString = view.nuElement.getAttribute ("nu-view-params");
	
	if (paramString && paramString.length)
	{
		view.setParams (neutrino.Utils.parseParams (paramString));
	}
	
	view.onLoaded ();
	
	return view;
};

// PRIVATE METHODS

// since the advent of style.nu-browser-specific-css
// this has got a lot easier!
neutrino.Loader.insertStyle = function (inStyleTag)
{
	var	browserSpecificStyles = document.querySelector ("style#nu-browser-specific-css");

	if (browserSpecificStyles)
	{
		browserSpecificStyles.parentNode.insertBefore (inStyleTag, browserSpecificStyles);
	}
	else
	{
		console.error ("no style.nu-browser-specific-css found, cannot insert style");
	}
};

// act like we loaded the CSS when it is in fact preloaded
neutrino.Loader.markCSSLoaded = function (inLowerCaseKey, inType)
{
	var	path = "css/" + inType + "s/" + inLowerCaseKey + ".css";
	neutrino.Loader.cssPaths [path] = path;
};

neutrino.Loader.loadCSS = function (inLowerCaseKey, inType)
{
	var	key = inLowerCaseKey + "-" + inType;
	var	path = "css/" + inType + "s/" + inLowerCaseKey + ".css";

if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("Loader.loadCSS() with path " + path);

  if (neutrino.Loader.enableLoadCSS)
  {
    if (neutrino.Loader.cssPaths [path])
    {
  if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("path " + path + " is already loaded");
    }
    else
    {
      var	style = document.createElement ("style");
      style.setAttribute ("type", "text/css");
      style.setAttribute ("nu-key", key);
      
      neutrino.Utils.getURLContents
      ({
        url: path,
        dataType: "html",
        async: false,
        success: function (inData, inTextStatus, inXHR)
        {
          style.innerHTML = neutrino.CSS.resolveCSS (inData);
  
          neutrino.Loader.insertStyle (style);
          neutrino.Loader.cssPaths [path] = path;
        },
        error: function ()
        {
  if (gApplication.isLogging (gApplication.kLogLoader)) console.error ("load of " + path + " failed");
        }
      });
    }
  }
};

neutrino.Loader.loadHTML = function (inLowerCaseKey, inType)
{
	var	path = "html/" + inType + "s/" + inLowerCaseKey + ".html";
	
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("Loader.loadHTML() with path " + path);

	var	html = "";
	
  if (neutrino.Loader.enableLoadHTML)
  {
    html = neutrino.Loader.htmlPaths [path];
    
    if (!html)
    {
      neutrino.Utils.getURLContents
      ({
        url: path,
        dataType: "html",
        async: false,
        success: function (inData, inTextStatus, inXHR)
        {
          html = inData;
          
          neutrino.Loader.htmlPaths [path] = html;
        },
        error: function ()
        {
    if (gApplication.isLogging (gApplication.kLogLoader)) console.error ("load of " + path + " failed");
        }
      });
    }
  }
  
	return html;
};

// act like we loaded the Js when it is in fact preloaded
neutrino.Loader.markJavaScriptLoaded = function (inLowerCaseKey, inType)
{
	var	path = "js/" + inType + "s/" + inLowerCaseKey + ".js";
	neutrino.Loader.jsPaths [path] = path;
};

neutrino.Loader.loadJavaScript = function (inLowerCaseKey, inType)
{
	var	path = "js/" + inType + "s/" + inLowerCaseKey + ".js";
	
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("Loader.loadJavaScript() with path " + path);

  if (neutrino.Loader.enableLoadJS)
  {
    if (neutrino.Loader.jsPaths [path])
    {
if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("path " + path + " is already loaded");
    }
    else
    {
      neutrino.Utils.getURLContents
      ({
        url: path,
        dataType: "text",
        async: false,
        success: function (inData, inTextStatus, inXHR)
        {
          // $.globalEval (inData);
          neutrino.DOM.globalEval (inData);
        },
        error: function (inXHR, inTextStatus, inError)
        {
if (gApplication.isLogging (gApplication.kLogLoader)) console.error ("load of " + path + " failed");
        }
      });
      
      neutrino.Loader.jsPaths [path] = path;
    }
  }
};

neutrino.Loader.loadViewClass = function (inViewKey)
{
	var	view = null;
	
	// is the class name fully qualified?
	if (inViewKey.indexOf (".") >= 0)
	{
		// try a direct instantiate
    if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("instantiating " + inViewKey);

		try
		{
			view = eval ("new " + inViewKey + "()");
		}
		catch (inError)
		{
		}
	}
	else
	{
		// go through the regular sequence
		// note, preserve the case of the view key after the first character
		var	viewClassName = inViewKey.substring (0, 1).toUpperCase ()
			+ inViewKey.substring (1)
			+ "View";
	
    if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("instantiating " + viewClassName);

		try
		{
			view = eval ("new " + viewClassName + "()");
		}
		catch (inError)
		{
		}
	
		if (view == null)
		{
    	if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("loading " + viewClassName);

			// no luck? ok load the appropriate Js 
			neutrino.Loader.loadJavaScript (inViewKey.toLowerCase (), "view");
		
			try
			{
				view = eval ("new " + viewClassName + "()");
			}
			catch (inError)
			{
			}
		}
	}

  if (view == null)
  {
    if (gApplication.isLogging (gApplication.kLogLoader)) console.error ("could not instantiate class for " + inViewKey);
  }
	
	return view;
};

neutrino.Loader.unloadCSS = function (inLowerCaseKey, inType)
{
	var	key = inLowerCaseKey + "-" + inType;
	var	path = "css/" + key + ".css";

// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("Loader.unloadCSS() with path " + path);
	
	// pull the <style> for this
	var	styleTags = document.getElementsByTagName ("style");
	
	if (styleTags && styleTags.length)
	{
		for (var i = 0; i < styleTags.length; i++)
		{
			if (styleTags [i].getAttribute ("nu-key") == key)
			{
				styleTags [i].parentNode.remove (styleTags [i]);
				delete neutrino.Loader.cssPaths [path];
				
				break;
			}
		}
	}
};


// AssetLoader.js

// somewhat mostly stolen from Bruce's file/image_loader_queue
// with some tweakage for various things

neutrino.provide ("neutrino.AssetLoader");

/**
 * @constructor
 */
neutrino.AssetLoader = function (inCallbackObject, inLoaderCount)
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("AssetLoader().add()");

  this.callbackObject = inCallbackObject;
  
  if (typeof (inLoaderCount) == "number" && inLoaderCount > 0)
  {
  	this.loaderCount = inLoaderCount;
  }
  else
  {
  	this.loaderCount = 2;
  }
  
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("loader count is " + this.loaderCount);

  // the number of active loads
  this.loadCount = 0;
  
  // this advances with each asset load until the queue is exhausted
  // at which point it is reset
  this.assetIndex = 0;
  
  // this advances with each asset addition until the queue is exhausted
  // at which point it is reset
  this.assetCount = 0;

  this.queue = new Array ();
  
};
neutrino.exportSymbol('neutrino.AssetLoader', neutrino.AssetLoader);


neutrino.AssetLoader.prototype.add = function (inOneOrMany, inRunOnAdd)
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("AssetLoader.add()");

  var running = this.queue.length > 0;
  
  if (typeof (inOneOrMany) == "object" && typeof (inOneOrMany.length) == "number"
    && inOneOrMany.length > 0)
  {
    for (var i = 0; i < inOneOrMany.length; i++)
    {
      this.add (inOneOrMany [i], false);
    }
    
    if (! running)
    {
      this.fireStartCallback ();

      for (var i = 0; i < this.loaderCount; i++)
      {
	      this.run ();
			}
    }
  }
  else
  if (typeof (inOneOrMany) == "string")
  {
    this.queue.push (inOneOrMany);
    
    this.assetCount++;
    
    // if the loader is already running, don't start it
    if (! running)
    {
      var run = true;
      
      if (typeof (inRunOnAdd) != "undefined")
      {
        run = inRunOnAdd;
      }
      
      if (run)
      {
        this.fireStartCallback ();

				for (var i = 0; i < this.loaderCount; i++)
				{
					this.run ();
				}
      }
    }
  }
};

neutrino.AssetLoader.prototype.run = function ()
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("AssetLoader.run() with queue length of " + this.queue.length);

  if (this.queue.length > 0)
  {
    var url = this.queue.shift ();

		if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("AssetLoader.run() loading url: " + url);
    
    // i'd make these callbacks methods, but js won't let me
    var self = this;
      
    if (this.isImageURL (url))
    {
      var image = new Image ();
      
      image.onload = function ()
      {
        self.onLoad (url);
      }
      
      image.onerror = function ()
      {
        self.onLoadError (url);
      }

			this.loadCount++;
      image.src = url;
    }
    else
    {
      var xhr = new XMLHttpRequest ();
      
      xhr.onreadystatechange = function ()
      {
        if (this.readyState == 4)
        {
          // status is 0 for success if loading off the filesystem
          // status is 200 for success if loading off the network
          if (this.status == 0 || this.status == 200)
          {
            self.onLoad (url);
          }
          else
          {
            self.onLoadError (url);
          }
        }
      };
      
      this.loadCount++;
      
      xhr.open ("GET", url, true);
      xhr.send ();
    }
  }
};

neutrino.AssetLoader.prototype.isRunning = function ()
{
	return this.loadCount > 0;
};

// PRIVATE

neutrino.AssetLoader.prototype.onLoad = function (inURL)
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("AssetLoader.onLoad() with " + inURL);

	this.loadCount--;
  this.assetIndex++;
  
  this.fireProgressCallback ();
  this.run ();
};

neutrino.AssetLoader.prototype.onLoadError = function (inURL)
{
console.error ("AssetLoader.onLoadError() with " + inURL);

	this.loadCount--;
  this.assetIndex++;

  this.fireProgressCallback ();
  this.run ();
};

neutrino.AssetLoader.prototype.isImageURL = function (inURL)
{
  var lowerCaseURL = inURL.toLowerCase ();
  
  // handle the situation where there are arguments on t'end of the URL
  var	urlElements = lowerCaseURL.split ("?");
  var	urlStem = urlElements [0];
  
  return this.stringEndsWith (urlStem, ".jpg") || this.stringEndsWith (urlStem, ".jpeg")
    || this.stringEndsWith (urlStem, ".png") || this.stringEndsWith (urlStem, ".gif");
};

neutrino.AssetLoader.prototype.stringEndsWith = function (inString, inSuffix)
{
  return inString.length > inSuffix.length && inString.substr (0 - inSuffix.length) == inSuffix;
};

neutrino.AssetLoader.prototype.fireStartCallback = function ()
{
  if (this.callbackObject && (typeof (this.callbackObject.onAssetLoadStart) == "function"))
  {
    this.callbackObject.onAssetLoadStart (this);
  }
}

neutrino.AssetLoader.prototype.fireFinishCallback = function ()
{
  if (this.callbackObject && (typeof (this.callbackObject.onAssetLoadFinish) == "function"))
  {
    this.callbackObject.onAssetLoadFinish (this);
  }
}

neutrino.AssetLoader.prototype.fireProgressCallback = function ()
{
	var percentage = (this.assetIndex / this.assetCount) * 100;
    
  if (this.callbackObject && (typeof (this.callbackObject.onAssetLoadProgress) == "function"))
  {
    this.callbackObject.onAssetLoadProgress (this, this.assetIndex, this.assetCount, percentage);
  }
  
	if (percentage == 100)
	{
		this.fireFinishCallback ();

		// essentially reset the progress callbacks
		// until something else is added
		this.assetIndex = 0;
		this.assetCount = 0;
	}
}

/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.TreeWalker");

// super-simple treewalker that just calls its delegate on each found element
// NO janxification

/**
 * @constructor
 */
neutrino.TreeWalker = function ()
{
	this.recursionLevel = 0;
};
neutrino.exportSymbol('neutrino.TreeWalker', neutrino.TreeWalker);

// INTERFACE

neutrino.TreeWalker.prototype.onElement = function (inElement)
{
console.error ("default onElement() handler called");
};

// called when an element's tree has been fully walked
neutrino.TreeWalker.prototype.onElementWalked = function (inElement)
{
};

// PUBLIC METHODS

neutrino.TreeWalker.prototype.startWalk = function (inNode)
{
	this.inStart = true;
	this.walk (inNode);
	this.inStart = false;
};

neutrino.TreeWalker.prototype.startWalkChildren = function (inNode)
{
	this.inStart = true;
	this.walkChildren (inNode);
	this.inStart = false;
};

// PRIVATE METHODS

// inNode: DOM node
// overrideable for walkers that want to go in no-go zones...
neutrino.TreeWalker.prototype.canWalk = function (inNode)
{
	var	walk = true;
	
	if (inNode.getAttribute ("id") == "nu-page-container"
		|| neutrino.DOM.hasClass (inNode, "nu-template"))
	{
		walk = false;
	}
	
	return walk;
}

// inNode: DOM node
neutrino.TreeWalker.prototype.walk = function (inNode)
{
	if (! this.inStart)
	{
		console.error ("TreeWalker.walk() called without startWalk()");
		return;
	}
	
	this.recursionLevel++;
	
// console.log ("TreeWalker.walk() on");
// console.log (inNode);

	var	walkChildren = true;

	if (inNode.nodeType == 1) // ELEMENT_NODE
	{
		// this should never fire if people are behaving themselves :-)
		var	onclick = inNode.getAttribute ("onclick");

		if (onclick && onclick.length)
		{
// console.error ("found onclick handler in element");
// console.error (inNode);
		}
		
		// check for no-go areas
		if (this.canWalk (inNode))
		{
			var	result = this.onElement (inNode);
			
			if (typeof (result) == "boolean")
			{
				walkChildren = result;
			}
		}
		else
		{
			// sacred classes, invisible to walkers
			walkChildren = false;
		}
	}
	
	if (walkChildren)
	{
		this.walkChildren (inNode);
	}
	else
	{
// console.error ("walkChildren is false, not going into");
// console.error (inNode);
	}

	this.onElementWalked (inNode);
	
	this.recursionLevel--;
};

neutrino.TreeWalker.prototype.walkChildren = function (inNode)
{
	if (! this.inStart)
	{
		console.error ("TreeWalker.walkChildren() called without startWalkChildren()");
		return;
	}
	
	if (inNode.hasChildNodes ())
	{
		for (var i = 0; i < inNode.childNodes.length; i++)
		{
			this.walk (inNode.childNodes [i]);
		}
	}
};
/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

// loadtreewalker.js

neutrino.provide ("neutrino.LoadTreeWalker");

neutrino.require ("neutrino.Loader");
neutrino.require ("neutrino.TreeWalker");

// tree walker which loads elements

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.LoadTreeWalker = function ()
{
	neutrino.TreeWalker.call (this);	
};
neutrino.inherits (neutrino.LoadTreeWalker, neutrino.TreeWalker);
neutrino.exportSymbol('neutrino.LoadTreeWalker', neutrino.LoadTreeWalker);



// TREEWALKER IMPLEMENTATION

neutrino.LoadTreeWalker.prototype.onElement = function (inElement)
{
  // console.log ("LoadTreeWalker.onElement()");
  // console.log (inElement);
  
	var	view = neutrino.DOM.getData (inElement, "view");
	
	var	viewName = inElement.getAttribute ("nu-view");

	if (viewName && viewName.length)
	{
    var	viewKey = inElement.getAttribute ("nu-view-key");
    
    if (viewKey && viewKey.length)
    {
      // view key overridden
    }
    else
    {
      // default to view name, minus load flags
      viewKey = viewName.split (":") [0];
    }
    
    view = gApplication.nuPage.loadView (viewName, viewKey, inElement);
	}
	
  var	swipeAttr = inElement.getAttribute ("nu-swipe");
  
  if (swipeAttr && swipeAttr.length)
  {
    this.addSwipeEventListener (inElement);
  }
  
	var	eventTypes = new Object ();
	
  var	clickAttr = inElement.getAttribute ("nu-link");
  
  if (clickAttr && clickAttr.length)
  {
  	console.error ("nu-link is deprecated, please use nu-action setpage: instead");
  	console.error (inElement);
  	
		// eventTypes.click = "click";
	}
	
	clickAttr = inElement.getAttribute ("nu-click");

	if (clickAttr && clickAttr.length)
	{
  	console.error ("nu-click is deprecated, please use nu-action call: instead");
  	console.error (inElement);
  	
		// eventTypes.click = "click";
	}
	
	// note the zero and unsuffixed cases are optional
	for (var i = -1; true; i++)
	{
		var	attributeName = "nu-action";
		
		if (i >= 0)
		{
			attributeName += "-" + i;
		}
		
		var	action = inElement.getAttribute (attributeName);
		
		if (action && action.length)
		{
			var	actionObject = neutrino.Utils.parseAction (action);
			
			if (actionObject.event && actionObject.event.length)
			{
				var	newEventType = this.mapEventType (actionObject.event);
				
				eventTypes [newEventType] = newEventType;
				
				if (newEventType != actionObject.event)
				{
					actionObject.event = newEventType;

					// have to rewrite the attribute so that the event types match in Utils.handleActions()
					inElement.setAttribute (attributeName, neutrino.Utils.unparseAction (actionObject));
				}
			}
		}
		else
		{
			// the zeroth one is optional
			// ie, we allow starting with 0 or 1
			if (i > 0)
			{
				break;
			}
		}
	}
	
  for (var eventType in eventTypes)
  {
  	if (eventType == "tap")
  	{
  		// MOUSE

  		neutrino.DOM.listen
  		(
  			inElement,
  			"mousedown",
  			function (inEvent)
  			{
  				neutrino.DOM.putData (inElement, "intouch", true);
  				
  				inEvent.preventDefault ();
  			}
  		);
  		neutrino.DOM.listen
  		(
  			inElement,
  			"mouseout",
  			function (inEvent)
  			{
  				neutrino.DOM.putData (inElement, "intouch", false);
  				
  				inEvent.preventDefault ();
  			}
  		);

  		neutrino.DOM.listen
  		(
  			inElement,
  			"mouseup",
  			function (inEvent)
  			{
  				if (neutrino.DOM.getData (inElement, "intouch"))
  				{
  					var	tapEvent = new CustomEvent
  					(
  						"tap",
  						{
  						}
  					);
  					
  					inElement.dispatchEvent (tapEvent);
  					
  					inEvent.preventDefault ();
  				}
  			}
  		);
  		
  		// TOUCH
  		
  		neutrino.DOM.listen
  		(
  			inElement,
  			"touchstart",
  			function (inEvent)
  			{
  				neutrino.DOM.putData (inElement, "intouch", true);
  				
  				//inEvent.preventDefault ();
  			}
  		);
  		neutrino.DOM.listen
  		(
  			inElement,
  			"touchleave",
  			function (inEvent)
  			{
  				neutrino.DOM.putData (inElement, "intouch", false);
  				
  				inEvent.preventDefault ();
  			}
  		);
  		neutrino.DOM.listen
  		(
  			inElement,
  			"touchmove",
  			function (inEvent)
  			{
  				// HACK we should check for a little slop here perchance
  				neutrino.DOM.putData (inElement, "intouch", false);
  				
  				//inEvent.preventDefault ();
  			}
  		);
  		neutrino.DOM.listen
  		(
  			inElement,
  			"touchcancel",
  			function (inEvent)
  			{
  				neutrino.DOM.putData (inElement, "intouch", false);
  				
  				inEvent.preventDefault ();
  			}
  		);
  		neutrino.DOM.listen
  		(
  			inElement,
  			"touchend",
  			function (inEvent)
  			{
  				if (neutrino.DOM.getData (inElement, "intouch"))
  				{
  					var	tapEvent = new CustomEvent
  					(
  						"tap",
  						{
  						}
  					);
  					
  					inElement.dispatchEvent (tapEvent);
  					
  					inEvent.preventDefault ();
  				}
  			}
  		);
  	}

		neutrino.DOM.listen
		(
			inElement,
			eventType,
			function (inEvent)
			{
				neutrino.Utils.handleEvent (inEvent, inElement);
			}
		);
  }

};

neutrino.LoadTreeWalker.prototype.addSwipeEventListener = function (inElement)
{
if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("LoadTreeWalker.addSwipeEventListener() on");
if (gApplication.isLogging (gApplication.kLogLoader)) console.log (inElement);

	// EVENT HANDLER FUNCTIONS

	// for move/up outside our blessed element
	var	body = document.querySelector ("body");

	var	downFunction = function (inEvent)
	{
		var	action = inElement.getAttribute ("nu-swipe");
	
		if (action && action.length)
		{
			action += "Start";

// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("calling " + action);

			gApplication.callMethodOnEnclosingView (action, inElement, inEvent, inEvent);
		}
		
		inEvent.preventDefault ();
	};
	
	var	moveFunction = function (inEvent)
	{
		var	action = inElement.getAttribute ("nu-swipe");
		
		if (action && action.length)
		{
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("found nu-swipe pointing to " + action);

			action += "Move";
			
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("calling " + action);

			gApplication.callMethodOnEnclosingView (action, inElement, inEvent, inEvent);
		}
		
		inEvent.preventDefault ();
	};
	
	var	upFunction = function (inEvent)
	{
		var	action = inElement.getAttribute ("nu-swipe");
		
		if (action && action.length)
		{
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("found nu-swipe pointing to " + action);

			action += "End";
			
// if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("calling " + action);

			gApplication.callMethodOnEnclosingView (action, inElement, inEvent, inEvent);
		
			if (gApplication.nuBrowser.isMobile)
			{
				neutrino.DOM.unlisten (inElement, "touchmove", moveFunction);
				neutrino.DOM.unlisten (inElement, "touchend", upFunction);

				neutrino.DOM.unlisten (body, "touchmove", moveFunction);
				neutrino.DOM.unlisten (body, "touchend", upFunction);
			}
			else
			{
				neutrino.DOM.unlisten (inElement, "mousemove", moveFunction);
				neutrino.DOM.unlisten (inElement, "mouseup", upFunction);

				neutrino.DOM.unlisten (body, "mousemove", moveFunction);
				neutrino.DOM.unlisten (body, "mouseup", upFunction);
			}
		}
		
		inEvent.preventDefault ();
	};

	// MOUSE/TOUCH DOWN

	// for callbacks
	var	self = this;
	
	if (gApplication.nuBrowser.isMobile)
	{
		neutrino.DOM.listen
		(
			inElement,
			"touchstart",
			function (inEvent)
			{
if (gApplication.isLogging (gApplication.kLogLoader)) console.log ("touchstart handler called, switching to touch mode");
	
				downFunction.call (self, inEvent);
				
				neutrino.DOM.listen (inElement, "touchmove", moveFunction);
				neutrino.DOM.listen (inElement, "touchend", upFunction);
	
				neutrino.DOM.listen (body, "touchmove", moveFunction);
				neutrino.DOM.listen (body, "touchend", upFunction);
			
				inEvent.preventDefault ();
			}
		);
	}
	else
	{
		neutrino.DOM.listen
		(
			inElement,
			"mousedown",
			function (inEvent)
			{
				downFunction.call (self, inEvent);

				neutrino.DOM.listen (inElement, "mousemove", moveFunction);
				neutrino.DOM.listen (inElement, "mouseup", upFunction);

				neutrino.DOM.listen (body, "mousemove", moveFunction);
				neutrino.DOM.listen (body, "mouseup", upFunction);
			
				inEvent.preventDefault ();
			}
		);
	}

};

neutrino.LoadTreeWalker.mouseEventTypeMap = 
{
	"clickdown" : "click",
	"down": "mousedown",
	"move": "mousemove",
	"up": "mouseup"
};

// back to touchstart for the moment
// touchend implies touchstart in same element
// so some work to be done
neutrino.LoadTreeWalker.touchEventTypeMap = 
{
	"clickdown" : "touchstart",
	"down": "touchstart",
	"move": "touchmove",
	"up": "touchend"
};

// maps an event type which might be a virtual event type
// to a real event type
neutrino.LoadTreeWalker.prototype.mapEventType = function (inEventType)
{
	var	newEventType = null;
	
	if (gApplication.nuBrowser.isMobile)
	{
		newEventType = neutrino.LoadTreeWalker.touchEventTypeMap [inEventType];
	}
	else
	{
		newEventType = neutrino.LoadTreeWalker.mouseEventTypeMap [inEventType];
	}
	
	if (!newEventType || (newEventType.length == 0))
	{
		newEventType = inEventType;
	}

	return newEventType;
};

/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.OnBeforeVisibleTreeWalker");

neutrino.require ("neutrino.TreeWalker");


// tree walker which calls onBeforeVisible()

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.OnBeforeVisibleTreeWalker = function ()
{
	neutrino.TreeWalker.call (this);	
};
neutrino.inherits (neutrino.OnBeforeVisibleTreeWalker, neutrino.TreeWalker);
neutrino.exportSymbol('neutrino.OnBeforeVisibleTreeWalker', neutrino.OnBeforeVisibleTreeWalker);
// SUPERCLASS

// TREEWALKER OVERRIDES

neutrino.OnBeforeVisibleTreeWalker.prototype.startWalk = function (inElement, inRunDynamics)
{
	if (typeof (inRunDynamics) == "boolean")
	{
		this.runDynamics = inRunDynamics;
	}
	else
	{
		this.runDynamics = true;
	}
	
	neutrino.TreeWalker.prototype.startWalk.call (this, inElement);
};

neutrino.OnBeforeVisibleTreeWalker.prototype.startWalkChildren = function (inElement, inRunDynamics)
{
	if (typeof (inRunDynamics) == "boolean")
	{
		this.runDynamics = inRunDynamics;
	}
	else
	{
		this.runDynamics = true;
	}
	
	neutrino.TreeWalker.prototype.startWalkChildren.call (this, inElement);
};

// TREEWALKER IMPLEMENTATION

neutrino.OnBeforeVisibleTreeWalker.prototype.onElement = function (inElement)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("onBeforeVisibleTreeWalker.onElement() for element");
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inElement);

	var	visible = ! neutrino.DOM.hasClass (inElement, "nu-invisible");

	var	view = neutrino.DOM.getData (inElement, "view");
	
	if (view && visible)
	{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("onBeforeVisibleTreeWalker found view " + view.key + " with recursion " + this.recursionLevel);
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("visible? " + visible);

		view.onBeforeVisible (this.runDynamics);

		var	transitionVisibleClass = inElement.getAttribute ("nu-transition-visible");
		
		if (transitionVisibleClass && transitionVisibleClass.length)
		{
			// this is like an abridged version of showView()
			// without all the things we don't need
			// we already established that we're not invisible
			// we're in the middle of a walk, so we don't need a subwalk
			// we're in the middle of a walk, so we don't need setParams()
			// so just transition in...
			
			view.nuTransitionVisibleClass = transitionVisibleClass;
			
			neutrino.DOM.addClass (view.nuElement, view.nuTransitionVisibleClass);
		}
	}
	
	// assume that a found view will walk its own subtree
	return visible && !view;
};

/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.OnVisibleTreeWalker");

neutrino.require ("neutrino.TreeWalker");

// tree walker which calls onVisible()

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.OnVisibleTreeWalker = function ()
{
	neutrino.TreeWalker.call (this);	
};
neutrino.inherits (neutrino.OnVisibleTreeWalker, neutrino.TreeWalker);
neutrino.exportSymbol('neutrino.OnVisibleTreeWalker', neutrino.OnVisibleTreeWalker);


// TREEWALKER IMPLEMENTATION

neutrino.OnVisibleTreeWalker.prototype.onElement = function (inElement)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("onVisibleTreeWalker.onElement() for element");
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inElement);

	var	visible = ! neutrino.DOM.hasClass (inElement, "nu-invisible");

	var	view = neutrino.DOM.getData (inElement, "view");
	
	if (view && visible)
	{
		var	transitionVisibleClass = inElement.getAttribute ("nu-transition-visible");
		
		if (transitionVisibleClass && transitionVisibleClass.length)
		{
			// onVisible() will get called when the transition ends
		}
		else
		{
			view.onVisible ();
		}
	}
	
	// assume that a found view will walk its own subtree
	return visible && !view;
};

/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

// onBeforeInvisibletreewalker.js

neutrino.provide ("neutrino.OnBeforeInvisibleTreeWalker");

neutrino.require ("neutrino.TreeWalker");

var	particle = particle || new Object ();

// tree walker which calls onBeforeInvisible()

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.OnBeforeInvisibleTreeWalker = function ()
{
	neutrino.TreeWalker.call (this);	
};
neutrino.inherits (neutrino.OnBeforeInvisibleTreeWalker, neutrino.TreeWalker);
neutrino.exportSymbol('neutrino.OnBeforeInvisibleTreeWalker', neutrino.OnBeforeInvisibleTreeWalker);
// SUPERCLASS


// TREEWALKER IMPLEMENTATION

neutrino.OnBeforeInvisibleTreeWalker.prototype.onElement = function (inElement)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("onBeforeInvisibleTreeWalker.onElement() for element");
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inElement);

	var	visible = ! neutrino.DOM.hasClass (inElement, "nu-invisible");

	var	view = neutrino.DOM.getData (inElement, "view");
	
	if (view && visible)
	{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("onBeforeInvisibleTreeWalker found view " + view.key + " with recursion " + self.recursionLevel);
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("visible? " + visible);
		

		// coming in visible, notify
		view.onBeforeInvisible ();
	}
	
	// assume that a found view will walk its own subtree
	return visible && !view;
};

/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

// onInvisibleTreeWalker.js

neutrino.provide ("neutrino.OnInvisibleTreeWalker");

neutrino.require ("neutrino.TreeWalker");

// tree walker which calls onInvisible()

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.OnInvisibleTreeWalker = function ()
{
	neutrino.TreeWalker.call (this);	
};
neutrino.inherits (neutrino.OnInvisibleTreeWalker, neutrino.TreeWalker);
neutrino.exportSymbol('neutrino.OnInvisibleTreeWalker', neutrino.OnInvisibleTreeWalker);


// TREEWALKER IMPLEMENTATION

neutrino.OnInvisibleTreeWalker.prototype.onElement = function (inElement)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("onInvisibleTreeWalker.onElement() for element");
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inElement);

	var	visible = ! neutrino.DOM.hasClass (inElement, "nu-invisible");

	var	view = neutrino.DOM.getData (inElement, "view");
	
	if (view && visible)
	{
		view.onInvisible ();
	}
	
	// assume that a found view will walk its own subtree
	return visible && !view;
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// jsui_view.js

neutrino.provide ("neutrino.View");

neutrino.require ("neutrino.OnBeforeInvisibleTreeWalker");
neutrino.require ("neutrino.OnBeforeVisibleTreeWalker");
neutrino.require ("neutrino.OnInvisibleTreeWalker");
neutrino.require ("neutrino.OnVisibleTreeWalker");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.DOM");

/**
 * @constructor
 */
neutrino.View = function ()
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.init()");

	this.nuParams = new Object ();
	
	this.nuOnBeforeVisibleWalker = gApplication.createOnBeforeVisibleTreeWalker ();
	this.nuOnVisibleWalker = gApplication.createOnVisibleTreeWalker ();

	this.nuOnBeforeInvisibleWalker = gApplication.createOnBeforeInvisibleTreeWalker ();
	this.nuOnInvisibleWalker = gApplication.createOnInvisibleTreeWalker ();
	
	this.nuAsyncCount = 0;
	
	this.nuConstructorCalled = true;
	this.nuCheckedForDynamics = false;
	
	this.nuTransitionVisibleClass = "nu-transition-visible";
	this.nuTransitionInvisibleClass = "nu-transition-invisible";
	
	this.nuFormValidators = new Object ();
	this.nuFormValidators.email = this.validateEmail;
	this.nuFormValidators.number = this.validateNumber;
	this.nuFormValidators.url = this.validateURL;

};
neutrino.exportSymbol('neutrino.View', neutrino.View);

// VIEW LIFECYCLE

neutrino.View.prototype.configure = function (inKey, inElement, inPage)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.configure() with key " + inKey);

	this.nuKey = inKey;
	this.nuElement = inElement;
	this.nuPage = inPage;
	
	if (! this.nuConstructorCalled)
	{
    console.error ("'" + this.nuKey + "' view did not call View()");
	}
	
	// some subclasses of View, eg Page, won't have this.nuPage
	if (this.nuPage)
	{
		this.nuJanxContext = new neutrino.janx.DelegateHashMap (this.nuPage.nuJanxContext);
		this.nuJanxContext.put ("view.key", this.nuKey);

		this.nuJanxContext.put ("params.offset", 0);
		this.nuJanxContext.put ("params.limit", 10);
	}
	
	neutrino.DOM.putData (inElement, "view", this);
	
	// don't check for dynamics here, it's too early
	// wait for the load tree walker to call checkForDynamics() from onElementWalked()

	this.nuConfigureCalled = true;
};

neutrino.View.prototype.onAnimationStart = function (inEvent)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onAnimationStart()");

};

neutrino.View.prototype.onAnimationEnd = function (inEvent)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onAnimationEnd()");

};

neutrino.View.prototype.onAsyncStart = function ()
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onAsyncStart() with key " + this.nuKey);

  this.nuAsyncCount++;

if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("async count is now " + this.nuAsyncCount);
};

neutrino.View.prototype.onAsyncEnd = function (inData)
{
  if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onAsyncEnd() with key " + this.nuKey);

  this.nuAsyncCount--;

  if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("async count is now " + this.nuAsyncCount);
  
  if (this.nuAsyncCount == 0)
  {
    // defer onDOMReady() if necessary
    if (this.nuOnBeforeVisibleCalled)
    {
      this.onDOMReady ();
    }
    else
    {
      if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("deferring onDOMReady() to onBeforeVisible()");
    }
  }

  if (this.nuAsyncCount < 0)
  {
    console.error ("onAsyncEnd() went negative");
  }

};

neutrino.View.prototype.onLoaded = function ()
{
	if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onLoaded() with key " + this.nuKey);

	this.nuOnLoadedCalled = true;

	this.reportAnalyticsEvent ("onloaded", null);
};

// called when Janx completes
// or anyway if no Janx
neutrino.View.prototype.onDOMReady = function ()
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onDOMReady() with key " + this.nuKey);

  if (this.nuProgressElement)
  {
    this.nuElement.removeChild (this.nuProgressElement);
  }
  
  if (this.nuTemplateHTML)
  {
  	// if we're an embedded dynamic view, nuJanxElement won't be there
  	if (this.nuJanxElement)
  	{
			neutrino.DOM.moveChildren (this.nuJanxElement, this.nuElement);
			this.nuElement.removeChild (this.nuJanxElement);
		}
		
    // don't load the child views any more, as the JanxWalker does it (fanfare)
    // gApplication.startWalkChildren (output, this.nuOnVisibleCalled);
    // this.nuOnBeforeVisibleWalker.startWalkChildren (this.nuElement);
    
    if (this.nuOnVisibleCalled)
    {
      this.nuOnVisibleWalker.startWalkChildren (this.nuElement);
    }
  }
  
	this.nuOnDOMReadyCalled = true;

	this.reportAnalyticsEvent ("ondomready", null);
};

neutrino.View.prototype.onBeforeVisible = function (inRunDynamics)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onBeforeVisible(" + inRunDynamics + ") with key " + this.nuKey);

	if (typeof (inRunDynamics) == "undefined")
	{
		console.error ("'" + this.nuKey + "' view's onBeforeVisible() called with no dynamics parameter");
	}
	
	if (! this.nuOnLoadedCalled)
	{
    console.error ("'" + this.nuKey + "' view did not call View.onLoaded()");
	}
	
	// do this whether or not we're running dynamics
	// because if we have nested dynamic views
	// the inner one needs to save its template
	// BEFORE the dynamics run on the outer one
	this.checkForDynamics ();
	
	if (inRunDynamics)
	{
		this.janxify ();
	}
	else
	{
		// console.error ("not running dynamics on view with key " + this.nuKey);
		this.nuOnBeforeVisibleWalker.startWalkChildren (this.nuElement, false);
	}
	
	this.nuOnBeforeVisibleCalled = true;
	this.nuOnVisibleCalled = false;
};

neutrino.View.prototype.onVisible = function ()
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onVisible() with key " + this.nuKey);

	if (! this.nuOnBeforeVisibleCalled)
	{
    console.error ("'" + this.nuKey + "' view did not call View.onBeforeVisible()");
	}
	
	this.nuOnVisibleWalker.startWalkChildren (this.nuElement);
	
	this.nuOnVisibleCalled = true;
	
	this.reportAnalyticsEvent ("onvisible", null);
};

neutrino.View.prototype.onBeforeInvisible = function ()
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onBeforeInvisible() with key " + this.nuKey);

	if (! this.nuOnDOMReadyCalled)
	{
    console.error ("'" + this.nuKey + "' view did not call View.onDOMReady()");
	}
	
	if (! this.nuOnVisibleCalled)
	{
    // console.error ("'" + this.nuKey + "' view did not call View.onVisible()");
	}
	
	this.nuOnBeforeInvisibleWalker.startWalkChildren (this.nuElement);
	
	this.nuOnBeforeInvisibleCalled = true;
	
	// reset some other state
	this.nuOnBeforeVisibleCalled = false;
	this.nuOnDOMReadyCalled = false;
	this.nuOnVisibleCalled = false;
};

neutrino.View.prototype.onInvisible = function ()
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onInvisible() with key " + this.nuKey);

	if (! this.nuOnBeforeInvisibleCalled)
	{
    console.error ("'" + this.nuKey + "' view did not call View.onBeforeInvisible()");
	}
	
	this.nuOnInvisibleWalker.startWalkChildren (this.nuElement);
	
	this.nuOnInvisibleCalled = true;
	
	this.reportAnalyticsEvent ("oninvisible", null);
};

neutrino.View.prototype.onBeforeUnload = function ()
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.onBeforeUnload()");

	if (! this.nuOnInvisibleCalled)
	{
    console.error ("'" + this.nuKey + "' view did not call View.onInvisible()");
	}
	
};

neutrino.View.prototype.onFormSubmission = function (inEvent)
{
	try
	{
		var formValid = true;
		var	firstInvalidInput = null;
		
		var	inputs = inEvent.target.querySelectorAll ("input");
		
		for (var i = 0; i < inputs.length; i++)
		{
			var	valid = true;
			
			var	input = inputs [i];
			var	value = input.value;

			if (value == null)
			{
				value = "";
			}
			
			var	required = input.getAttribute ("required");
			
			if (required && (required.toLowerCase () == "true"))
			{
				valid = value != null && value.length > 0;
			}
			else
			{
				// if the field is empty and not required, skip it
				if (value == "")
				{
					continue;
				}
			}
			
			if (valid)
			{
				var	pattern = input.getAttribute ("pattern");
				
				if (pattern && pattern.length)
				{
					valid = this.validatePattern (value, pattern);
				}
			}

			if (valid)
			{
				var	type = input.getAttribute ("type");
				
				if (!type || !type.length)
				{
					type = "text";
				}
				
				type = type.toLowerCase ();
				
				var	validator = this.nuFormValidators [type];
				
				if (validator)
				{
					valid = validator.call (this, input);
				}
			}
			
			if (valid)
			{
				neutrino.DOM.removeClass (input, "error");
			}
			else
			{
				neutrino.DOM.addClass (input, "error");
				
				formValid = false;
				
				if (firstInvalidInput == null)
				{
					firstInvalidInput = input;
				}
			}
		}

		if (! formValid)
		{
			firstInvalidInput.focus ();
		}
	}
	catch (inError)
	{
		console.error (inError);
	}
	
	// if the form failed validation, stop it submitting
	// otherwise, leave for subclass to handle
	if (! formValid)
	{
  	inEvent.preventDefault ();
	}
	
	return formValid;
};

neutrino.View.prototype.onSwipeStart = function (inEvent)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("neutrino.View.onSwipeStart()");

	this.nuTouchX = inEvent.screenX;
	this.nuTouchY = inEvent.screenY;
	this.nuTouchTime = new Date ().getTime ();
};

neutrino.View.prototype.onSwipeMove = function (inEvent)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("neutrino.View.onSwipeMove()");
};

neutrino.View.prototype.onSwipeEnd = function (inEvent)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("neutrino.View.onSwipeEnd()");

	var	timeDelta = new Date ().getTime () - this.nuTouchTime;
	
	var	right = inEvent.screenX - this.nuTouchX;
	var	down = inEvent.screenY - this.nuTouchY;
	
	var	absX = Math.abs (inEvent.screenX - this.nuTouchX);
	var	absY = Math.abs (inEvent.screenY - this.nuTouchY);
	
	if (absX >= absY)
	{
		if (right >= 0)
		{
			if (typeof (this.onSwipeRight) == "function")
			{
				this.onSwipeRight.call (this, right, timeDelta);
			}
		}
		else
		{
			if (typeof (this.onSwipeLeft) == "function")
			{
				this.onSwipeLeft.call (this, -right, timeDelta);
			}
		}
	}
	else
	{
		if (down >= 0)
		{
			if (typeof (this.onSwipeDown) == "function")
			{
				this.onSwipeDown.call (this, down, timeDelta);
			}
		}
		else
		{
			if (typeof (this.onSwipeUp) == "function")
			{
				this.onSwipeUp.call (this, -down, timeDelta);
			}
		}
	}
};

// PUBLIC METHODS

neutrino.View.prototype.clickNext = function ()
{
	var	offset = this.nuJanxContext.get ("offset");
	var	limit = this.nuJanxContext.get ("limit");
	
	offset += limit;
	
	this.nuJanxContext.put ("offset", offset);
	
	this.refresh ();
};

neutrino.View.prototype.clickPrevious = function ()
{
	var	offset = this.nuJanxContext.get ("offset");
	
	if (offset == 0)
	{
    console.error ("clickPrevious() called with offset of zero");
	}
	else
	{
		var	limit = this.nuJanxContext.get ("limit");
		offset = Math.max (0, offset - limit);

		this.nuJanxContext.put ("offset", offset);

		this.refresh ();
	}
};

// caution, we only take note of Neutrino's view of whether something is visible
neutrino.View.prototype.isVisible = function ()
{
	return !neutrino.DOM.hasClass (this.nuElement, "nu-invisible");
};

neutrino.View.prototype.refresh = function ()
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("View.refresh() with key " + this.nuKey);
	
	this.janxify ();
	
	this.reportAnalyticsEvent ("onrefresh", null);
};

// abstracted into View so that subclasses can override and monkey with the event
neutrino.View.prototype.reportAnalyticsEvent = function (inEventName, inDetail)
{
	if (this.nuPage)
	{
		gApplication.reportAnalyticsEvent (this.nuPage.key, this.nuKey, inEventName, inDetail);
	}
	else
	{
		gApplication.reportAnalyticsEvent (this.nuKey, null, inEventName, inDetail);
	}
};

neutrino.View.prototype.setParams = function (inParams)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log
	("View.setParams() with key " + this.nuKey);
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inParams);

	if (inParams)
	{
		for (var key in inParams)
		{
			var	value = inParams [key];
			
      this.nuParams [key] = value;
      this.nuJanxContext.put ("params." + key, value);
		}
	}
	else
	{
		// leave params untouched
	}

};

// PRIVATE METHODS

neutrino.View.prototype.checkForDynamics = function ()
{
	// only do this once, for obvious reasons
	if (this.nuCheckedForDynamics)
	{
		return;
	}
	
	this.nuCheckedForDynamics = true;
	
  this.nuTemplateHTML = null;
  
	var	isDynamic = this.nuElement.getAttribute ("nu-dynamic");

	if (isDynamic && (isDynamic == "true"))
	{
		this.nuTemplateHTML = this.nuElement.innerHTML;
		this.nuElement.innerHTML = "";
	}
	
  // BACKWARD COMPATIBILITY
  // check for the old way
  var templateID = this.nuElement.getAttribute ("nu-template-id");
  
  if (templateID && templateID.length)
  {
    var	templateElement = document.getElementById (templateID);
    
    if (templateElement == null)
    {
      console.error ("could not find template element for ID " + templateID);
    }
    else
    {
    	this.nuTemplateHTML = templateElement.innerHTML;
    }
  }
  
};

neutrino.View.prototype.janxify = function ()
{
  if (this.nuTemplateHTML)
  {
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("janxifying...");
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (this.nuJanxContext);
		
		if (this.nuAsyncCount > 0)
		{
			// console.error ("janxify() called with nonzero async count!");
			
			// OK so in this case we assume that refresh() has been called
			// while the previous janxify() is still going
			// as we wipe out the markup each time,
			// fireAsyncEnd() will not be able to find the dynamic view
			// so nuAsyncCount will not be updated
			// therefore, it is safe to zero out nuAsyncCount here
			// and start things afresh
			// better than refusing the update? i'd say so
			// because the contents, if actually refreshed, will be correct
			this.nuAsyncCount = 0;
		}
		
    this.nuJanxElement = document.createElement ("div");
    neutrino.DOM.addClass (this.nuJanxElement, "janx-place-holder");
    neutrino.DOM.addClass (this.nuJanxElement, "nu-invisible");

    // ensure the janx place holder is the only child
    neutrino.DOM.removeChildren (this.nuElement);
    this.nuElement.appendChild (this.nuJanxElement);
    
    var progressSelector = this.nuElement.getAttribute ("nu-progress-selector");
    
    if (progressSelector && progressSelector.length)
    {
      var progressElement = document.querySelector (progressSelector);
      
      if (progressElement == null)
      {
        console.error ("could not find progress element for ID " + progressID);
      }
      else
      {
        this.nuProgressElement = document.createElement ("div");
        neutrino.DOM.addClass (this.nuProgressElement, "janx-progress");
        this.nuProgressElement.innerHTML = progressElement.innerHTML;
        this.nuElement.appendChild (this.nuProgressElement);
      }
    }
    else
    {
      this.nuProgressElement = null;
    }

		this.nuJanxElement.innerHTML = this.nuTemplateHTML;

    // must ensure that we survive to call onDOMReady()
    try
    {
			gApplication.janxify (this.nuJanxElement, this.nuJanxContext);
		}
		catch (inError)
		{
			console.log (inError);
		}
		
		if (this.nuAsyncCount == 0)
		{
		  // delay this, as onBeforeVisible() removes invisible
		  // and the browser needs time to react before clients
		  // potentially calculate the element width in onDOMReady(), etc
		  var self = this;
		  
		  setTimeout
		  (
		    function ()
		    {
    			self.onDOMReady ();
    		},
    		1
    	);
		}
	}
	else
	{
		this.nuOnBeforeVisibleWalker.startWalkChildren (this.nuElement, true);

		// only call onDOMReady() once for static views
		if (! this.nuOnDOMReadyCalled)
		{
		  // delay this, as onBeforeVisible() removes invisible
		  // and the browser needs time to react before clients
		  // potentially calculate the element width in onDOMReady(), etc
		  var self = this;
		  
		  setTimeout
		  (
		    function ()
		    {
    			self.onDOMReady ();
    		},
    		1
    	);
		}
	}
};

neutrino.View.prototype.updatePageIndicators = function (inData)
{
	var	previous = neutrino.DOM.find (this.nuElement, ".previous");
	
	if (previous)
	{
		if (this.nuJanxContext.get ("offset") == 0)
		{
			neutrino.DOM.addClass (previous, "nu-invisible");
		}
		else
		{
			neutrino.DOM.removeClass (previous, "nu-invisible");
		}
	}
	
	var	next = neutrino.DOM.find (this.nuElement, ".next");
	
	if (next && inData.data)
	{
		// if our page size is less than requested, disable "next"
		if (inData.data.length < this.nuJanxContext.get ("limit"))
		{
			neutrino.DOM.addClass (next, "nu-invisible");
		}
		else
		{
			neutrino.DOM.removeClass (next, "nu-invisible");
		}
	}
};

// input type validators

neutrino.View.prototype.validateEmail = function (inInput)
{
	var	valid = false;
	
	var	value = inInput.value;
	
	if (value && value.length)
	{
		valid = neutrino.Utils.validateEmailAddress (value);
	}
	
	return valid;
}

neutrino.View.prototype.validateNumber = function (inInput)
{
	var	valid = true;
	
	var	value = inInput.value;
	value = parseInt (value);
	
	if (isNaN (value))
	{
		valid = false;
	}
	else
	{
		var	min = inInput.getAttribute ("min");
		
		if (min && min.length)
		{
			min = parseInt (min);
			
			if (isNaN (min))
			{
				min = null;
			}
		}

		var	max = inInput.getAttribute ("max");
		
		if (max && max.length)
		{
			max = parseInt (max);
			
			if (isNaN (max))
			{
				max = null;
			}
		}
		
		if (typeof (min) == "number")
		{
			valid = value >= min;
		}
		
		if (valid)
		{
			if (typeof (max) == "number")
			{
				valid = value <= max;
			}
		}
	}
	
	return valid;
}

neutrino.View.prototype.validateURL = function (inInput)
{
	var	valid = false;
	
	var	value = inInput.value;
	
	if (value && value.length)
	{
		valid = value.match (new RegExp ("[a-zA-Z]+:")) != null;
	}
	
	return valid;
}

// not an input type validator, this responds to the "pattern" attribute

neutrino.View.prototype.validatePattern = function (inValue, inPattern)
{
	return inValue.match (new RegExp (inPattern)) != null;
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.Page");

neutrino.require ("neutrino.View");
neutrino.require ("neutrino.janx.DelegateHashMap");


/**
 * @constructor
 * @extends {neutrino.View}
 */
neutrino.Page = function ()
{
	neutrino.View.call (this);

	// for refresh decisions -- see application.setPageInternal()
	this.nuIsNew = true;
	this.nuViews = new Object ();
};
neutrino.inherits (neutrino.Page, neutrino.View);
neutrino.exportSymbol('neutrino.Page', neutrino.Page);

// VIEW OVERRIDES

neutrino.Page.prototype.configure = function (inKey, inElement, inPage)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.configure() with key " + inKey);

	neutrino.View.prototype.configure.call (this, inKey, inElement, inPage);
	
	// we're a page, so override the view's janx context with one
	// which defers to application
	this.nuJanxContext = new neutrino.janx.DelegateHashMap (gApplication.nuRootJanxContext);
	this.nuJanxContext.put ("page.key", this.nuKey);
	this.nuJanxContext.put ("view.key", this.nuKey);

	neutrino.DOM.putData (this.nuElement, "page", this);
};

// PUBLIC METHODS

neutrino.Page.prototype.getView = function (inViewKey)
{
	return this.nuViews [inViewKey.toLowerCase ()]; 
};

neutrino.Page.prototype.hideView = function (inViewKey, inTransitionInvisibleClass)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.hideView() with view key " + inViewKey);

	var	lowerCaseViewKey = inViewKey.toLowerCase ();

	var	view = this.nuViews [lowerCaseViewKey];
	
	if (view)
	{
		// is the view transitioning?
		if (view.nuTransitionVisibleClass && view.nuTransitionVisibleClass.length
			&& neutrino.DOM.hasClass (view.nuElement, view.nuTransitionVisibleClass))
		{
			// it's transitioning in -- stop it
			console.log ("hideView() called on view transitioning in (" + view.nuKey + "), cancelling transition");
			
			neutrino.DOM.removeClass (view.nuElement, view.nuTransitionVisibleClass);
			view.nuTransitionVisibleClass = null;
			
			// have to ensure we hide it again, as the default state is visible!
			neutrino.DOM.addClass (view.nuElement, "nu-invisible");
			
			// and refresh its contents
			refreshView = true;
		}
		else
		if (view.nuTransitionInvisibleClass && view.nuTransitionInvisibleClass.length
			&& neutrino.DOM.hasClass (view.nuElement, view.nuTransitionInvisibleClass))
		{
			// it's transitioning out -- let it
			console.log ("view is transitioning out, letting it...");
		}
		else
		if (neutrino.DOM.hasClass (view.nuElement, "nu-invisible"))
		{
      // console.error ("view is already invisible");
		}
		else
		{
			view.onBeforeInvisible ();
	
			view.nuTransitionInvisibleClass = inTransitionInvisibleClass;
	
			if (view.nuTransitionInvisibleClass && view.nuTransitionInvisibleClass.length)
			{
				// incoming class overrides
			}
			else
			{
				// use the default
				view.nuTransitionInvisibleClass = "nu-transition-invisible";
			}
	
			neutrino.DOM.addClass (view.nuElement, view.nuTransitionInvisibleClass);
			neutrino.DOM.removeClass (view.nuElement, "nu-visible");
		}
	}
	else
	{
    console.error ("view not found in page");
	}
};

neutrino.Page.prototype.loadView = function (inViewName, inViewKey, inElement, inFlags)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.loadView() with name/key " + inViewName + "/" + inViewKey);

	var	view = neutrino.Loader.loadView (inViewName, inViewKey, inElement, this, inFlags);
	
	this.addViewEventListeners (view);
	
	var	lowerCaseViewKey = inViewKey.toLowerCase ();
	this.nuViews [lowerCaseViewKey] = view;
	
	return view;
};

neutrino.Page.prototype.showView = function (inViewKey, inParams, inTransitionVisibleClass)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.showView() with view key " + inViewKey);

	var	lowerCaseViewKey = inViewKey.toLowerCase ();

	var	view = this.nuViews [lowerCaseViewKey];

	if (view)
	{
		view.setParams (inParams);
		
		var	refreshView = false;
		
		// is the view transitioning?
		if (view.nuTransitionVisibleClass && view.nuTransitionVisibleClass.length
			&& neutrino.DOM.hasClass (view.nuElement, view.nuTransitionVisibleClass))
		{
			// it's transitioning in -- let it
			console.log ("view is transitioning in, letting it...");
		}
		else
		if (view.nuTransitionInvisibleClass && view.nuTransitionInvisibleClass.length
			&& neutrino.DOM.hasClass (view.nuElement, view.nuTransitionInvisibleClass))
		{
			// it's transitioning out -- stop it
			console.log ("showview() called on view transitioning out (" + view.nuKey + "), cancelling transition");
			
			neutrino.DOM.removeClass (view.nuElement, view.nuTransitionInvisibleClass);
			view.nuTransitionInvisibleClass = null;
			neutrino.DOM.addClass (view.nuElement, "nu-visible");
			
			// and refresh its contents
			refreshView = true;
		}
		else
		if (neutrino.DOM.hasClass (view.nuElement, "nu-invisible"))
		{
			// have to call this BEFORE removing invisible
			// but the tree walker will ignore invisible views, so...
			view.onBeforeVisible (true);

			view.nuTransitionVisibleClass = inTransitionVisibleClass;
	
			if (view.nuTransitionVisibleClass && view.nuTransitionVisibleClass.length)
			{
				// take the override
			}
			else
			{
				// use the default
				view.nuTransitionVisibleClass = "nu-transition-visible";
			}

			neutrino.DOM.addClass (view.nuElement, view.nuTransitionVisibleClass);
			neutrino.DOM.removeClass (view.nuElement, "nu-invisible");
		}
		else
		{
			// view is already visible, so refresh it
			refreshView = true;
		}
		
		if (refreshView)
		{
			view.refresh ();
		}
	}
	else
	{
console.error ("view not found in page");
	}
};

neutrino.Page.prototype.unloadView = function (inViewKey)
{
	var	lowerCaseViewKey = inViewKey.toLowerCase ();

	neutrino.Loader.unloadCSS (lowerCaseViewKey, "view");
	
	delete this.nuViews [lowerCaseViewKey];
};

// PRIVATE METHODS

// note that clicks are *not* done here
neutrino.Page.prototype.addViewEventListeners = function (inView)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.addViewEventListeners() for element id " + inView.nuElement.id);

	if (inView.nuElement)
	{
		var	self = this;

		var	startListener = function (inEvent)
		{
			inView.onAnimationStart (inEvent);
			self.onViewAnimationStart (inEvent, inView);
		};
	
		var	endListener = function (inEvent)
		{
			inView.onAnimationEnd (inEvent);
			self.onViewAnimationEnd (inEvent, inView);
		};

		// SIGH
		var	startEvents = ["webkitAnimationStart", "animationstart", "MSAnimationStart", "oAnimationStart"];
		var	endEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd", "oAnimationEnd"];
		
		for (var i = 0; i < startEvents.length; i++)
		{
			neutrino.DOM.listen (inView.nuElement, startEvents [i], startListener);
		}
		
		for (var i = 0; i < endEvents.length; i++)
		{
			neutrino.DOM.listen (inView.nuElement, endEvents [i], endListener);
		}
		
	}	
};

neutrino.Page.prototype.onViewAnimationStart = function (inEvent, inView)
{
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.onViewAnimationStart() for " + inEvent.animationName);
// if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inEvent.target);

};

neutrino.Page.prototype.onViewAnimationEnd = function (inEvent, inView)
{
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log ("Page.onViewAnimationEnd() for " + inEvent.animationName);
if (gApplication.isLogging (gApplication.kLogViewLifeCycle)) console.log (inEvent.target);

	var	transitionVisibleClass = inView.nuTransitionVisibleClass;
	
	if (! transitionVisibleClass)
	{
		transitionVisibleClass = "nu-transition-visible";
	}
	
	if (inEvent.target == inView.nuElement
	  && neutrino.DOM.hasClass (inView.nuElement, transitionVisibleClass))
	{
		neutrino.DOM.addClass (inView.nuElement, "nu-visible");
		neutrino.DOM.removeClass (inView.nuElement, transitionVisibleClass);

		// this will walk its subtree
		inView.onVisible ();
	}

	var	transitionInvisibleClass = inView.nuTransitionInvisibleClass;
	
	if (! transitionInvisibleClass)
	{
		transitionInvisibleClass = "nu-transition-invisible";
	}
	
	if (inEvent.target == inView.nuElement
	  && neutrino.DOM.hasClass (inView.nuElement, transitionInvisibleClass))
	{
		neutrino.DOM.addClass (inView.nuElement, "nu-invisible");
		neutrino.DOM.removeClass (inView.nuElement, transitionInvisibleClass);

		// this will walk its subtree
		inView.onInvisible ();
	}

};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.SessionTreeWalker");

neutrino.require ("neutrino.TreeWalker");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.SessionTreeWalker = function ()
{
	neutrino.TreeWalker.call (this);
};
neutrino.inherits (neutrino.SessionTreeWalker, neutrino.TreeWalker);
neutrino.exportSymbol('neutrino.SessionTreeWalker', neutrino.SessionTreeWalker);

// TREEWALKER IMPLEMENTATION

// it's necessary for us to walk in page-container
// so we override this and just filter nu-template
neutrino.SessionTreeWalker.prototype.canWalk = function (inElement)
{
	var	walk = true;
	
	if (neutrino.DOM.hasClass (inElement, "nu-template"))
	{
		walk = false;
	}
	
	return walk;
};

neutrino.SessionTreeWalker.prototype.onElement = function (inElement)
{
	var	sessionSpec = inElement.getAttribute ("nu-session");

	if (sessionSpec && sessionSpec.length)
	{
		if (sessionSpec.toLowerCase () == "true")
		{
			if (gApplication.nuSession.active)
			{
				// element requires session, we have a session, so...
				neutrino.DOM.removeClass (inElement, "nu-invisible");
				neutrino.DOM.addClass (inElement, "nu-visible");
				gApplication.nuOnBeforeVisibleWalker.startWalkChildren (inElement, true);
			}
			else
			{
				// element requires session, we do not have a session, so...
				neutrino.DOM.removeClass (inElement, "nu-visible");
				neutrino.DOM.addClass (inElement, "nu-invisible");
			}
		}
		else
		if (sessionSpec.toLowerCase () == "false")
		{
			if (gApplication.nuSession.active)
			{
				// element requires no session, we have a session, so...
				neutrino.DOM.removeClass (inElement, "nu-visible");
				neutrino.DOM.addClass (inElement, "nu-invisible");
			}
			else
			{
				// element requires no session, we do not have a session, so...
				neutrino.DOM.removeClass (inElement, "nu-invisible");
				neutrino.DOM.addClass (inElement, "nu-visible");
				gApplication.nuOnBeforeVisibleWalker.startWalkChildren (inElement, true);
			}
		}
		else
		{
console.error ("bad value for nu-session in element");
console.error (inElement);
		}
	}
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// session.js

neutrino.provide ("neutrino.Session");

neutrino.require ("neutrino.SessionTreeWalker");

// CONSTRUCTOR

/**
 * @constructor
 */
neutrino.Session = function ()
{
	this.active = false;
	this.info = null;
	this.walker = new neutrino.SessionTreeWalker ();
};
neutrino.exportSymbol('neutrino.Session', neutrino.Session);

// METHODS

neutrino.Session.prototype.create = function (inInfo)
{
console.log ("Session.create()");

	this.active = true;

	this.refreshData (inInfo);

	// session transition, rewalk the tree
	this.walker.startWalk (document.querySelector ("body"));
};

neutrino.Session.prototype.destroy = function ()
{
console.log ("Session.destroy()");
	
	this.active = false;
	this.info = null;

	gApplication.nuRootJanxContext.remove ("session");
	
	// session transition, rewalk the tree
	this.walker.startWalk (document.querySelector ("body"));
};

neutrino.Session.prototype.refreshData = function (inInfo)
{
console.log ("Session.refresh()");

	this.info = inInfo;

	// session is always available from root janx context
	gApplication.nuRootJanxContext.put ("session", gApplication.nuSession.info);
	
	// note, no session transition, so don't rewalk
};


/**
*
* @license
* Copyright © 2011, 2012, Subatomic Systems, Inc.	All rights reserved.
*
**/

// neutrino.Cache.js

neutrino.provide ("neutrino.Cache");

/**
 * @constructor
 */
neutrino.Cache = function (inWindow)
{
if (gApplication.isLogging (gApplication.kLogCache)) console.log ("Cache()");

  this.cache = new Object ();
  this.lifeTimes = new Object ();
  this.accessTimes = new Object ();
  
  // for callbacks
  var self = this;
  
  // gc once a minute
  this.purgeTask = setInterval
  (
    function ()
    {
      self.garbageCollect ();
    },
    60000
  );
  
};
neutrino.exportSymbol('neutrino.Cache', neutrino.Cache);

neutrino.Cache.prototype.get = function (inKey)
{
  var value = this.cache [inKey];
  
  if (value)
  {
    this.accessTimes [inKey] = new Date ().getTime ();
  }

  return value;
};

neutrino.Cache.prototype.put = function (inKey, inValue, inLifeTime)
{
  this.cache [inKey] = inValue;
  
  if (! inLifeTime)
  {
    // default lifetime = 30s
    inLifeTime = 30000;
  }

  if (gApplication.isLogging (gApplication.kLogCache)) console.log ("Cache.put() with key " + inKey + " and lifetime " + inLifeTime);
  
  this.lifeTimes [inKey] = inLifeTime;
  this.accessTimes [inKey] = new Date ().getTime ();
};

neutrino.Cache.prototype.garbageCollect = function ()
{
  var collected = 0;
  
  var now = new Date ().getTime ();
  
  for (var key in this.cache)
  {
    var lifeTime = this.lifeTimes [key];
    
    if (typeof (lifeTime) == "number")
    {
      // OK we have a good "key", can proceed
      
      var accessTime = this.accessTimes [key];
      
      if ((now - accessTime) > lifeTime)
      {
        delete this.cache [key];
        delete this.lifeTimes [key];
        delete this.accessTimes [key];
        
        collected++;
      }
    }
  }
  
  if (collected > 0)
  {
    if (gApplication.isLogging (gApplication.kLogCache)) console.log ("Cache garbage collected " + collected + " entries");
  }
};

/**
*
* @license
* Copyright © 2012, Subatomic Systems, Inc.	All rights reserved.
*
**/

// urlcache.js
// provides a persistent

neutrino.provide ("neutrino.URLCache");


// if anything goes wrong here, throw here, the database handle is useless
neutrino.URLCache = function ()
{
if (gApplication.isLogging (gApplication.kLogCache)) console.log ("URLCache()");

	// may as well ask for the maximum space under iOS
	this.database = openDatabase ("neutrino", "1.0", "Neutrino Persistence", 5 * 1024 * 1024);
	
  // in WebDB world, even creating tables is asynchronous - SIGH
  if (this.database)
  {
  	// for callbacks
		var	self = this;
	
  	this.database.transaction
  	(
  		function (inTransaction)
  		{
				inTransaction.executeSql
				(
					"create table if not exists assets "
						+ "("
						+ "id integer primary key autoincrement, "
						+ "url text, "
						+ "content text, "
						+ "last_use_timestamp integer, "
						+ "create_timestamp integer not null, "
						+ "constraint unique_url unique (url) "
						+ ")",
					[],
  				function (inTransaction, inResultSet)
  				{
  				},
  				function (inTransaction, inError)
  				{
  					throw inError;
  				}
  			);
  		}
  	);
  }
  else
  {
  	var	error = new Object ();
  	error.message = "Could not open database.";
  	throw error;
  }
};

// note the success callback gets just the content
neutrino.URLCache.prototype.get = function (inURL, inSuccessCallback, inFailureCallback)
{
	this.database.transaction
	(
		function (inTransaction)
		{
			var	parameters = 
			[
				inURL
			];
			
			inTransaction.executeSql
			(
				"select * from assets where url = ?",
				parameters,
				function (inTransaction, inResultSet)
				{
					var	content = null;
					
					if (inResultSet.rows && inResultSet.rows.length)
					{
						content = inResultSet.rows.item (0).content;
					}
					
					inSuccessCallback.call (this, content);
				},
				function (inTransaction, inError)
				{
					if (inFailureCallback)
					{
						inFailureCallback.call (this, inError);
					}
				}
			);
		}
	);
};

// note that out-of-space etc type errors are handled by the caller
// not by this method, as we can't determine policy here
// and policy is not necessarily cache-wide
neutrino.URLCache.prototype.put = function (inURL, inContent, inSuccessCallback, inFailureCallback)
{
	this.database.transaction
	(
		function (inTransaction)
		{
			var	sql = "insert into assets (url, content, create_timestamp) values (?, ?, ?)";
			
			var	parameters = 
			[
				inURL,
				inContent,
				new Date ().getTime ()
			];
			
			inTransaction.executeSql
			(
				sql,
				parameters,
				inSuccessCallback,
				function (inTransaction, inError)
				{
					if (inFailureCallback)
					{
						inFailureCallback.call (this, inError);
					}
				}
			);
		}
	);
};

neutrino.URLCache.prototype.remove = function (inURL, inSuccessCallback, inFailureCallback)
{
	this.database.transaction
	(
		function (inTransaction)
		{
			var	sql = "delete from assets where url = ?";
			
			var	parameters = 
			[
				inURL
			];
			
			inTransaction.executeSql
			(
				sql,
				parameters,
				inSuccessCallback,
				function (inTransaction, inError)
				{
					if (inFailureCallback)
					{
						inFailureCallback.call (this, inError);
					}
				}
			);
		}
	);
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.	All rights reserved.
*
**/

// analytics.js
// dummy & default implementations of the analytics interface

neutrino.provide ("neutrino.Analytics");
neutrino.provide ("neutrino.DummyAnalytics");

/**
 * @constructor
 */
neutrino.Analytics = function (inAppName)
{
	this.batch = new Array ();
	this.batchSize = 10;
	
	// if the upload error count reaches the maximum
	// then basically the queue shuts down
	this.errorCount = 0;
	this.maxErrorCount = 5;
	
	this.appName = inAppName;
	
	// determine the app instance ID from the name and a timestamp
	// there is no way of making this really unique, btw
	var	now = new Date ();
	
	// hopefully this is pretty unique :-)
	this.appInstanceID = inAppName + "_" + now.getTime () + "_" + Math.floor (Math.random () * 100);
	
	this.report ("analytics", null, "startup", this.appInstanceID);
};
neutrino.exportSymbol ("neutrino.Analytics", neutrino.Analytics);

neutrino.Analytics.prototype.checkBatch = function ()
{
	if (this.batch.length >= this.batchSize)
	{
		this.flushBatch ();
	}
};

neutrino.Analytics.prototype.flushBatch = function ()
{
	if (gApplication.isLogging (gApplication.kLogAnalytics)) console.log ("Analytics.flushBatch()");

	var	query = "";
	
	for (var i = 0; i < this.batch.length; i++)
	{
		var	event = this.batch [i];
		
		for (var property in event)
		{
			if (event.hasOwnProperty (property))
			{
				var	value = event [property];
				
				if (typeof (value) == "string")
				{
					if (value && value.length)
					{
						// TODO should we escape here?
						query += property + "_" + i + "=" + event [property] + "&";
					}
				}
				else
				if (typeof (value) == "number")
				{
					query += property + "_" + i + "=" + event [property] + "&";
				}
			}
		}
	}
	
	if (gApplication.isLogging (gApplication.kLogAnalytics)) console.log (query);
	
	var	self = this;
	
	var	request =
	{
		url: "/analytics/report",
		data: query,
		dataType: "json",
		async: true,
		type: "POST",
		success: function (inData, inTextStatus, inXHR)
		{
			if (gApplication.isLogging (gApplication.kLogAnalytics)) console.log ("analytics report successful");
			
			self.errorCount = 0;
			self.batch = new Array ();
		},
		error: function (inXHR, inTextStatus, inError)
		{
			console.error ("analytics report error");
			console.error (inTextStatus);
			
			self.errorCount++;
			
			if (self.errorCount >= self.maxErrorCount)
			{
				// reporting is hosed, shut down
				if (gApplication.isLogging (gApplication.kLogAnalytics))
				{
					console.error ("max analytics upload error count reached, shutting down");
				}
				
				self.batch = new Array ();
			}
		}
	};
	
	neutrino.Utils.getURLContents (request);

};

neutrino.Analytics.prototype.report = function (inPageKey, inViewKey, inEventName, inDetail)
{
	if (this.errorCount < this.maxErrorCount)
	{
		if (gApplication.isLogging (gApplication.kLogAnalytics))
			console.log ("Analytics.report() " + inPageKey + "/" + inViewKey + "/" + inEventName + "/" + inDetail);
	
		var	event = new Object ();
		
		// fyi, these property names are the http post parameter name stems
		event.user_agent = navigator.userAgent;
		event.app_name = this.appName;
		event.app_instance_id = this.appInstanceID;
		event.page_key = inPageKey;
		event.view_key = inViewKey;
		event.event_name = inEventName;
		event.event_detail = inDetail;
		
		this.batch.push (event);
		
		this.checkBatch ();
	}
	else
	{
		// if we log here, then we will log a *lot*
	}
};

neutrino.Analytics.prototype.setBatchSize = function (inBatchSize)
{
	this.batchSize = inBatchSize;
	
	this.checkBatch ();
};

// DummyAnalytics
// the analytics handler installed by default, does nothing

/**
 * @constructor
 */
neutrino.DummyAnalytics = function (inAppName)
{
	if (gApplication.isLogging (gApplication.kLogAnalytics)) console.log ("DummyAnalytics() with app name " + inAppName);
};
neutrino.exportSymbol ("neutrino.DummyAnalytics", neutrino.DummyAnalytics);

neutrino.DummyAnalytics.prototype.report = function (inPageKey, inViewKey, inEventName, inDetail)
{
	if (gApplication.isLogging (gApplication.kLogAnalytics))
		console.log ("DummyAnalytics.report() " + inPageKey + "/" + inViewKey + "/" + inEventName + "/" + inDetail);
};

neutrino.DummyAnalytics.prototype.setBatchSize = function (inBatchSize)
{
};

// GoogleAnalytics


/*

GA init code, put in index.html etc

<script type="text/javascript">

	var	account = 'UA-XXXXXXXX-X';
	
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', testAccount]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>


*/

// assume that the ga stuff has been initialised
// and that _setAccount has been called
// and that _trackPageview has been called for the root page
neutrino.GoogleAnalytics = function ()
{
}
neutrino.inherits (neutrino.GoogleAnalytics, neutrino.Analytics);

neutrino.GoogleAnalytics.prototype.setBatchSize = function (inBatchSize)
{
	// we allow GA to manage its queue
};

neutrino.GoogleAnalytics.prototype.report = function (inPageKey, inViewKey, inEventName, inDetail)
{
	// for now only report actual page visible transitions
	// maybe we will do more in future!
	if (inEventName == "onvisible" && inViewKey == null)
	{
		console.log ("GoogleAnalytics.report() page url: " + document.location.href);
		
		if (typeof (_gaq) == "object")
		{
			// log with a url override
			// as GA might well decide that Neutrino apps are always on the index page (sigh)
			_gaq.push (["_trackPageview", document.location.href]);
		}
		else
		{
			if (! this.reportedError)
			{
				console.error ("GA unavailable, can't report");
				this.reportedError = true;
			}
		}
	}
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.	All rights reserved.
*
**/

// neutrino.Application.js

neutrino.provide ("neutrino.Application");

neutrino.require ("neutrino.AssetLoader");
neutrino.require ("neutrino.Cache");
neutrino.require ("neutrino.DummyAnalytics");
neutrino.require ("neutrino.LoadTreeWalker");
neutrino.require ("neutrino.Loader");
neutrino.require ("neutrino.OnBeforeVisibleTreeWalker");
neutrino.require ("neutrino.OnVisibleTreeWalker");
neutrino.require ("neutrino.Page");
neutrino.require ("neutrino.Session");
neutrino.require ("neutrino.SessionTreeWalker");
neutrino.require ("neutrino.Utils");
neutrino.require ("neutrino.View");
neutrino.require ("neutrino.janx.AsyncTaglet");
neutrino.require ("neutrino.janx.DelegateHashMap");
neutrino.require ("neutrino.janx.ChangeCaseTaglet");
neutrino.require ("neutrino.janx.CommentTaglet");
neutrino.require ("neutrino.janx.ConvertTaglet");
neutrino.require ("neutrino.janx.CSSTaglet");
neutrino.require ("neutrino.janx.DateTaglet");
neutrino.require ("neutrino.janx.DistanceTaglet");
neutrino.require ("neutrino.janx.GetTaglet");
neutrino.require ("neutrino.janx.HTMLTaglet");
neutrino.require ("neutrino.janx.IfNotTaglet");
neutrino.require ("neutrino.janx.IfTaglet");
neutrino.require ("neutrino.janx.IsolatorTaglet");
neutrino.require ("neutrino.janx.JSTaglet");
neutrino.require ("neutrino.janx.JSONTaglet");
neutrino.require ("neutrino.janx.Janx");
neutrino.require ("neutrino.janx.ListTaglet");
neutrino.require ("neutrino.janx.LogTaglet");
neutrino.require ("neutrino.janx.MapTaglet");
neutrino.require ("neutrino.janx.NumberFormatTaglet");
neutrino.require ("neutrino.janx.ReplaceTaglet");
neutrino.require ("neutrino.janx.SetTaglet");
neutrino.require ("neutrino.janx.TagletManager");
neutrino.require ("neutrino.mobile.AndroidInterface");
neutrino.require ("neutrino.mobile.DummyPhoneInterface");
neutrino.require ("neutrino.mobile.IPhoneInterface");


/**
 * @constructor
 */
neutrino.Application = function (inWindow)
{
  // so that code called from the constructor can reference gApplication
  gApplication = this;
  
	this.nuAppName = document.querySelector ("body").getAttribute ("nu-app");

	if (this.nuAppName && this.nuAppName.length)
	{
		// ok then
	}
	else
	{
		this.nuAppName = "Neutrino";
	}
	
	// instance member setup
	this.nuDevMode = true;
	this.nuServerHost = "inserthosthere.com:80";
	
	this.nuParams = new Object ();
	this.nuTaglets = new Object ();

	this.nuRootJanxContext = new neutrino.janx.DelegateHashMap ();
	this.nuPages = new Object ();
	this.nuMessages = new Object ();
	this.nuCache = new neutrino.Cache ();
	this.nuAnalytics = new neutrino.DummyAnalytics (this.nuAppName);
	
	this.nuIsOnline = true;
	this.nuCheckOnline = false;
	this.nuCheckOnlineTask = null;
	this.nuCheckOnlinePeriod = 0;
	this.nuCheckOnlineSequence = 0;
	
	this.setupParameters ();
	this.setupLogging ();
	this.setUserAgentFlags ();
	
	// initialise our global Janx instance
	this.initialiseJanx ();
	
	// set up the window/page attached to <body>
	// the parent of any orphan views, outside nu-page-container
	// has to be set up before the initial tree-walk
	if (inWindow)
	{
		this.nuWindow = inWindow;
	}
	else
	{
		this.nuWindow = new neutrino.Page ();
	}

	// default the current page, too
	this.nuPage = this.nuWindow;
	
	// our many and varied walkers
	this.nuLoadWalker = this.createLoadTreeWalker ();
	this.nuOnBeforeVisibleWalker = this.createOnBeforeVisibleTreeWalker ();
	this.nuOnVisibleWalker = this.createOnVisibleTreeWalker ();

	this.nuSessionWalker = new neutrino.SessionTreeWalker ();
	
	this.nuSession = new neutrino.Session ();

  var self = this;
  
  window.addEventListener
  (
    "hashchange",
    function (inEvent)
    {
      if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("hashchange event fires!");
      if (gApplication.isLogging (gApplication.kLogApplication)) console.log (document.location.hash);
      
      self.setInitialPage ();
			
			inEvent.preventDefault ();
			inEvent.stopPropagation ();
    },
    false
  );

};
neutrino.exportSymbol('neutrino.Application', neutrino.Application);


// PUBLIC METHODS

neutrino.Application.prototype.preventMobileScrolling = function ()
{
	var	body = document.querySelector ("body");

	// prevent the default swipe/scroll behaviour
	body.addEventListener
	(
		"touchmove",
		function (inEvent)
		{
			inEvent.preventDefault ();
		}
	);
	
}

neutrino.Application.prototype.start = function ()
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.start()");

	this.makeContainers ();

	var	body = document.querySelector ("body");
	
	// associate a page class with the body tag
	// so there is always a default page
	this.nuWindow.configure ("window", body, null);
	
	this.preloadAssets ();	
	this.preloadPages ();
	this.processCSS ();
	
	this.nuLoadWalker.onElement (body);
	this.walkChildren (body, true, true);

  this.setInitialPage ();
};
neutrino.exportSymbol('neutrino.Application.prototype.start', neutrino.Application.prototype.start);

neutrino.Application.prototype.callMethodOnEnclosingView = function (inMethod, inElement, inEvent, inArgument, inParams)
{
// if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("callMethodOnEnclosingView() with " + inMethod);

	// propagate up until we find a view or page to handle the click
	for (var element = inElement; element; element = element.parentElement)
	{
// if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("checking for " + inMethod + " in ");
// if (gApplication.isLogging (gApplication.kLogApplication)) console.log (element);

		var	view = neutrino.DOM.getData (element, "view");

		if (view)
		{
			if (view [inMethod] && typeof (view [inMethod]) == "function")
			{
				view.setParams (inParams);
				
				view [inMethod].call (view, inArgument);

				view.reportAnalyticsEvent ("onclick", inMethod);
				
				break;
			}
			else
			{
				// yes actually DO keep going to enclosing views/pages/app/etc
			}
		}
	}

	if (element == null)
	{
		// try the application?
		if (this [inMethod] && (typeof (this [inMethod]) == "function"))
		{
			this.setParams (inParams);
			
			this [inMethod].call (this, inArgument);
			
			this.reportAnalyticsEvent ("application", null, "onclick", inMethod);
		}
		else
		{
console.error ("exhausted view tree & application looking for method " + inMethod);
		}
	}
};

neutrino.Application.prototype.createLoadTreeWalker = function ()
{
	return new neutrino.LoadTreeWalker ();
};

neutrino.Application.prototype.createOnBeforeVisibleTreeWalker = function ()
{
	return new neutrino.OnBeforeVisibleTreeWalker ();
};

neutrino.Application.prototype.createOnVisibleTreeWalker = function ()
{
	return new neutrino.OnVisibleTreeWalker ();
};

neutrino.Application.prototype.createOnBeforeInvisibleTreeWalker = function ()
{
	return new neutrino.OnBeforeInvisibleTreeWalker ();
};

neutrino.Application.prototype.createOnInvisibleTreeWalker = function ()
{
	return new neutrino.OnInvisibleTreeWalker ();
};

neutrino.Application.prototype.createView = function ()
{
	return new neutrino.View ();
};

neutrino.Application.prototype.generateCacheToken = function ()
{
	if (this.nuDevMode)
	{
		return "" + new Date ().getTime ();
	}
	else
	{
		return "";
	}
};

neutrino.Application.prototype.getMessage = function (inKey, inContext)
{
	var	message = this.nuMessages [inKey];
	
	if (message && message.length)
	{
		if (inContext && typeof (inContext == "object"))
		{
			for (var key in inContext)
			{
				var	value = inContext [key];
				
				if (typeof (value) == "number" || typeof (value) == "string")
				{
					value = "" + value;
				}
				
				if (typeof (value) == "string")
				{
					message = message.replace ("$" + key + ";", value);
				}
			}
		}
	}
	else
	{
		message = "no message for key: " + inKey;
	}
	
	return message;
};

neutrino.Application.prototype.getPage = function (inKey)
{
	return this.nuPages [inKey];
};

neutrino.Application.prototype.setPage = function (inPageKey, inTransitionInvisibleClass, inTransitionVisibleClass, inParams)
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.setPage() with key " + inPageKey);

  var setHash = true;

	if (gApplication.nuPage)
	{
		// ok, so if we set the hash to the same as it was before, we won't get a hashchange event
		// so see whether the hash is the same...
		var	currentHash = gApplication.nuPage.nuKey + "," + neutrino.Utils.unparseParams (gApplication.nuPage.nuParams);
		var	newHash = inPageKey + "," + neutrino.Utils.unparseParams (inParams);
		
		// HACK is the decasing necessary?
		// not sure whether the browser will do a case insensitive compare for hashchange firing purposes
		if (currentHash.toLowerCase () == newHash.toLowerCase ())
		{
			setHash = false;
		}
	}
	
  if (setHash)
	{
		var page = this.nuPages [inPageKey];

		this.nuPageTransitionInvisibleClass = inTransitionInvisibleClass;
		this.nuPageTransitionVisibleClass = inTransitionVisibleClass;

if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("params are");
if (gApplication.isLogging (gApplication.kLogApplication)) console.log (inParams);

		// causes hashchange event to fire and setPageInternal() to be called
		document.location.hash = newHash;
	}
	else
  {
  	// refresh on the current page
  	// the hash won't change, so we won't get the event
  	// so bypass the hashchange mechanism
  	this.setPageInternal (inPageKey, inTransitionInvisibleClass, inTransitionVisibleClass, inParams);
  }
	
  return true;
};
neutrino.exportSymbol('neutrino.Application.prototype.setPage', neutrino.Application.prototype.setPage);

neutrino.Application.prototype.unloadPage = function (inPageKey)
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.unloadPage() with page key " + inPageKey);

	var	page = this.nuPages [inPageKey];
	
	if (page)
	{
		if (this.nuPage == page)
		{
console.error ("attempt to unload current page, rejecting");
		}
		else
		{
			// phasers to kill
			page.nuElement.parentNode.removeChild (page.nuElement);
			delete this.nuPages [inPageKey];
		}
	}
	else
	{
console.error ("no page found with key " + inPageKey);
	}
};

neutrino.Application.prototype.getView = function (inViewKey)
{
	var	view = this.nuPage.getView (inViewKey);
	
	if (! view)
	{
		view = this.nuWindow.getView (inViewKey);
	}
	
	return view;
};

neutrino.Application.prototype.showView = function (inViewKey, inParams, inTransitionVisibleClass)
{
  var view = this.nuPage.getView (inViewKey);
  
  if (view)
  {
	  this.nuPage.showView (inViewKey, inParams, inTransitionVisibleClass);
  }
  else
  {
    view = this.nuWindow.getView (inViewKey);

    if (view)
    {
			this.nuWindow.showView (inViewKey, inParams, inTransitionVisibleClass);
    }
    else
    {
    	console.error ("could not show view with key: " + inViewKey);
    }
  }
	
	return view;
};

neutrino.Application.prototype.hideView = function (inViewKey, inTransitionInvisibleClass)
{
  var view = this.nuPage.getView (inViewKey);
  
  if (view)
  {
	  this.nuPage.hideView (inViewKey, inTransitionInvisibleClass);
  }
  else
  {
    view = this.nuWindow.getView (inViewKey);

    if (view)
    {
      this.nuWindow.hideView (inViewKey, inTransitionInvisibleClass);
    }
    else
    {
    	console.error ("could not hide view with key: " + inViewKey);
    }
  }

	return view;
};

neutrino.Application.prototype.toggleView = function (inViewKey, inParams, inTransitionVisibleClass, inTransitionInvisibleClass)
{
	var	success = false;
	
  var view = this.getView (inViewKey);
  
  if (view)
  {
  	if (neutrino.DOM.hasClass (view.nuElement, "nu-invisible"))
  	{
  		success = this.showView (inViewKey, inParams, inTransitionVisibleClass);
  	}
  	else
  	{
  		success = this.hideView (inViewKey, inTransitionInvisibleClass);
  	}
  }
  
  return success;
};

neutrino.Application.prototype.showProgressView = function ()
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.showProgressView()");

	var	body = document.querySelector ("body");
	
	if (body)
	{
		var	progressViewKey = body.getAttribute ("nu-progress-view");
		
		if (progressViewKey && progressViewKey.length)
		{
			var	progressView = this.getView (progressViewKey);
			
			if (progressView)
			{
				// if it's already visible, don't refresh
				if (!progressView.isVisible ())
				{
					this.showView (progressViewKey);
				}
			}
			else
			{
				console.error ("can not find declared nu-progress-view " + progressViewKey);
			}
		}
	}
};

neutrino.Application.prototype.hideProgressView = function ()
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.hideProgressView()");

	var	body = document.querySelector ("body");
	
	if (body)
	{
		var	progressViewKey = body.getAttribute ("nu-progress-view");
		
		if (progressViewKey && progressViewKey.length)
		{
			var	progressView = this.getView (progressViewKey);
			
			if (progressView)
			{
				if (progressView.isVisible ())
				{
					this.hideView (progressViewKey);
				}
			}
			else
			{
				console.error ("can not find declared nu-progress-view " + progressViewKey);
			}
		}
	}
};

neutrino.Application.prototype.makePhoneInterface = function ()
{
	if (this.nuBrowser.isIPhone || this.nuBrowser.isIPad)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.makePhoneInterface() making iPhone interface");

		gPhoneInterface = new neutrino.mobile.IPhoneInterface ();
	}
	else
	if (this.nuBrowser.isAndroid)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.makePhoneInterface() making Android interface");

		gPhoneInterface = new neutrino.mobile.AndroidInterface ();
	}
	else
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.makePhoneInterface() making dummy interface");

		gPhoneInterface = new neutrino.mobile.DummyPhoneInterface ();
	}
};

// all analytics reporting comes through here
// unless overridden in views/pages, etc
neutrino.Application.prototype.reportAnalyticsEvent = function (inPageKey, inViewKey, inEventName, inDetail)
{
	if (this.nuAnalytics)
	{
		this.nuAnalytics.report (inPageKey, inViewKey, inEventName, inDetail);
	}
};

neutrino.Application.prototype.setCheckOnline = function (inEnable, inPeriod)
{
	var	disable = false;
	var	enable = inEnable;
	
	if (inEnable)
	{
		if (this.nuCheckOnline)
		{
			// allow a restart with a different period
			disable = this.nuCheckOnlinePeriod != inPeriod;
		}
	}
	else
	{
		if (this.nuCheckOnline)
		{
			disable = true;
		}
	}

	if (disable)
	{
		if (this.nuCheckOnlineTask)
		{
			clearInterval (this.nuCheckOnlineTask);
			this.nuCheckOnlineTask = null;
		}
	}
	
	if (enable)
	{
		if (inPeriod > 0)
		{
			this.nuCheckOnlinePeriod = inPeriod;
		}
		else
		{
			// default to a minute
			this.nuCheckOnlinePeriod = 60000;
		}
		
		// for callbacks
		var	self = this;
		
		this.nuCheckOnlineTask = setInterval
		(
			function ()
			{
				if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("checking whether we're online...");
					
				var	image = new Image ();
				
				image.onload = function ()
				{
					if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("browser is online");

					gApplication.nuIsOnline = true;
					gApplication.nuRootJanxContext.put ("application.nuIsOnline", true);
				};
				
				image.onerror = function ()
				{
					if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("browser is offline");

					gApplication.nuIsOnline = false;
					gApplication.nuRootJanxContext.put ("application.nuIsOnline", false);
				};
				
				image.src = "neutrino/assets/online.gif?cachebuster=" + gApplication.checkOnlineSequence;
				gApplication.checkOnlineSequence++;

				if (gApplication.isLogging (gApplication.kLogApplication)) console.log (image.src);
			},
			this.nuCheckOnlinePeriod
		);
	}
};

// PRIVATE METHODS

neutrino.Application.prototype.setInitialPage = function ()
{
  var pageKey = null;
  
  var pageParams = null;
  
  if (document.location.hash && document.location.hash.length)
  {
    var hash = document.location.hash;
    
    // seems like "hash" comes complete with a... hash, sigh
    if (hash.charAt (0) == '#')
    {
      hash = hash.substring (1);
    }
    
    var hashElements = hash.split (",");

    if (hashElements.length > 0 && hashElements [0].length > 0)
    {
      pageKey = hashElements [0];
      
      if (hashElements.length > 1)
      {
        pageParams = neutrino.Utils.parseParams (unescape (hashElements [1]));
      }
    }
  }
  
  var body = document.querySelector ("body");
  
  if (pageKey == null)
  {
    pageKey = body.getAttribute ("nu-start-page");
    
    if (pageKey && pageKey.length)
    {
      if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("found nu-start-page of " + pageKey);
    }
  }

  var setPageDelay = body.getAttribute ("nu-start-page-delay");
  
  if (setPageDelay && setPageDelay.length)
  {
    if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("found nu-start-page-delay of " + setPageDelay);

    setPageDelay = parseInt (setPageDelay);
    
    if (setPageDelay == 0 || isNaN (setPageDelay))
    {
      setPageDelay = 1;
    }
  }
  else
  {
    setPageDelay = 1;
  }
  
  // if there's still no page key, don't set a page
  if (pageKey && pageKey.length)
  {
    // for callbacks
    var self = this;
    
    setTimeout
    (
      function ()
      {
        self.setPageInternal (pageKey, 
          self.nuPageTransitionInvisibleClass, self.nuPageTransitionVisibleClass, pageParams);

        self.nuPageTransitionInvisibleClass = undefined;
        self.nuPageTransitionVisibleClass = undefined;
      },
      setPageDelay
    );
  }
};
neutrino.exportSymbol('neutrino.Application.prototype.setInitialPage', neutrino.Application.prototype.setInitialPage);

neutrino.Application.prototype.addPageEventListeners = function (inPage)
{
	// for callbacks
	var	self = this;
	
	var	startListener = function (inEvent)
	{
		var	page = neutrino.DOM.getData (inEvent.target, "page");
		
		if (page)
		{
			// let the page know
			page.onAnimationStart (inEvent);
			
			// and do our stuff
			self.onPageAnimationStart (inEvent);
		}
		else
		{
			// presumably a view started animating
		}
	};

	var	endListener = function (inEvent)
	{
		var	page = neutrino.DOM.getData (inEvent.target, "page");
		
		if (page)
		{
			// let the page know
			page.onAnimationEnd (inEvent);
			
			// and do our stuff
			self.onPageAnimationEnd (inEvent);
		}
		else
		{
			// presumably a view finished animating
		}
	};
	
	// SIGH
  var	startEvents = ["webkitAnimationStart", "animationstart", "MSAnimationStart", "oAnimationStart"];
  var	endEvents = ["webkitAnimationEnd", "animationend", "MSAnimationEnd", "oAnimationEnd"];
	
	for (var i = 0; i < startEvents.length; i++)
	{
		neutrino.DOM.listen (inPage.nuElement, startEvents [i], startListener);
	}
	
	for (var i = 0; i < endEvents.length; i++)
	{
		neutrino.DOM.listen (inPage.nuElement, endEvents [i], endListener);
	}
	
};

neutrino.Application.prototype.initialiseJanx = function ()
{
// if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.initialiseJanx()");

	// note the Js taglet manager takes instances, not class names
	this.nuTaglets = new Object ();

	// new syntax
	this.nuTaglets ["nu-async"] = new neutrino.janx.AsyncTaglet ();
	this.nuTaglets ["nu-comment"] = new neutrino.janx.CommentTaglet ();
	this.nuTaglets ["nu-convert"] = new neutrino.janx.ConvertTaglet ();
	this.nuTaglets ["nu-css"] = new neutrino.janx.CSSTaglet ();
	this.nuTaglets ["nu-date"] = new neutrino.janx.DateTaglet ();
	this.nuTaglets ["nu-distance"] = new neutrino.janx.DistanceTaglet ();
	this.nuTaglets ["nu-element"] = new neutrino.janx.ElementTaglet ();
	this.nuTaglets ["nu-html"] = new neutrino.janx.HTMLTaglet ();
	this.nuTaglets ["nu-if"] = new neutrino.janx.IfTaglet ();
	this.nuTaglets ["nu-ifnot"] = new neutrino.janx.IfNotTaglet ();
	this.nuTaglets ["nu-img"] = new neutrino.janx.IsolatorTaglet ();
	this.nuTaglets ["nu-js"] = new neutrino.janx.JSTaglet ();
	this.nuTaglets ["nu-json"] = new neutrino.janx.JSONTaglet ();
	this.nuTaglets ["nu-xml"] = new neutrino.janx.XMLTaglet ();
	this.nuTaglets ["nu-list"] = new neutrino.janx.ListTaglet ();
	this.nuTaglets ["nu-link"] = new neutrino.janx.LinkTaglet ();
	this.nuTaglets ["nu-log"] = new neutrino.janx.LogTaglet ();
	this.nuTaglets ["nu-map"] = new neutrino.janx.MapTaglet ();
	this.nuTaglets ["nu-numberformat"] = new neutrino.janx.NumberFormatTaglet ();
	this.nuTaglets ["nu-numbers"] = new neutrino.janx.NumbersTaglet ();
	this.nuTaglets ["nu-option"] = new neutrino.janx.IsolatorTaglet ();
	this.nuTaglets ["nu-query"] = new neutrino.janx.QueryTaglet ();
	this.nuTaglets ["nu-replace"] = new neutrino.janx.ReplaceTaglet ();
	this.nuTaglets ["nu-select"] = new neutrino.janx.IsolatorTaglet ();
	this.nuTaglets ["nu-sync"] = new neutrino.janx.SyncTaglet ();
	this.nuTaglets ["nu-timeago"] = new neutrino.janx.TimeAgoTaglet ();
	this.nuTaglets ["nu-get"] = new neutrino.janx.GetTaglet ();
	this.nuTaglets ["nu-set"] = new neutrino.janx.SetTaglet ();
	this.nuTaglets ["nu-changecase"] = new neutrino.janx.ChangeCaseTaglet ();
	this.nuTaglets ["nu-uppercase"] = new neutrino.janx.ChangeCaseTaglet ();
	this.nuTaglets ["nu-lowercase"] = new neutrino.janx.ChangeCaseTaglet ();
	this.nuTaglets ["nu-capitalcase"] = new neutrino.janx.ChangeCaseTaglet ();
		
	// deprecated syntax
	this.nuTaglets ["nu:async"] = new neutrino.janx.AsyncTaglet ();
	this.nuTaglets ["nu:comment"] = new neutrino.janx.CommentTaglet ();
	this.nuTaglets ["nu:convert"] = new neutrino.janx.ConvertTaglet ();
	this.nuTaglets ["nu:css"] = new neutrino.janx.CSSTaglet ();
	this.nuTaglets ["nu:date"] = new neutrino.janx.DateTaglet ();
	this.nuTaglets ["nu:distance"] = new neutrino.janx.DistanceTaglet ();
	this.nuTaglets ["nu:element"] = new neutrino.janx.ElementTaglet ();
	this.nuTaglets ["nu:html"] = new neutrino.janx.HTMLTaglet ();
	this.nuTaglets ["nu:if"] = new neutrino.janx.IfTaglet ();
	this.nuTaglets ["nu:ifnot"] = new neutrino.janx.IfNotTaglet ();
	this.nuTaglets ["nu:img"] = new neutrino.janx.IsolatorTaglet ();
	this.nuTaglets ["nu:js"] = new neutrino.janx.JSTaglet ();
	this.nuTaglets ["nu:json"] = new neutrino.janx.JSONTaglet ();
	this.nuTaglets ["nu:xml"] = new neutrino.janx.XMLTaglet ();
	this.nuTaglets ["nu:list"] = new neutrino.janx.ListTaglet ();
	this.nuTaglets ["nu:link"] = new neutrino.janx.LinkTaglet ();
	this.nuTaglets ["nu:log"] = new neutrino.janx.LogTaglet ();
	this.nuTaglets ["nu:map"] = new neutrino.janx.MapTaglet ();
	this.nuTaglets ["nu:numberformat"] = new neutrino.janx.NumberFormatTaglet ();
	this.nuTaglets ["nu:numbers"] = new neutrino.janx.NumbersTaglet ();
	this.nuTaglets ["nu:option"] = new neutrino.janx.IsolatorTaglet ();
	this.nuTaglets ["nu:query"] = new neutrino.janx.QueryTaglet ();
	this.nuTaglets ["nu:replace"] = new neutrino.janx.ReplaceTaglet ();
	this.nuTaglets ["nu:select"] = new neutrino.janx.IsolatorTaglet ();
	this.nuTaglets ["nu:sync"] = new neutrino.janx.SyncTaglet ();
	this.nuTaglets ["nu:timeago"] = new neutrino.janx.TimeAgoTaglet ();
	this.nuTaglets ["nu:get"] = new neutrino.janx.GetTaglet ();
	this.nuTaglets ["nu:set"] = new neutrino.janx.SetTaglet ();
	this.nuTaglets ["nu:changecase"] = new neutrino.janx.ChangeCaseTaglet ();
	this.nuTaglets ["nu:uppercase"] = new neutrino.janx.ChangeCaseTaglet ();
	this.nuTaglets ["nu:lowercase"] = new neutrino.janx.ChangeCaseTaglet ();
	this.nuTaglets ["nu:capitalcase"] = new neutrino.janx.ChangeCaseTaglet ();
	
	// any additional taglets from the application subclass?
	if (this.getTagletConfiguration && (typeof (this.getTagletConfiguration) == "function"))
	{
		var	overrides = this.getTagletConfiguration ();
		
		for (var key in overrides)
		{
			var	taglet = overrides [key];
			
			if (taglet && (typeof (taglet) == "object"))
			{
				this.nuTaglets [key] = taglet;
			}
		}
	}
	
	this.nuTagletManager = new neutrino.janx.TagletManager (this.nuTaglets);
	this.nuJanx = new neutrino.janx.Janx (this.nuTagletManager);
	
	// initialise our root janx context
	this.nuRootJanxContext.put ("application.serverhost", this.nuServerHost);
};

neutrino.Application.prototype.janxify = function (inElement, inContext)
{
	this.nuJanx.janxify (inElement, inContext);
};

neutrino.Application.prototype.janxifyTo = function (inFromElement, inToElement, inContext, inAppend)
{
	this.nuJanx.janxifyTo (inFromElement, inToElement, inContext, inAppend);
};

neutrino.Application.prototype.janxifyText = function (inText, inContext)
{
// if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.janxifyText() with text " + inText);

	if (inContext)
	{
		// kinda expected that the incoming context has the root one as its delegate...
	}
	else
	{
		inContext = gApplication.nuRootJanxContext;
	}
	
	return this.nuJanx.janxifyText (inText, inContext);
};

neutrino.Application.prototype.makeContainers = function ()
{
	var	pageContainer = document.querySelector ("#nu-page-container");
	
	if (! pageContainer)
	{
		pageContainer = document.createElement ("div");
		pageContainer.setAttribute ("id", "nu-page-container");
		
		document.querySelector ("body").appendChild (pageContainer);
	}

	var	browserSpecificStyles = document.querySelector ("#nu-browser-specific-css");
	
	if (! browserSpecificStyles)
	{
		browserSpecificStyles = document.createElement ("style");
		browserSpecificStyles.setAttribute ("id", "nu-browser-specific-css");
		
		document.querySelector ("head").appendChild (browserSpecificStyles);
	}
};

neutrino.Application.prototype.preloadAssets = function ()
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("Application.preloadAssets()");

	// for callbacks
	var	self = this;
	
	neutrino.Utils.getURLContents
	({
		url: "preload.json",
		dataType: "json",
		async: true,
		success: function (inData, inTextStatus, inXHR)
		{
			if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("preload.json has " + inData.length + " assets");

      if (inData)
      {
        self.assetLoader = new neutrino.AssetLoader (self);
        self.assetLoader.add (inData);
      }
      else
      {
				if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.error ("preload.json empty or bad format");
      }
		},
		error: function (inXHR, inTextStatus, inThing)
		{
			if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.error ("load of preload.json failed");
		}
	});
		
};

// assetloader callbacks

neutrino.Application.prototype.onAssetLoadStart = function (inAssetLoader)
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("Application.onAssetLoadStart()");

	this.showProgressView ();
};

neutrino.Application.prototype.onAssetLoadProgress = function (inAssetLoader, inIndex, inCount, inPercentage)
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("Application.onAssetLoadProgress() with " + inPercentage + "%");
};

neutrino.Application.prototype.onAssetLoadFinish = function (inAssetLoader)
{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("Application.onAssetLoadFinish()");

	this.assetLoader = null;
	
	if (this.nuPage.isVisible ())
	{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("hiding progress view");
		this.hideProgressView ();
	}
	else
	{
if (gApplication.isLogging (gApplication.kLogAssetLoader)) console.log ("not hiding progress view");
	}
};


// ASSUME page container and invisible container exist
// *any pages found are made invisible*
neutrino.Application.prototype.preloadPages = function ()
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.preloadPages()");

	var	visiblePageKey = null;
	
	var	pageContainer = document.querySelector ("#nu-page-container");

	if (pageContainer.hasChildNodes ())
	{
		// everything we find in here is deemed a page
		for (var i = 0; i < pageContainer.childNodes.length; i++)
		{
			var	pageElement = pageContainer.childNodes [i];
			
			var pageKey = null;
			
			if (pageElement.nodeType == pageElement.ELEMENT_NODE)
			{
			  pageKey = pageElement.getAttribute ("nu-page");
			}
			
			if (pageElement.nodeType == pageElement.ELEMENT_NODE && pageKey && pageKey.length)
			{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("preloading page with key " + pageKey);
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("application page key is " + gApplication.nuPage.nuKey);

        var	page = neutrino.Loader.loadPage (pageKey);

        var	lowerCasePageKey = pageKey.toLowerCase ();
        
        page.configure (lowerCasePageKey, pageElement, null);
    
        this.addPageEventListeners (page);
  
        // HACK set this.nuPage here
        // as the loadwalker assumes that gApplication.nuPage owns the views it makes
        this.nuPage = page;
        
        // load any subviews etc
        this.nuLoadWalker.startWalkChildren (page.nuElement);
  
        // HACK reset this.nuPage after it has been set above for each page
        // and hence used by the loader
        this.nuPage = this.nuWindow;
                
        // all the subviews are loaded, the page is now loaded
        page.onLoaded ();

        // register it
        this.nuPages [lowerCasePageKey] = page;

				// and... hide it either way
				neutrino.DOM.addClass (pageElement, "nu-invisible");
			}
		}
	}
};

// find any browser-neutral CSS and convert to browser-specific
// ASSUME relative URLs are resolved against the document URL
// ASSUME that the browser specific style repository was made in makeContainers()
neutrino.Application.prototype.processCSS = function ()
{
	var	browserSpecificStyles = document.querySelector ("#nu-browser-specific-css");

	var	links = document.querySelectorAll ("link[nu-href]");
	
	if (gApplication.isLogging (gApplication.kLogCSS)) console.log ("found " + links.length + " browser neutral <link>s");

	for (var i = 0; i < links.length; i++)
	{
		var	href = links [i].getAttribute ("nu-href");
		
		if (gApplication.isLogging (gApplication.kLogCSS)) console.log ("loading " + href);

		if (href && href.length)
		{
			// sigh, split the URL up
			var	hrefElements = href.split ("?");
			var	hrefURL = hrefElements [0];
			var	hrefData = null;
			
			if (hrefElements.length > 1)
			{
				hrefData = hrefElements [1];
			}
			
			var	request = new Object ();
			request.type = "GET";
			request.url = hrefURL;
			request.data = hrefData;
			request.dataType = "html";
			request.async = false;
			
			// for callbacks
			var	self = this;
			
			request.success = function (inData, inTextStatus, inXHR)
			{
				browserSpecificStyles.innerHTML += neutrino.CSS.resolveCSS (inData);
			};
			
			request.error = function (inXHR, inTextStatus, inError)
			{
				console.error ("can't load " + href + ": " + inError);
			};
			
			neutrino.Utils.getURLContents (request);
		}
	}

	var	styles = document.querySelectorAll ("style.nu-browser-neutral-css");
	
	if (gApplication.isLogging (gApplication.kLogCSS)) console.log ("found " + styles.length + " browser neutral <style>s");

	var	accumulatedStyles = "";
	
	for (var i = 0; i < styles.length; i++)
	{
		accumulatedStyles += neutrino.CSS.resolveCSS (styles [i].innerHTML);
	}

	if (accumulatedStyles.length > 0)
	{
		// might be more performant to add to innerHTML once...
		browserSpecificStyles.innerHTML += accumulatedStyles;
	}
};

neutrino.Application.prototype.setPageInternal = function (inPageKey, inTransitionInvisibleClass, inTransitionVisibleClass, inParams)
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.setPageInternal() with key " + inPageKey);

	var	lowerCasePageKey = inPageKey.toLowerCase ();
		
	if (this.nuPage.nuKey == lowerCasePageKey)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("setPageInternal() with same page key, refresh");

		this.nuPage.setParams (inParams);
		this.nuPage.refresh ();
		
		return;
	}

	// don't transition out the window!
	if (this.nuPage && (this.nuPage != this.nuWindow))
	{
		if (this.nuPage.nuElement)
		{
			this.nuPage.onBeforeInvisible ();

			// stash the transition out class name in the page
			// so we can check for it in the animation end handler
			if (inTransitionInvisibleClass && inTransitionInvisibleClass.length)
			{
				// take the override
				this.nuPage.nuTransitionInvisibleClass = inTransitionInvisibleClass;
			}
			else
			{
				// use the default
				this.nuPage.nuTransitionInvisibleClass = "nu-transition-invisible";
			}

			neutrino.DOM.addClass (this.nuPage.nuElement, this.nuPage.nuTransitionInvisibleClass);
			neutrino.DOM.removeClass (this.nuPage.nuElement, "nu-visible");
		}
		else
		{
console.error ("current page has no element, not animating out");
		}
	}
	
	this.showProgressView ();
	
	this.nuPage = this.nuPages [lowerCasePageKey];
	
	// have we loaded this page before?
	if (! this.nuPage)
	{
		this.nuPage = neutrino.Loader.loadPage (inPageKey);
		
		this.nuPages [lowerCasePageKey] = this.nuPage;

		var	html = neutrino.Loader.loadHTML (lowerCasePageKey, "page");

		var	temp = null;
		
		if (html)
		{
			temp = document.createElement ("div");
			temp.innerHTML = html;
	
			// go looking for the page element
			var pageElement = null;
			
			for (var i = 0; i < temp.childNodes.length; i++)
			{
				var child = temp.childNodes [i];
				
				if (child.nodeType == child.ELEMENT_NODE)
				{
					var pageKey = child.getAttribute ("nu-page");
					
					if (pageKey && pageKey.length)
					{
						pageElement = child;
						
						if (pageKey.toLowerCase () != lowerCasePageKey)
						{
							console.error ("page keys don't match -");
							console.error ("fragment has key " + inPageKey);
							console.error ("nu-page says " + pageKey);
						}
						
						break;
					}
				}
			}
		}
		
    if (pageElement == null)
    {
			console.error ("did not find page element for page key " + inPageKey);
    }
    else
    {
			// have to do this before configure()
			neutrino.DOM.moveChildren (temp, document.querySelector ("#nu-page-container"));
				
			this.nuPage.configure (lowerCasePageKey, pageElement, null);

			this.addPageEventListeners (this.nuPage);

			// load any subviews etc
			this.nuLoadWalker.startWalk (this.nuPage.nuElement);
	
			// all the subviews are loaded, the page is now loaded
			this.nuPage.onLoaded ();
		}
	}

	if (this.nuPage && this.nuPage.nuElement)
	{
		this.nuPage.setParams (inParams);

		// run through calling session callbacks
		this.nuSessionWalker.startWalkChildren (this.nuPage.nuElement);
	
		// stash the transition in class name in the page
		// so we can check for it in the animation end handler
		if (inTransitionVisibleClass && inTransitionVisibleClass.length)
		{
			// take the override
			this.nuPage.nuTransitionVisibleClass = inTransitionVisibleClass;
		}
		else
		{
			// use the default
			this.nuPage.nuTransitionVisibleClass = "nu-transition-visible";
		}

		neutrino.DOM.addClass (this.nuPage.nuElement, this.nuPage.nuTransitionVisibleClass);
		neutrino.DOM.removeClass (this.nuPage.nuElement, "nu-invisible");
		
		var	hasParams = false;
		
		if (inParams)
		{
			for (var param in inParams)
			{
				if (inParams.hasOwnProperty (param))
				{
					hasParams = true;
					break;
				}
			}
		}
		
		if (!this.nuPage.nuIsNew && !hasParams)
		{
			console.log ("incoming page is old and has no parameters, not refreshing");
		}
		
		// we run dynamics if the page is new OR parameters are provided
		this.nuPage.onBeforeVisible (this.nuPage.nuIsNew || hasParams);
		
		this.nuPage.nuIsNew = false;
		
		// SET TITLE BAR
		
		var	title = this.nuPage.nuElement.getAttribute ("nu-page-title");

// if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("found page title of " + title);
		
		if (!title || (title.length == 0))
		{
			title = inPageKey.substr (0, 1).toUpperCase () + inPageKey.substr (1);
		}
		
    // $("title").html (this.nuAppName + " - " + title);

    var	newTitle = this.nuAppName + " - " + title;
    document.title = newTitle;
	}
  else
  {
console.error ("new page has no object/element, not animating in");

		this.hideProgressView ();
  }
};

neutrino.Application.prototype.setParams = function (inParams)
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.setParams()");
if (gApplication.isLogging (gApplication.kLogApplication)) console.log (inParams);

	if (inParams)
	{
		for (var key in inParams)
		{
			if (inParams.hasOwnProperty (key))
			{
				var	value = inParams [key];
				
				this.nuParams [key] = value;
				this.nuRootJanxContext.put ("params." + key, value);
			}
		}
	}
	else
	{
		// leave params untouched
	}
};

// must be called *after* setupParameters()
neutrino.Application.prototype.setupLogging = function ()
{
  this.nuLogMask = 0;
  
  this.nuLogKeywords = new Object ();
  
  this.kLogAll = 0xffffff;
  this.nuLogKeywords ["all"] = this.kLogAll;

  this.kLogViewLifeCycle = 0x1;
  this.nuLogKeywords ["view"] = this.kLogViewLifeCycle;
  
  this.kLogAssetLoader = 0x2;
  this.nuLogKeywords ["assetloader"] = this.kLogAssetLoader;

  this.kLogJanx = 0x4;
  this.nuLogKeywords ["janx"] = this.kLogJanx;

  this.kLogLoader = 0x8;
  this.nuLogKeywords ["loader"] = this.kLogLoader;

  this.kLogAsync = 0x10;
  this.nuLogKeywords ["async"] = this.kLogAsync;
  
  this.kLogApplication = 0x20;
  this.nuLogKeywords ["app"] = this.kLogApplication;
  
  this.kLogCache = 0x40;
  this.nuLogKeywords ["cache"] = this.kLogCache;

  this.kLogActions = 0x80;
  this.nuLogKeywords ["actions"] = this.kLogActions;
  
  this.kLogComponents = 0x100;
  this.nuLogKeywords ["components"] = this.kLogComponents;
  
  this.kLogAnalytics = 0x200;
  this.nuLogKeywords ["analytics"] = this.kLogAnalytics;
  
  this.kLogCSS = 0x400;
  this.nuLogKeywords ["css"] = this.kLogCSS;
  
  // see if we have any parameters for turning on logging
  var logging = this.nuParams ["nu-log"];

	if (!logging)
	{
  	logging = this.nuParams ["nu-logging"];
  }
  
  if (logging && logging.length)
  {
    var logElements = logging.split (',');
    
    for (var i = 0; i < logElements.length; i++)
    {
      var mask = this.nuLogKeywords [logElements [i]];
      
      if (typeof (mask) == "number")
      {
        this.nuLogMask |= mask;

        if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("enabling log section " + logElements [i]);
      }
    }
  }    

  var keywords = "";
  
  for (var keyword in this.nuLogKeywords)
  {
    if (typeof (keyword) == "string")
    {
      if (keywords.length > 0)
      {
        keywords += ', ';
      }
      
      keywords += keyword;
    }
  }
  
  if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("allowed logging keywords are... " + keywords);
};

neutrino.Application.prototype.isLogging = function (inMask)
{
  return (this.nuLogMask & inMask) ? true : false;
};

neutrino.Application.prototype.setupParameters = function ()
{
  this.nuURL = document.location.origin + document.location.pathname;
  
	// protocol is usually of the form http:
  this.nuURLScheme = document.location.protocol.split (':')[0];
  
  // search is usually of the form ?key=value&key=value
  var	urlParams = document.location.search.split ('?')[1];
  
  if (urlParams && (urlParams.length > 1))
  {
    var params = urlParams.split ('&');
    
    for (var i = 0; i < params.length; i++)
    {
      var keyValue = params [i].split ('=');
      
      if (keyValue.length > 1)
      {
        if (keyValue [0].length && keyValue [1].length)
        {
          this.nuParams [keyValue [0]] = keyValue [1];
        }
      }
    }
  }

	this.nuRootJanxContext.put ("application.params", this.nuParams);
};

neutrino.Application.prototype.setUserAgentFlags = function ()
{
  this.nuBrowser = new Object ();
  
  var userAgent = navigator.userAgent;

if (gApplication.isLogging (gApplication.kLogApplication)) console.log (userAgent);

	// one might think that navigator.appName and navigator.appVersion would be useful
	// and one would be wrong :-)
	
	// browser's actual name & version
	this.nuBrowser.name = "unknown";
	this.nuBrowser.versionNumber = 0;
	this.nuBrowser.version = "0";
	this.nuBrowser.type = "unknown";
	
	// the user agent reporting for the WebKit browsers is farcical
	var	appleWebKitVersion = "";
	var	chromeVersion = "";
	var	safariVersion = "";
	
	var	elements1 = userAgent.split (' ');
	
	for (var i = 0; i < elements1.length; i++)
	{
		var	element = elements1 [i];
		var	elements2 = element.split ('/');

		if (elements2 [0] == "Safari")
		{
			safariVersion = elements2 [1];
		}
		else
		if (elements2 [0] == "AppleWebKit")
		{
			// we save this because the browser you get in the save-to-home-screen on iOS
			// does not advertise itself as Safari, sigh
			appleWebKitVersion = elements2 [1];
		}
		else
		if (elements2 [0] == "Chrome")
		{
			chromeVersion = elements2 [1];
		}
		else
		if (elements2 [0] == "Firefox")
		{
			this.nuBrowser.name = "firefox";
			this.nuBrowser.type = "gecko";
			this.nuBrowser.version = elements2 [1];
			this.nuBrowser.isGecko = true;
		}
		else
		if (elements2 [0] == "Version")
		{
			// sigh, opera is nonstandard
			if (elements1 [0].substring (0, 5) == "Opera")
			{
				this.nuBrowser.name = "opera";
				this.nuBrowser.type = "opera";
				this.nuBrowser.version = elements2 [1];
			}
		}
		else
		if (elements2 [0] == "MSIE")
		{
			this.nuBrowser.name = "ie";
			this.nuBrowser.type = "ie";
			this.nuBrowser.isIE = true;
			this.nuBrowser.isIE9 = true;
			
			// the version is the next *space* delimited version with the semicolon clipped, sigh
			var	version = elements1 [i + 1];
			this.nuBrowser.version = version.substring (0, version.length - 1);
		}
	}

	// sort out the WebKit versioning mess
	if (this.nuBrowser.type == "unknown")
	{
		if (chromeVersion.length > 0)
		{
			this.nuBrowser.name = "chrome";
			this.nuBrowser.type = "webkit";
			this.nuBrowser.version = chromeVersion;
			this.nuBrowser.isWebKit = true;
		}
		else
		if (safariVersion.length > 0)
		{
			this.nuBrowser.name = "safari";
			this.nuBrowser.type = "webkit";
			this.nuBrowser.version = safariVersion;
			this.nuBrowser.isWebKit = true;
		}
		else
		if (appleWebKitVersion.length > 0)
		{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("applewebkit only detected, going with safari");

			this.nuBrowser.name = "safari";
			this.nuBrowser.type = "webkit";
			this.nuBrowser.version = appleWebKitVersion;
			this.nuBrowser.isWebKit = true;
		}
		else
		{
			console.error ("could not determine browser type");
		}
	}
	
	// fwiw
	this.nuBrowser.versionNumber = parseFloat (this.nuBrowser.version);

	// mobile or desktop
	if (userAgent.indexOf ("iPhone") >= 0)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("iphone browser detected");

		this.nuBrowser.isMobile = true;
		this.nuBrowser.isIPhone = true;
	}
	else
	if (userAgent.indexOf ("iPad") >= 0)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("ipad browser detected");

		this.nuBrowser.isMobile = true;
		this.nuBrowser.isIPad = true;
	}
	else
	if (userAgent.indexOf ("Android") >= 0)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("android browser detected");

		this.nuBrowser.isMobile = true;
		this.nuBrowser.isAndroid = true;
	}
	else
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("desktop browser detected");

		this.nuBrowser.isMobile = false;
	}

	// language
	
	// ASSUME setupURLParameters() has been called
	var	language = this.nuParams ["nu-lang"];
	
	if (language && language.length)
	{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("setting language from nu-lang parameter - " + language);

		this.nuBrowser.language = language;
	}
	else
	{
		if (navigator.userLanguage && navigator.userLanguage.length)
		{
			// IE
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("setting language from navigator.userLanguage - " + navigator.userLanguage);

			this.nuBrowser.language = navigator.userLanguage;
		}
		else
		if (navigator.language && navigator.language.length)
		{
			// WebKit/Gecko/etc
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("setting language from navigator.language - " + navigator.language);

			this.nuBrowser.language = navigator.language;
		}
		else
		{
			// find some other useful stuff
			// HACK depending on the format of the useragent string here
			var	systemInfo = userAgent.substring
				(userAgent.indexOf ('('), userAgent.indexOf (')'));
			
			var	systemInfoElements = systemInfo.split (";");
			
			// the language is the last one, usually
			var	possibleLanguage = systemInfoElements [systemInfoElements.length - 1];
			
			if (possibleLanguage.length == 5 && possibleLanguage.indexOf ('-') == 2)
			{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("setting language from user agent - " + navigator.language);

				this.nuBrowser.language = possibleLanguage;
			}
			else
			{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("defaulting language to en-us");

				this.nuBrowser.language = "en-us";
			}
		}
	}
	
	this.nuBrowser.language = this.nuBrowser.language.toLowerCase ();
	
if (gApplication.isLogging (gApplication.kLogApplication)) console.log (this.nuBrowser);

  // and... update our janx context so these are accessible in markup
  // could just put this.nuBrowser into context, but the cases are not compatible
  this.nuRootJanxContext.put ("browser.name", this.nuBrowser.name);
  this.nuRootJanxContext.put ("browser.version", this.nuBrowser.version);
  this.nuRootJanxContext.put ("browser.versionnumber", this.nuBrowser.versionNumber);
  this.nuRootJanxContext.put ("browser.type", this.nuBrowser.type);
  this.nuRootJanxContext.put ("browser.iswebkit", this.nuBrowser.isWebKit ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isgecko", this.nuBrowser.isGecko ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isopera", this.nuBrowser.isOpera ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isie9", this.nuBrowser.isIE9 ? "true" : "false");
  this.nuRootJanxContext.put ("browser.ismobile", this.nuBrowser.isMobile ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isiphone", this.nuBrowser.isIPhone ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isipad", this.nuBrowser.isIPad ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isios", (this.nuBrowser.isIPhone || this.nuBrowser.isIPad) ? "true" : "false");
  this.nuRootJanxContext.put ("browser.isandroid", this.nuBrowser.isAndroid ? "true" : "false");

  this.nuRootJanxContext.put ("browser.language", this.nuBrowser.language);

};

// CALLBACKS

// a chance to hack the request into pieces before the XHR goes
neutrino.Application.prototype.onBeforeRequest = function (inRequest)
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.onBeforeRequest() on " + inRequest.url + "?" + inRequest.data);

	var	cacheToken = this.generateCacheToken ();
	
	if (cacheToken && cacheToken.length)
	{
		if (inRequest.data && inRequest.data.length)
		{
			inRequest.data += "&cache_token=" + cacheToken;
		}
		else
		{
			inRequest.data = "cache_token=" + cacheToken;
		}

		if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.onBeforeRequest() changes url to " + inRequest.url + "?" + inRequest.data);
	}
};

neutrino.Application.prototype.onPageAnimationStart = function (inEvent)
{
	
// if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.onPageAnimationStart() for " + inEvent.animationName);

};

neutrino.Application.prototype.onPageAnimationEnd = function (inEvent)
{
if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.onPageAnimationEnd() for " + inEvent.animationName);

	var	page = neutrino.DOM.getData (inEvent.target, "page");

	if (inEvent.target == page.nuElement 
	  && neutrino.DOM.hasClass (inEvent.target, page.nuTransitionVisibleClass))
	{
		neutrino.DOM.addClass (inEvent.target, "nu-visible");
		neutrino.DOM.removeClass (inEvent.target, page.nuTransitionVisibleClass);

		page.onVisible (page);
		
		// unless the asset loader is running
		// hide the progress view
		if (this.assetLoader != null && this.assetLoader.isRunning ())
		{
			console.log ("page animation ends, but asset loader not finished");
		}
		else
		{
			this.hideProgressView ();
		}
	}

	if (inEvent.target == page.nuElement 
	  && neutrino.DOM.hasClass (inEvent.target, page.nuTransitionInvisibleClass))
	{
		neutrino.DOM.addClass (inEvent.target, "nu-invisible");
		neutrino.DOM.removeClass (inEvent.target, page.nuTransitionInvisibleClass);

		page.onInvisible (page);
	}
};

// FRAMEWORK PUBLIC METHODS

neutrino.Application.prototype.walk = function (inElement, inRunDynamics, inMakeVisible)
{
	if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.walk() on");
	if (gApplication.isLogging (gApplication.kLogApplication)) console.log (inElement);
	
	this.nuLoadWalker.startWalk (inElement);
	this.nuOnBeforeVisibleWalker.startWalk (inElement, inRunDynamics);
	
	if (inMakeVisible)
	{
  	this.nuOnVisibleWalker.startWalk (inElement);
  }

if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.walk() out");
};

neutrino.Application.prototype.walkChildren = function (inElement, inRunDynamics, inMakeVisible)
{
	if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.walkChildren() on");
	if (gApplication.isLogging (gApplication.kLogApplication)) console.log (inElement);
	
	this.nuLoadWalker.startWalkChildren (inElement);
	this.nuOnBeforeVisibleWalker.startWalkChildren (inElement, inRunDynamics);
	
	if (inMakeVisible)
	{
  	this.nuOnVisibleWalker.startWalkChildren (inElement);
  }

if (gApplication.isLogging (gApplication.kLogApplication)) console.log ("Application.walkChildren() out");
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// phone_interface.js

// base class for phone interfaces

neutrino.provide ("neutrino.mobile.PhoneInterface");

neutrino.require ("neutrino.JSON");

neutrino.mobile.PhoneInterface = function ()
{
console.log ("PhoneInterface()");

	// instance member setup
	this.callbackFunctions = new Object ();
	this.callbackObjects = new Object ();
	
	this.setResponseHandler ("log-response-handlers", this.logResponseHandlers, self);
};
neutrino.exportSymbol('neutrino.mobile.PhoneInterface', neutrino.mobile.PhoneInterface);

neutrino.mobile.PhoneInterface.prototype.createSession = function (inSessionToken)
{
console.log ("PhoneInterface.createSession() with session token " + inSessionToken);
	
	var	request = new Object ();
	request.opcode = "create-session";
	request.session_token = inSessionToken;
	
	this.request (request);
};

// Android WebKit seems to run regular browser Js and Js called from native concurrently
// so defer anything from the native side until the Js engine is ready
neutrino.mobile.PhoneInterface.prototype.deferResponse = function (inResponseListJSON)
{
	// for callbacks
	var	self = this;
	
	setTimeout
	(
		function ()
		{
			self.response (inResponseListJSON);
		},
		100
	);
	
};

neutrino.mobile.PhoneInterface.prototype.destroySession = function ()
{
	var	request = new Object ();
	request.opcode = "destroy-session";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.dispatchResponse = function (inResponse)
{
	var	callbackFunction = this.callbackFunctions [inResponse.opcode];
	
	if (callbackFunction)
	{
		var	callbackObject = this.callbackObjects [inResponse.opcode];
		
		if (callbackObject)
		{
			callbackFunction.call (callbackObject, inResponse);
		}
		else
		{
			callbackFunction (inResponse);
		}
	}
	else
	{
this.log ("no dispatcher found for response with opcode " + inResponse.opcode);
this.log ("registered opcodes are...");

		for (var opcode in this.callbackFunctions)
		{
this.log (opcode);
		}
	}
};

// careful with this, can't be used from request() for example
neutrino.mobile.PhoneInterface.prototype.log = function (inMessage)
{
	var	request = new Object ();
	request.opcode = "log";
	request.message = inMessage;
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.logResponseHandlers = function ()
{
	var	self = this;

console.log ("PhoneInterface.logResponseHandlers()");
	
	for (var opcode in this.callbackFunctions)
	{
console.log (opcode);
	}
};

neutrino.mobile.PhoneInterface.prototype.pickMovie = function (inCallbackFunction, inCallbackObject, inOptions)
{
console.log ("PhoneInterface.pickMovie()");

	this.setResponseHandler ("pick-movie", inCallbackFunction, inCallbackObject);

	var	request = inOptions;
	
	if (request && (typeof (request) == "object"))
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}
	
	request.opcode = "pick-movie";
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.recordMovie = function (inCallbackFunction, inCallbackObject, inOptions)
{
this.log ("PhoneInterface.recordMovie()");

	this.setResponseHandler ("record-movie", inCallbackFunction, inCallbackObject);

	var	request = inOptions;
	
	if (request && (typeof (request) == "object"))
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}
	
	request.opcode = "record-movie";
	this.request (request);
};

// argument can be single response or list of responses
neutrino.mobile.PhoneInterface.prototype.response = function (inResponseListJSON)
{
// this.log ("PhoneInterface.response()");

  var result = "success";
  
  try
  {
    var	responseList = neutrino.JSON.parse (inResponseListJSON);
  
    if (typeof (responseList.length) == "undefined")
    {
      this.dispatchResponse (responseList);
    }
    else
    {
      for (var i = 0; i < responseList.length; i++)
      {
        this.dispatchResponse (responseList [i]);
      }
    }
  }
  catch (inError)
  {
    result = "" + inError;
  }
  
	return result;
};

neutrino.mobile.PhoneInterface.prototype.startCameraPreview = function (inCallbackFunction, inCallbackObject, inOptions)
{
console.log ("PhoneInterface.startCameraPreview()");

	this.setResponseHandler ("start-camera-preview", inCallbackFunction, inCallbackObject);
	this.setResponseHandler ("camera-preview-frame", inCallbackFunction, inCallbackObject);

  if (inOptions && inOptions ["capture-movie"])
  {
	  this.setResponseHandler ("captured-movie-url", inCallbackFunction, inCallbackObject);
  }
  
	var	request = inOptions;
	
	if (request && (typeof (request) == "object"))
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}
	
	request.opcode = "start-camera-preview";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.stopCameraPreview = function ()
{
console.log ("PhoneInterface.stopCameraPreview()");

	this.removeResponseHandler ("start-camera-preview");
	this.removeResponseHandler ("camera-preview-frame");

	var	request = new Object ();
	request.opcode = "stop-camera-preview";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.startHeadingUpdates = function (inCallbackFunction, inCallbackObject, inOptions)
{
console.log ("PhoneInterface.startHeadingUpdates()");

	this.setResponseHandler ("heading-update", inCallbackFunction, inCallbackObject);

	var	request = inOptions;
	
	if (request && (typeof (request) == "object"))
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}
	
	request.opcode = "start-heading-updates";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.startLocationUpdates = function (inCallbackFunction, inCallbackObject, inOptions)
{
console.log ("PhoneInterface.startLocationUpdates()");

	this.setResponseHandler ("location-update", inCallbackFunction, inCallbackObject);

	var	request = inOptions;
	
	if (request && (typeof (request) == "object"))
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}
	
	request.opcode = "start-location-updates";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.stopHeadingUpdates = function ()
{
console.log ("PhoneInterface.stopHeadingUpdates()");

	this.removeResponseHandler ("heading-update");

	var	request = new Object ();
	request.opcode = "stop-heading-updates";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.stopLocationUpdates = function ()
{
console.log ("PhoneInterface.stopLocationUpdates()");

	this.removeResponseHandler ("start-location-updates");
	this.removeResponseHandler ("location-update");
	this.removeResponseHandler ("heading-update");

	var	request = new Object ();
	request.opcode = "stop-location-updates";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.startMotionUpdates = function (inCallbackFunction, inCallbackObject, inOptions)
{
console.log ("PhoneInterface.startMotionUpdates()");

	this.setResponseHandler ("start-motion-updates", inCallbackFunction, inCallbackObject);
	this.setResponseHandler ("motion-update", inCallbackFunction, inCallbackObject);

	var	request = inOptions;
	
	if (request && (typeof (request) == "object"))
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}
	
	request.opcode = "start-motion-updates";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.stopMotionUpdates = function ()
{
console.log ("PhoneInterface.stopLocationUpdates()");

	this.removeResponseHandler ("start-motion-updates");
	this.removeResponseHandler ("motion-update");

	var	request = new Object ();
	request.opcode = "stop-motion-updates";
	
	this.request (request);
};

neutrino.mobile.PhoneInterface.prototype.removeResponseHandler = function (inOpcode)
{
this.log ("PhoneInterface.removeResponseHandler() with opcode " + inOpcode);

	delete this.callbackObjects [inOpcode];
	delete this.callbackFunctions [inOpcode];
};

neutrino.mobile.PhoneInterface.prototype.setResponseHandler = function (inOpcode, inCallbackFunction, inCallbackObject)
{
console.log ("PhoneInterface.setResponseHandler() for opcode " + inOpcode);

	this.callbackFunctions [inOpcode] = inCallbackFunction;

	if (inCallbackObject)
	{
		this.callbackObjects [inOpcode] = inCallbackObject;
	}
};

neutrino.mobile.PhoneInterface.prototype.uploadURL = function (inSourceURL, inUploadURL, inCallbackFunction, inCallbackObject, inOptions)
{
console.log ("PhoneInterface.uploadURL()");
console.log (inOptions);

	this.setResponseHandler ("upload-url-start", inCallbackFunction, inCallbackObject);
	this.setResponseHandler ("upload-url-progress", inCallbackFunction, inCallbackObject);
	this.setResponseHandler ("upload-url-end", inCallbackFunction, inCallbackObject);

	var	request = inOptions;
	
	if (request)
	{
		// ok, we trust you
	}
	else
	{
		request = new Object ();
	}

	request ["source-url"] = inSourceURL;
	request ["upload-url"] = inUploadURL;
	request.opcode = "upload-url";
	this.request (request);
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// dummy-phone-interface.js

// PhoneInterface subclass for desktops

neutrino.provide ("neutrino.mobile.DummyPhoneInterface");

neutrino.require ("neutrino.mobile.PhoneInterface");

neutrino.mobile.DummyPhoneInterface = function ()
{
	neutrino.mobile.PhoneInterface.call (this);
};
neutrino.inherits (neutrino.mobile.DummyPhoneInterface, neutrino.mobile.PhoneInterface);
neutrino.exportSymbol('neutrino.mobile.DummyPhoneInterface', neutrino.mobile.DummyPhoneInterface);

neutrino.mobile.DummyPhoneInterface.prototype.request = function (inRequest)
{
	var	self = this;

console.log ("DummyPhoneInterface.request() with opcode " + inRequest.opcode);

	// ignore everything
	
};
/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

// iphone_interface.js

// PhoneInterface subclass for iPhone

neutrino.provide ("neutrino.mobile.IPhoneInterface");

neutrino.require ("neutrino.mobile.PhoneInterface");
neutrino.require ("neutrino.JSON");

neutrino.mobile.IPhoneInterface = function ()
{
console.log ("IPhoneInterface()");

	neutrino.mobile.PhoneInterface.call (this);

	// instance member setup
	this.queue = new Array ();
};
neutrino.inherits (neutrino.mobile.IPhoneInterface, neutrino.mobile.PhoneInterface);
neutrino.exportSymbol('neutrino.mobile.IPhoneInterface', neutrino.mobile.IPhoneInterface);

neutrino.mobile.IPhoneInterface.prototype.detachQueue = function ()
{
// console.log ("IPhoneInterface.detachQueue()");

	var	queue = this.queue;
	
	this.queue = new Array ();

	return neutrino.JSON.stringify (queue);
};

neutrino.mobile.IPhoneInterface.prototype.request = function (inRequest)
{
	this.queue.push (inRequest);
};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/


// android_interface.js

// PhoneInterface subclass for Android

neutrino.provide ("neutrino.mobile.AndroidInterface");

neutrino.require ("neutrino.mobile.PhoneInterface");
neutrino.require ("neutrino.JSON");

neutrino.mobile.AndroidInterface = function ()
{
	neutrino.mobile.PhoneInterface.call (this);
};
neutrino.inherits (neutrino.mobile.AndroidInterface, neutrino.mobile.PhoneInterface);
neutrino.exportSymbol('neutrino.mobile.AndroidInterface', neutrino.mobile.AndroidInterface);

neutrino.mobile.AndroidInterface.prototype.request = function (inRequest)
{
	var	self = this;

console.log ("AndroidInterface.request() with opcode " + inRequest.opcode);

	Phone.dispatchRequest (neutrino.JSON.stringify (inRequest));

};

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.components.RadioView");

neutrino.require ("neutrino.View");

// CONSTRUCTOR

neutrino.components.RadioView = function ()
{
  neutrino.View.call (this);

if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("RadioView()");

	this.subViewAttribute = "nu-radio-view";
}
neutrino.inherits (neutrino.components.RadioView, neutrino.View);
neutrino.exportSymbol('neutrino.components.RadioView', neutrino.components.RadioView);


// OVERRIDEABLES

neutrino.components.RadioView.prototype.select = function (inElement)
{
if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("RadioView.select()");
if (gApplication.isLogging (gApplication.kLogComponents)) console.log (inElement);

	neutrino.DOM.addClass (inElement, "selected");
},

neutrino.components.RadioView.prototype.unselect = function (inElement)
{
if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("RadioView.unselect()");
if (gApplication.isLogging (gApplication.kLogComponents)) console.log (inElement);

	neutrino.DOM.removeClass (inElement, "selected");
},

// PUBLIC METHODS

// click on one of our tabs
neutrino.components.RadioView.prototype.onClickTab = function (inEvent)
{
if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("NuRadioView.onClickTab()");

	var	clickOnSelected = false;
	
	// find the selected one
	var selectedElements = neutrino.DOM.find (this.nuElement, "[" + this.subViewAttribute + "].selected");

	for (var i = 0; i < selectedElements.length; i++)
	{
	  var element = selectedElements [i];
	  
    var	clickedElement = false;
    
    if (inEvent.target == element)
    {
      clickedElement = true;
    }
    else
    {
      var parents = neutrino.DOM.getParents (inEvent.target);
      
      for (var j = 0; j < parents.length; j++)
      {
        clickedElement = (parents [j] == element);
        
        if (clickedElement)
        {
          break;
        }
      }
    }
  
    if (clickedElement)
    {
      clickOnSelected = true;
    }
    else
    {
      this.unselect (element);
    }
	}

	if (! clickOnSelected)
	{
		// select the appropriate ancestor of the event target
		var	element = inEvent.target;
		
		do
		{
			var	viewKey = element.getAttribute (this.subViewAttribute);

			if (viewKey && viewKey.length)
			{
				this.select (element);
				
				break;
			}
			
			element = element.parentNode;
		}
		while (element != document);
	}
	
	return true;
}
neutrino.exportSymbol('neutrino.components.RadioView.prototype.onClickTab',
  neutrino.components.RadioView.prototype.onClickTab);

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.components.RetroSwipeView");

neutrino.require ("neutrino.View");

// CONSTRUCTOR

neutrino.components.RetroSwipeView = function ()
{
	neutrino.View.call (this);
	
if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("RetroSwipeView.init()");
};
neutrino.inherits (neutrino.components.RetroSwipeView, neutrino.View);
neutrino.exportSymbol('neutrino.components.RetroSwipeView', neutrino.components.RetroSwipeView);

neutrino.components.RetroSwipeView.prototype.onLoaded = function()
{
	
	neutrino.View.prototype.onLoaded.call (this);
	
	this.swipeAnimating = false,

	this.scrollOffset = {x: 0, y: 0};
	this.lastTracked = {x: 0, y: 0};
	this.startTime = 0;
	this.isTouching = false;
	this.originalTarget = null;
	this.currentX = 0;
	this.currentY = 0;
	
	this.isHorizontal = false;
	this.isVertical = false;

	this.scrollElement = this.nuElement.querySelector (".nu-container");
	
	if (neutrino.DOM.hasClass (this.nuElement, "nu-horizontal")) {
		this.isHorizontal = true;
	}
	if (neutrino.DOM.hasClass (this.nuElement, "nu-vertical")) {
		this.isVertical = true;
	}
	
	if ( ! neutrino.DOM.hasClass (this.nuElement, "nu-vertical") && 
			 ! neutrino.DOM.hasClass (this.nuElement, "nu-horizontal")   ) {
		this.isVertical = true; // default to vertical if we can't get oriented
	}
	
	
	// TO DO! 
	this.isTouchDevice = gApplication.nuBrowser.isMobile;
	
	//var debug = document.getElementById("inline-debug");
	//debug.innerHTML += "touch? " + this.isTouchDevice;
	
	// for callbacks
	var self = this;
	
	if (! this.isTouchDevice ) {
		
		neutrino.DOM.listen (this.nuElement, "click", function(e) {
			
			if (self.hasMoved) {
			 e.preventDefault();
			 e.stopPropagation();
			}
			
		}, true);
		
		neutrino.DOM.listen (this.nuElement, "mousedown", function(e) {
			
			e.preventDefault();
      e.stopPropagation();
			
			self.touchStart(e);
		});
			
	}
	else {	

		neutrino.DOM.listen (this.nuElement, "touchstart", function(e) {
			
			e.preventDefault();
      e.stopPropagation();
			
		  self.touchStart(e);
			
		});
	
	}

	neutrino.DOM.listen (this.scrollElement, "webkitTransitionEnd", this.transitionEnd);
	neutrino.DOM.listen (this.scrollElement, "mozTransitionEnd", this.transitionEnd);

	// turn on hardware accel for animating element
	neutrino.CSS.setTranslate3D (this.scrollElement, 0, 0, 0);
	// this.scrollElement.style.webkitTransform = "translate3d(0,0,0)";
	
//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("swipe view loaded");

};

neutrino.components.RetroSwipeView.prototype.onDOMReady = function()
{
  neutrino.View.prototype.onDOMReady.call (this);
	
};


neutrino.components.RetroSwipeView.prototype.onVisible = function() {
  neutrino.View.prototype.onVisible.call (this);
 
  if (gApplication.isLogging (gApplication.kLogComponents)) console.log("RetroSwipeView visible");
 
}


neutrino.components.RetroSwipeView.prototype.transitionEnd = function(inEvent) {
	
	this.isAnimating = false;	
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(":::::: transition end");
	
	
};

neutrino.components.RetroSwipeView.prototype.touchStart = function(inEvent) {
	
  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("RetroSwipeView.touchStart()");
	this.unbind();

  neutrino.CSS.setTransitionProperty (this.scrollElement, "none");
	// this.scrollElement.style.webkitTransitionProperty = "none";
	
	this.originalTarget = inEvent.target;
	
	this.startPoint = this.plotEvent(inEvent);
	this.startTime = new Date().getTime();
	
	this.isTouching = true;
	
	// for callbacks
	var self = this;
	
	// note, due to bug in neutrino.DOM.unlisten()
	// MUST set this.moveFunction and this.endFunction in the primers here
	
	if (! this.isTouchDevice ) {
	
		neutrino.DOM.listen (document.body, "mousemove", this.moveFunction = function(e) {
			e.preventDefault();
      e.stopPropagation();
			self.touchMove(e);
		
		});
		
		neutrino.DOM.listen (document.body, "mouseup", this.endFunction = function(e) {
		  e.preventDefault();
      e.stopPropagation();
			self.touchEnded(e);
		
		});
		
		
	}
	else {
		
		neutrino.DOM.listen (document.body, "touchmove", this.moveFunction = function(e) {
		  
		  e.preventDefault();
      e.stopPropagation();
			
			self.touchMove(e)
		
		});

		neutrino.DOM.listen (document.body, "touchend", this.endFunction = function(e) {
			
			e.preventDefault();
      e.stopPropagation();
			
      self.touchEnded(e);
			
		});
		
	}
	
	this.lastTracked.x = 0;
	this.lastTracked.y = 0;
	this.totalScroll = 0;
	
	this.hasMoved = false;
	
	
};

neutrino.components.RetroSwipeView.prototype.touchMove = function(inEvent) { 

	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("MOVE: " + this.page + " " + this.key);

	var point = this.plotEvent(inEvent);
	
	this.hasMoved = true;
	
	// plot for horizontal and vertical
	var translateX = "0px";
	var translateY = "0px";
	var translateZ = "0px";
	
	// var translateString = String = "translate3d(0,0,0)";
	
	if (this.isVertical && this.isHorizontal) {
		this.currentX =  this.scrollOffset.x + (point.x - this.startPoint.x);
		this.currentY =  this.scrollOffset.y + (point.y - this.startPoint.y);
	
		// translateString = "translate3d("+this.currentX +"px,"+this.currentY+"px,0)";
		translateX = this.currentX + "px";
		translateY = this.currentY + "px";
	}
	else if (this.isHorizontal) {
		this.currentX =  this.scrollOffset.x + (point.x - this.startPoint.x);
		// translateString = "translate3d("+this.currentX+"px,0,0)";
		translateX = this.currentX + "px";
	}
	else if (this.isVertical) {
		this.currentY =  this.scrollOffset.y + (point.y - this.startPoint.y);
		// translateString = "translate3d(0,"+this.currentY+"px,0)";
		translateY = this.currentY + "px";
	}
	
	
	if (gApplication.isLogging (gApplication.kLogComponents)) console.log(":::touch move: "+ this.currentX+ " " +this.currentY );
	
	// there is an issue in some Android envirnments where we'll get a start and move event simultaneously
	// so we're taking the max of our calculated time or 1 here….
	this.elapsedTime = Math.max(new Date().getTime() - this.startTime, 1);  
	
	this.totalScroll = Math.abs(point.x - this.startPoint.x) + Math.abs(point.y - this.startPoint.y);
	
	if (this.lastTracked.x != 0)
		this.distanceX = Math.abs(this.lastTracked.x - point.x);
	else this.distanceX = 0;
	
	if (this.lastTracked.y != 0)
		this.distanceY = Math.abs(this.lastTracked.y - point.y);
	else this.distanceY = 0;
	
	
	this.speedX = Math.floor(50 * (this.distanceX / this.elapsedTime));
	this.speedY = Math.floor(50 * (this.distanceY / this.elapsedTime));
	
	//this.speedX = 250 * (this.distanceX / this.elapsedTime);
	//this.speedY = 250 * (this.distanceY / this.elapsedTime);
	
	
	//if (this.speed > 5) this.speed = 0.0001;
	
	
	this.vectorX = this.lastTracked.x < point.x ? "RIGHT" : "LEFT";
	this.vectorY = this.lastTracked.y < point.y ? "DOWN" : "UP";
	

  neutrino.CSS.setTransitionProperty (this.scrollElement, "none");
  $(this.scrollElement).css({left:translateX, top: translateY });

	this.lastTracked.x = point.x;
	this.lastTracked.y = point.y;	 

		
};

neutrino.components.RetroSwipeView.prototype.unbind = function() {

  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("UNBINDING!");
  // unbind listeners
	if (! this.isTouchDevice ) {
		neutrino.DOM.unlisten (document.body, "mousemove", this.moveFunction);
		neutrino.DOM.unlisten (document.body, "mouseup", this.endFunction);
	}
	else {
		neutrino.DOM.unlisten (document.body, "touchmove", this.moveFunction);
		neutrino.DOM.unlisten (document.body, "touchend", this.endFunction);
		//"body".unbind("touchcancel",arguments.callee.caller, false);
	}

};

neutrino.components.RetroSwipeView.prototype.touchEnded = function(inEvent) {

//if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("RetroSwipeView.touchEnded()");
	
	this.isTouching = false;
	this.unbind();
					
	if (this.hasMoved) {
	
	  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("--- has moved");
	  
	  var decelMultiplier = 5;
	  
	  // we're just bumping down the decel behavior on android for now
	  // the animation causes all kinds of render artifacts
	  if (gApplication.nuBrowser.isAndroid) {
	   decelMultiplier = 1;  // basically we can't do any easing out on android or it tanks
	                         // in terms of the rendering
	  }
	  
	  
		// limit and animate where necessary:	
		var translateX = "0";
		var translateY = "0";
		var translateZ = "0";
    var translateString;
		
		//if (this.speedY > 1 || this.speedX > 1) {
		
		  
			
			this.isAnimating = true;
		//}
		
		
		var totalHeight = -0.9 * this.scrollElement.offsetHeight;
		var totalWidth = -0.9 * this.scrollElement.offsetWidth;
		
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("total width: " + totalWidth);
		
		
		if (this.isVertical && this.isHorizontal) {
		
		  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("vertical and horizonatal");
		
			if (this.vectorX == "LEFT") this.currentX -= (decelMultiplier*this.speedX);
			else if (this.vectorX == "RIGHT") this.currentX += (decelMultiplier*this.speedX);
			if (this.vectorY == "UP") this.currentY -= (decelMultiplier*this.speedY);
			else if (this.vectorY == "DOWN") this.currentY += (decelMultiplier*this.speedY);
			
			if (this.currentY > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = 0;
			}
			
			if (this.currentY < totalHeight) {
				//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("height is: " + totalHeight);
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = totalHeight;
			}
			
			if (this.currentX > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = 0;
			}
			
			//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("width is: " + totalWidth);
			
			if (this.currentX < totalWidth) {
				
		    neutrino.CSS.setTransitionProperty (this.scrollElement,"transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = totalWidth;
			}
	
			
			translateX = this.currentX + "px";
			translateY = this.currentY + "px";
			// translateString = "translate3d("+this.currentX +"px,"+this.currentY+"px,0)";
			
		}
		
		else if (this.isHorizontal) {
		
		  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("horizonatal with " + this.vectorX);
		
			if (this.vectorX == "LEFT") this.currentX -= (decelMultiplier*this.speedX);
			else if (this.vectorX == "RIGHT") this.currentX += (decelMultiplier*this.speedX);
			
			translateString = "translate3d("+this.currentX+"px,0,0)";
			
			if (this.currentX > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = 0;
			}
			
			//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("width is: " + totalWidth);
			
			if (this.currentX < totalWidth ) {
				
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = totalWidth;
			}
			
			translateX = this.currentX + "px";
			
		}
		else if (this.isVertical) {
		  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("vertical");
			if (this.vectorY == "UP") this.currentY -= (decelMultiplier*this.speedY);
			else if (this.vectorY == "DOWN") this.currentY += (decelMultiplier*this.speedY);
			
			if (this.currentY > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = 0;
			}
			
			if (this.currentY < totalHeight) {
				//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("height is: " + totalHeight);
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = totalHeight;
			}
			
			translateY = this.currentY + "px";
			// translateString = "translate3d(0,"+this.currentY+"px,0)";
		}
	
	
		
		if (this.isVertical && this.isHorizontal) {
			this.scrollOffset.x = this.currentX;
			this.scrollOffset.y = this.currentY;
		}
		else if (this.isHorizontal) {
			this.scrollOffset.x = this.currentX;
		}
		else if (this.isVertical) {
			this.scrollOffset.y = this.currentY;
		}
		
		
		$(this.scrollElement).animate({left:translateX, top: translateY }, 500, "easeOutSine");
		
		

	}	
	
	// and last but not least, interpret this as a click, where appropriate
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.totalScroll);
	else {
		if (gApplication.isLogging (gApplication.kLogComponents)) console.log("triggering click!");
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.originalTarget.onclick);
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.originalTarget.id);

    console.error ("swipe view defeating click dispatch");
    
	
    if (this.isTouchDevice ) {
  		try {
  			
  			var evt = document.createEvent("MouseEvents");
    		evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
    		var cb = this.originalTarget; 
    		var canceled = !cb.dispatchEvent(evt);
    		if(canceled) {
      		// A handler called preventDefault
      		if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("canceled");
    		} else {
      		// None of the handlers called preventDefault
      		if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("not canceled");
    		}
     		 			
  			
  			
  			//this.originalTarget.onclick();
  		}
  		catch(er) {
  			if (gApplication.isLogging (gApplication.kLogComponents)) console.log("NO ONCLICK");
  		}
		
    }
	
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("end triggering click!")
	
	}

};

neutrino.components.RetroSwipeView.prototype.plotEvent = function(inEvent) {
	
	if (inEvent.touches) {		
		var ex = inEvent.touches[0].pageX;
		var ey = inEvent.touches[0].pageY;
	}
	else {
		var ex = inEvent.pageX;
		var ey = inEvent.pageY;
	}

	
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("plotting " + ex + " " + ey);
	// we are just going 2x on the android tracking
	// for now, it helps with the slow rendering 
	if (gApplication.nuBrowser.isAndroid) {
    return { x: 2*ex, y: 2*ey};
	}
	else return { x: ex, y: ey};
	
	
	
};

neutrino.components.RetroSwipeView.prototype.onBeforeInvisible = function () {
	
	neutrino.View.prototype.onBeforeInvisible.call (this);
	if (gApplication.isLogging (gApplication.kLogComponents)) console.log("RetroSwipeView onBeforeInvisible");
	
	this.unbind();
	
};


/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.components.SwipeView");

neutrino.require ("neutrino.View");

// CONSTRUCTOR

neutrino.components.SwipeView = function ()
{
	neutrino.View.call (this);
	
if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("SwipeView.init()");
};
neutrino.inherits (neutrino.components.SwipeView, neutrino.View);
neutrino.exportSymbol('neutrino.components.SwipeView', neutrino.components.SwipeView);

neutrino.components.SwipeView.prototype.onLoaded = function()
{
	
	neutrino.View.prototype.onLoaded.call (this);
	
	this.swipeAnimating = false,

	this.scrollOffset = {x: 0, y: 0};
	this.lastTracked = {x: 0, y: 0};
	this.startTime = 0;
	this.isTouching = false;
	this.originalTarget = null;
	this.currentX = 0;
	this.currentY = 0;
	
	this.isHorizontal = false;
	this.isVertical = false;

	this.scrollElement = this.nuElement.querySelector (".nu-container");
	
	if (neutrino.DOM.hasClass (this.nuElement, "nu-horizontal")) {
		this.isHorizontal = true;
	}
	if (neutrino.DOM.hasClass (this.nuElement, "nu-vertical")) {
		this.isVertical = true;
	}
	
	if ( ! neutrino.DOM.hasClass (this.nuElement, "nu-vertical") && 
			 ! neutrino.DOM.hasClass (this.nuElement, "nu-horizontal")   ) {
		this.isVertical = true; // default to vertical if we can't get oriented
	}
	
	
	// TO DO!
	this.isTouchDevice = gApplication.nuBrowser.isMobile;
	
	//var debug = document.getElementById("inline-debug");
	//debug.innerHTML += "touch? " + this.isTouchDevice;
	
	// for callbacks
	var self = this;
	
	if (! this.isTouchDevice ) {
		
		neutrino.DOM.listen (this.nuElement, "click", function(e) {
			
			if (self.hasMoved) {
			 e.preventDefault();
			 e.stopPropagation();
			}
			
		}, true);
		
		neutrino.DOM.listen (this.nuElement, "mousedown", function(e) {
			
			e.preventDefault();
      e.stopPropagation();
			
			self.touchStart(e);
		});
			
	}
	else {	

		neutrino.DOM.listen (this.nuElement, "touchstart", function(e) {
			
			e.preventDefault();
      e.stopPropagation();
			
		  self.touchStart(e);
			
		});
	
	}

	neutrino.DOM.listen (this.scrollElement, "webkitTransitionEnd", this.transitionEnd);
	neutrino.DOM.listen (this.scrollElement, "mozTransitionEnd", this.transitionEnd);

	// turn on hardware accel for animating element
	neutrino.CSS.setTranslate3D (this.scrollElement, 0, 0, 0);
	// this.scrollElement.style.webkitTransform = "translate3d(0,0,0)";
	
//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("swipe view loaded");

};

neutrino.components.SwipeView.prototype.onDOMReady = function()
{
  neutrino.View.prototype.onDOMReady.call (this);
	
};


neutrino.components.SwipeView.prototype.onVisible = function() {
  neutrino.View.prototype.onVisible.call (this);
 
  if (gApplication.isLogging (gApplication.kLogComponents)) console.log("SwipeView visible");
 
}


neutrino.components.SwipeView.prototype.transitionEnd = function(inEvent) {
	
	this.isAnimating = false;	
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(":::::: transition end");
	
	
};

neutrino.components.SwipeView.prototype.touchStart = function(inEvent) {
	
  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("SwipeView.touchStart()");
	this.unbind();

  neutrino.CSS.setTransitionProperty (this.scrollElement, "none");
	// this.scrollElement.style.webkitTransitionProperty = "none";
	
	this.originalTarget = inEvent.target;
	
	//var	xblocker = document.createElement ("div");
	//neutrino.DOM.addClass (xblocker, "nu-x-blocker");
	
	//this.nuElement.appendChild (xblocker);
	
	this.startPoint = this.plotEvent(inEvent);
	this.startTime = new Date().getTime();
	
	this.isTouching = true;
	
	// for callbacks
	var self = this;
	
	// note, due to bug in neutrino.DOM.unlisten()
	// MUST set this.moveFunction and this.endFunction in the primers here
	
	if (! this.isTouchDevice ) {
	
		neutrino.DOM.listen (document.body, "mousemove", this.moveFunction = function(e) {
			e.preventDefault();
      e.stopPropagation();
			self.touchMove(e);
		
		});
		
		neutrino.DOM.listen (document.body, "mouseup", this.endFunction = function(e) {
		  e.preventDefault();
      e.stopPropagation();
			self.touchEnded(e);
		
		});
		
		
	}
	else {
		
		neutrino.DOM.listen (document.body, "touchmove", this.moveFunction = function(e) {
		  
		  e.preventDefault();
      e.stopPropagation();
			
			self.touchMove(e)
		
		});

		neutrino.DOM.listen (document.body, "touchend", this.endFunction = function(e) {
			
			e.preventDefault();
      e.stopPropagation();
			
      self.touchEnded(e);
			
		});
		
	}
	
	this.lastTracked.x = 0;
	this.lastTracked.y = 0;
	this.totalScroll = 0;
	
	this.hasMoved = false;
	
	
};

neutrino.components.SwipeView.prototype.touchMove = function(inEvent) { 

	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("MOVE: " + this.page + " " + this.key);

	var point = this.plotEvent(inEvent);
	
	this.hasMoved = true;
	
	// plot for horizontal and vertical
	var translateX = "0px";
	var translateY = "0px";
	var translateZ = "0px";
	
	// var translateString = String = "translate3d(0,0,0)";
	
	if (this.isVertical && this.isHorizontal) {
		this.currentX =  this.scrollOffset.x + (point.x - this.startPoint.x);
		this.currentY =  this.scrollOffset.y + (point.y - this.startPoint.y);
	
		// translateString = "translate3d("+this.currentX +"px,"+this.currentY+"px,0)";
		translateX = this.currentX + "px";
		translateY = this.currentY + "px";
	}
	else if (this.isHorizontal) {
		this.currentX =  this.scrollOffset.x + (point.x - this.startPoint.x);
		// translateString = "translate3d("+this.currentX+"px,0,0)";
		translateX = this.currentX + "px";
	}
	else if (this.isVertical) {
		this.currentY =  this.scrollOffset.y + (point.y - this.startPoint.y);
		// translateString = "translate3d(0,"+this.currentY+"px,0)";
		translateY = this.currentY + "px";
	}
	
	
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(":::touch move: "+ this.currentX+ " " +this.currentY );
	
	// there is an issue in some Android envirnments where we'll get a start and move event simultaneously
	// so we're taking the max of our calculated time or 1 here….
	this.elapsedTime = Math.max(new Date().getTime() - this.startTime, 1);  
	
	this.totalScroll = Math.abs(point.x - this.startPoint.x) + Math.abs(point.y - this.startPoint.y);
	
	if (this.lastTracked.x != 0)
		this.distanceX = Math.abs(this.lastTracked.x - point.x);
	else this.distanceX = 0;
	
	if (this.lastTracked.y != 0)
		this.distanceY = Math.abs(this.lastTracked.y - point.y);
	else this.distanceY = 0;
	
	
	this.speedX = Math.floor(250 * (this.distanceX / this.elapsedTime));
	this.speedY = Math.floor(250 * (this.distanceY / this.elapsedTime));
	
	//this.speedX = 250 * (this.distanceX / this.elapsedTime);
	//this.speedY = 250 * (this.distanceY / this.elapsedTime);
	
	
	//if (this.speed > 5) this.speed = 0.0001;
	
	
	this.vectorX = this.lastTracked.x < point.x ? "RIGHT" : "LEFT";
	this.vectorY = this.lastTracked.y < point.y ? "DOWN" : "UP";
	
	
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.distanceY + " s:" + this.speedY + " - " + this.distanceX + " - " + this.speedX);


	//if (! isAnimating) {
	  
	  neutrino.CSS.setTransitionProperty (this.scrollElement, "none");
	  
	  //neutrino.CSS.setTransitionDuration (this.scrollElement, "30ms");
	  //neutrino.CSS.setTransitionProperty (this.scrollElement, "none");
	  
	  if (gApplication.nuBrowser.isAndroid) {
	    
	    this.scrollElement.style.transitionDuration = "200ms";
  	  this.scrollElement.style.webkitTransitionDuration = "200ms";
  	  this.scrollElement.style.webkitTransitionTimingFunction = "ease-out";
	    
	    //this.scrollElement.style.webkitTransform = "translateX(" + translateX + ")";
	    this.scrollElement.style.left = translateX;
 
	  }
	  else {
	   neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, translateZ);
	  }
	  
	  
		// this.scrollElement.style.webkitTransitionProperty = "none";
		// this.scrollElement.style.webkitTransitionDuration = "1ms";
		// this.scrollElement.style.webkitTransform = translateString;
	//}
	//else {
	//	if (gApplication.isLogging (gApplication.kLogComponents)) console.log("XXXXXX");
	//}

	
	this.lastTracked.x = point.x;
	this.lastTracked.y = point.y;	 

		
};

neutrino.components.SwipeView.prototype.unbind = function() {

  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("UNBINDING!");
  // unbind listeners
	if (! this.isTouchDevice ) {
		neutrino.DOM.unlisten (document.body, "mousemove", this.moveFunction);
		neutrino.DOM.unlisten (document.body, "mouseup", this.endFunction);
	}
	else {
		neutrino.DOM.unlisten (document.body, "touchmove", this.moveFunction);
		neutrino.DOM.unlisten (document.body, "touchend", this.endFunction);
		//"body".unbind("touchcancel",arguments.callee.caller, false);
	}

};

neutrino.components.SwipeView.prototype.touchEnded = function(inEvent) {

//if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("SwipeView.touchEnded()");
	
	this.isTouching = false;
	this.unbind();
					
	if (this.hasMoved) {
	
	  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("--- has moved");
	  
	  var decelMultiplier = 5;
	  
	  // we're just bumping down the decel behavior on android for now
	  // the animation causes all kinds of render artifacts
	  if (gApplication.nuBrowser.isAndroid) {
	   decelMultiplier = 1;  // basically we can't do any easing out on android or it tanks
	                         // in terms of the rendering
	  }
	  
	  
		// limit and animate where necessary:	
		var translateX = "0";
		var translateY = "0";
		var translateZ = "0";
    var translateString;
		
		//if (this.speedY > 1 || this.speedX > 1) {
		
		  
			
			this.isAnimating = true;
		//}
		
		
		var totalHeight = -0.9 * this.scrollElement.offsetHeight;
		var totalWidth = -0.9 * this.scrollElement.offsetWidth;
		
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("total width: " + totalWidth);
		
		
		if (this.isVertical && this.isHorizontal) {
		
		  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("vertical and horizonatal");
		
			if (this.vectorX == "LEFT") this.currentX -= (decelMultiplier*this.speedX);
			else if (this.vectorX == "RIGHT") this.currentX += (decelMultiplier*this.speedX);
			if (this.vectorY == "UP") this.currentY -= (decelMultiplier*this.speedY);
			else if (this.vectorY == "DOWN") this.currentY += (decelMultiplier*this.speedY);
			
			if (this.currentY > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = 0;
			}
			
			if (this.currentY < totalHeight) {
				//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("height is: " + totalHeight);
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = totalHeight;
			}
			
			if (this.currentX > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = 0;
			}
			
			//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("width is: " + totalWidth);
			
			if (this.currentX < totalWidth) {
				
		    neutrino.CSS.setTransitionProperty (this.scrollElement,"transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = totalWidth;
			}
	
			
			translateX = this.currentX + "px";
			translateY = this.currentY + "px";
			// translateString = "translate3d("+this.currentX +"px,"+this.currentY+"px,0)";
			
		}
		
		else if (this.isHorizontal) {
		
		  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("horizonatal with " + this.vectorX);
		
			if (this.vectorX == "LEFT") this.currentX -= (decelMultiplier*this.speedX);
			else if (this.vectorX == "RIGHT") this.currentX += (decelMultiplier*this.speedX);
			
			translateString = "translate3d("+this.currentX+"px,0,0)";
			
			if (this.currentX > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = 0;
			}
			
			//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("width is: " + totalWidth);
			
			if (this.currentX < totalWidth ) {
				
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentX = totalWidth;
			}
			
			translateX = this.currentX + "px";
			
		}
		else if (this.isVertical) {
		  //if (gApplication.isLogging (gApplication.kLogComponents)) console.log("vertical");
			if (this.vectorY == "UP") this.currentY -= (decelMultiplier*this.speedY);
			else if (this.vectorY == "DOWN") this.currentY += (decelMultiplier*this.speedY);
			
			if (this.currentY > 0) {
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = 0;
			}
			
			if (this.currentY < totalHeight) {
				//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("height is: " + totalHeight);
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				// this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
				this.isAnimating = true;
				this.currentY = totalHeight;
			}
			
			translateY = this.currentY + "px";
			// translateString = "translate3d(0,"+this.currentY+"px,0)";
		}
	
	
		
		if (this.isVertical && this.isHorizontal) {
			this.scrollOffset.x = this.currentX;
			this.scrollOffset.y = this.currentY;
		}
		else if (this.isHorizontal) {
			this.scrollOffset.x = this.currentX;
		}
		else if (this.isVertical) {
			this.scrollOffset.y = this.currentY;
		}
		
		
		if (gApplication.nuBrowser.isAndroid) {
		
	    this.scrollElement.style.transitionDuration = "200ms";
  	  this.scrollElement.style.webkitTransitionDuration = "200ms";
  	  this.scrollElement.style.webkitTransitionTimingFunction = "linear";
  	  
      //this.scrollElement.style.webkitTransitionProperty = "-webkit-transform";
	    //this.scrollElement.style.webkitTransform = "translateX(" + translateX + ")";
	    // or
	    this.scrollElement.style.webkitTransitionProperty = "left";
	    this.scrollElement.style.left = translateX;
	  }
	  else {
	  
  	  neutrino.CSS.setTransitionTimingFunction (this.scrollElement, "ease-out");
		  neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
		  neutrino.CSS.setTransitionDuration (this.scrollElement, "500ms");
  		neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, translateZ);
		  // this.scrollElement.style.webkitTransform = translateString;

	  }

	}	
	
	// and last but not least, interpret this as a click, where appropriate
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.totalScroll);
	else {
		if (gApplication.isLogging (gApplication.kLogComponents)) console.log("triggering click!");
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.originalTarget.onclick);
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log(this.originalTarget.id);

    console.error ("swipe view defeating click dispatch");
    
	
    if (this.isTouchDevice ) {
  		try {
  			
  			var evt = document.createEvent("MouseEvents");
    		evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
    		var cb = this.originalTarget; 
    		var canceled = !cb.dispatchEvent(evt);
    		if(canceled) {
      		// A handler called preventDefault
      		if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("canceled");
    		} else {
      		// None of the handlers called preventDefault
      		if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("not canceled");
    		}
     		 			
  			
  			
  			//this.originalTarget.onclick();
  		}
  		catch(er) {
  			if (gApplication.isLogging (gApplication.kLogComponents)) console.log("NO ONCLICK");
  		}
		
    }
	
		//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("end triggering click!")
	
	}

};

neutrino.components.SwipeView.prototype.plotEvent = function(inEvent) {
	
	if (inEvent.touches) {		
		var ex = inEvent.touches[0].pageX;
		var ey = inEvent.touches[0].pageY;
	}
	else {
		var ex = inEvent.pageX;
		var ey = inEvent.pageY;
	}

	
	//if (gApplication.isLogging (gApplication.kLogComponents)) console.log("plotting " + ex + " " + ey);
	// we are just going 2x on the android tracking
	// for now, it helps with the slow rendering 
	if (gApplication.nuBrowser.isAndroid) {
    return { x: 2*ex, y: 2*ey};
	}
	else return { x: ex, y: ey};
	
	
	
};

neutrino.components.SwipeView.prototype.onBeforeInvisible = function () {
	
	neutrino.View.prototype.onBeforeInvisible.call (this);
	if (gApplication.isLogging (gApplication.kLogComponents)) console.log("SwipeView onBeforeInvisible");
	
	this.unbind();
	
};/**
*
* @license
* Copyright Â¬Â©2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.components.GalleryView");
neutrino.require ("neutrino.components.SwipeView");

// CONSTRUCTOR

neutrino.components.GalleryView = function () 
{

	neutrino.components.SwipeView.call (this);
	
if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("GalleryView.init()");

};
neutrino.inherits (neutrino.components.GalleryView, neutrino.components.SwipeView);
neutrino.exportSymbol('neutrino.components.GalleryView', neutrino.components.GalleryView);

neutrino.components.GalleryView.prototype.onLoaded = function () 
{
  neutrino.components.SwipeView.prototype.onLoaded.call (this);
	
	this.elementClassName = this.nuElement.getAttribute ("nu-element-class");
	
	if (this.elementClassName == null || this.elementClassName.length == 0)
	{
		this.elementClassName = "nu-element";
	}
	
}

neutrino.components.GalleryView.prototype.onDOMReady = function () 
{
  neutrino.components.SwipeView.prototype.onDOMReady.call (this);
	
	// let's determine how many elements we have
	this.panes = this.nuElement.querySelectorAll("." + this.elementClassName);
	this.currentPane = 0;
	this.paneWidth = this.panes[0].offsetWidth;
	this.paneHeight = this.panes[0].offsetHeight;
  this.scrollElement.style.width = ((this.panes.length) * this.paneWidth) + "px";  
	this.scrollElement.style.height = ((this.panes.length) * this.paneHeight) + "px"; 
	
	if (gApplication.isLogging (gApplication.kLogComponents)) console.log("INIT gallery view with " + this.panes.length);
	if (gApplication.isLogging (gApplication.kLogComponents)) console.log("pane width: " + this.paneWidth);
	if (gApplication.isLogging (gApplication.kLogComponents)) console.log("pane height: " + this.paneHeight);
	
	
	// nu-container
	
	
};


neutrino.components.GalleryView.prototype.onVisible = function() {
  
  neutrino.components.SwipeView.prototype.onVisible.call (this);
  
  this.currentPane = 0;
  this.currentX = 0;
  this.currentY = 0;
  this.scrollOffset.y = this.currentY;
  this.scrollOffset.x = this.currentX;
  var translateX = this.currentX + "px";
  var translateY = this.currentY + "px";
  
  neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, "0px", "0px");
  
  if (gApplication.isLogging (gApplication.kLogComponents)) console.log("******************GalleryView onVisible()");
  
  // this is dangerous -- who is setting up this.panes before onVisible() ?
  // Jason added check
  if (this.panes && this.isHorizontal)
  {
	  this.scrollElement.style.width = ((this.panes.length) * this.paneWidth) + "px";
  } else if (this.panes && this.isVertical) {
    this.scrollElement.style.height = ((this.panes.length) * this.paneHeight) + "px";
  }
  
  // Jason removed the stopgap setTimeout() here
  // as onDOMReady() does the business
	/*  
  var self = this;
  // this is a stop gap until we get a proper loaded callback for JSON
  setTimeout(function() {
    self.panes = self.element.querySelectorAll(".nu-element");
	  self.currentPane = 0;
	  self.paneWidth = self.panes[0].offsetWidth;
	  self.paneHeight = self.panes[0].offsetHeight;
    self.scrollElement.style.width = ((self.panes.length) * self.paneWidth) + "px";  
  }, 600);
	*/
  
}

neutrino.components.GalleryView.prototype.touchEnded = function(inEvent) {

  //alert("end");

  if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("GalleryView.touchEnded()");
  
  
  this.panes = this.nuElement.querySelectorAll("." + this.elementClassName);
	this.currentPane = 0;
	this.paneWidth = this.panes[0].offsetWidth;
	this.paneHeight = this.panes[0].offsetHeight;
	
  if (this.isHorizontal) {
    this.scrollElement.style.width = ((this.panes.length) * this.paneWidth) + "px";
  } else if (this.isVertical) { 
    this.scrollElement.style.height = ((this.panes.length) * this.paneHeight) + "px";
	}
  
	
	this.isTouching = false;
	this.unbind();
		
	if (this.hasMoved) 
	{
	
		if (gApplication.isLogging (gApplication.kLogComponents)) console.log("has moved");
		
		var translateX = "0";
		var translateY = "0";
		var translateZ = "0";
    var translateString;
    
		neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
		neutrino.CSS.setTransitionDuration (this.scrollElement, "400ms");
		neutrino.CSS.setTransitionTimingFunction (this.scrollElement, "ease-out");			
		this.isAnimating = true;
		
		var totalHeight = -0.9 * this.scrollElement.offsetHeight;
		var totalWidth = -0.9 * this.scrollElement.offsetWidth;
		
		if (gApplication.isLogging (gApplication.kLogComponents)) console.log("total width: " + totalWidth);
		
		if (this.isHorizontal) 
		{
		
			if (this.vectorX == "LEFT") this.currentX -= (6*this.speedX);
			else if (this.vectorX == "RIGHT") this.currentX += (6*this.speedX);
			
			translateString = "translate3d("+this.currentX+"px,0,0)";
			
			if (this.currentX > 0) 
			{
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				this.isAnimating = true;
				this.currentX = 0;
			}
			
			if (this.currentX < totalWidth ) 
			{	
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				this.isAnimating = true;
				this.currentX = totalWidth;
			}
			
			translateX = this.currentX + "px";
			
			if (gApplication.isLogging (gApplication.kLogComponents)) console.log("translating to " + this.currentX);
			
		}
		
		if (this.isVertical) 
		{
		  
			if (this.vectorY == "UP") this.currentY -= (6*this.speedY);
			else if (this.vectorY == "DOWN") this.currentY += (6*this.speedY);
			
			if (this.currentY > 0) 
			{
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				this.isAnimating = true;
				this.currentY = 0;
			}
			
			if (this.currentY < totalHeight) 
			{
		    neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
				this.isAnimating = true;
				this.currentY = totalHeight;
			}
			
			translateY = this.currentY + "px";

		}
		
		if (this.isHorizontal) {
			this.scrollOffset.x = this.currentX;
		}
		if (this.isVertical) {
			this.scrollOffset.y = this.currentY;
		}
		
		// override the calculated action with pane-based animation
		// calculate what pane we should be on based on translateX or translateY
		
    if (this.isHorizontal) 
    {
    
    
      var xAsInt = parseInt(translateX);
      if (gApplication.isLogging (gApplication.kLogComponents)) console.log("getting current pane for x:" + xAsInt + " and width: " + this.paneWidth);
    
      if (gApplication.isLogging (gApplication.kLogComponents)) console.log(xAsInt / this.paneWidth);
      
      this.currentPane = Math.round(xAsInt / this.paneWidth);

      // to do:
      // do we need to check again for overrun / underrun on total pane length?  
      
      this.currentX = this.paneWidth * this.currentPane;
      this.scrollOffset.x = this.currentX;
      translateX = this.currentX + "px";
      
      
      if (gApplication.isLogging (gApplication.kLogComponents)) console.log("new pane is " + this.currentPane + " setting translateX to " + translateX);
      
    
    }
    else if (this.isVertical) 
    {
    
      var yAsInt = parseInt(translateY);
      if (gApplication.isLogging (gApplication.kLogComponents)) console.log("getting current pane for y:" + yAsInt + " and height: " + this.paneHeight);
    
      if (gApplication.isLogging (gApplication.kLogComponents)) console.log(yAsInt / this.paneHeight);
      
      this.currentPane = Math.round(yAsInt / this.paneHeight);

      // to do:
      // do we need to check again for overrun / underrun on total pane height?  
      
      this.currentY = this.paneHeight * this.currentPane;
      this.scrollOffset.y = this.currentY;
      translateY = this.currentY + "px";
      
      
      if (gApplication.isLogging (gApplication.kLogComponents)) console.log("new pane is " + this.currentPane + " setting translateY to " + translateY);
      
    
    }

		neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, translateZ);
		// this.scrollElement.style.webkitTransform = translateString;
	
	}	
	
	// and last but not least, interpret this as a click, where appropriate
	else {
		console.error ("Gallery view defeating click dispatch");
    
    if (this.isTouchDevice ) {
  		try {
  			
  			var evt = document.createEvent("MouseEvents");
    		evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
    		var cb = this.originalTarget; 
    		var canceled = !cb.dispatchEvent(evt);
    		if(canceled) {
      		// A handler called preventDefault
      		if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("canceled");
    		} else {
      		// None of the handlers called preventDefault
      		if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("not canceled");
    		}
     		 			
  			
  			
  			//this.originalTarget.onclick();
  		}
  		catch(er) {
  			if (gApplication.isLogging (gApplication.kLogComponents)) console.log("NO ONCLICK");
  		}
		
    }
	
	}
		
	
};

// will return true is there was a transition, false if we are at the end
neutrino.components.GalleryView.prototype.nextPane = function() {

  var transitioned = false;
  
  if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("GalleryView.nextPane()");
	
	this.isTouching = false;
	this.unbind();
	
	var translateX = "0";
	var translateY = "0";
	var translateZ = "0";
  var translateString;
  

  translateX = this.currentX + "px";
	translateY = this.currentY + "px";
	
	neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
	neutrino.CSS.setTransitionDuration (this.scrollElement, "400ms");
	neutrino.CSS.setTransitionTimingFunction (this.scrollElement, "ease-out");			
	this.isAnimating = true;
	
	var xAsInt = this.currentX;
	var yAsInt = this.currentY;

  if(this.Horizontal) {	
    if (this.currentPane > (this.panes.length-1) * -1) {
      this.currentPane --;
      transitioned = true;
    }
    else { // do we just want to loop?
      this.currentPane = 0;
    }
    if (gApplication.isLogging (gApplication.kLogComponents)) console.log("transitioning with " + this.currentPane + " of " + this.panes.length);
	} else if (this.isVertical) {
	  if (this.currentPane > (this.panes.length - 1) * -1) {
      this.currentPane --;
      transitioned = true;
    }
    else { // do we just want to loop?
      this.currentPane = 0;
    }
    if (gApplication.isLogging (gApplication.kLogComponents)) console.log("transitioning with " + this.currentPane + " of " + this.panes.length);
	}
				
  if (this.isHorizontal) 
  {

    this.currentX = this.paneWidth * this.currentPane;
    this.scrollOffset.x = this.currentX;
    translateX = this.currentX + "px";

  }
  else if (this.isVertical) 
	{
	  
	  this.currentY = this.paneHeight * this.currentPane;
    this.scrollOffset.y = this.currentY;
    translateY = this.currentY + "px";
    
	}	
	
	neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, translateZ);  
  
  return transitioned;

};


// will return true is there was a transition, false if we are at the end
neutrino.components.GalleryView.prototype.prevPane = function() {

  var transitioned = false;
  
  if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("GalleryView.nextPane()");
	
	this.isTouching = false;
	this.unbind();
	
	var translateX = "0";
	var translateY = "0";
	var translateZ = "0";
  var translateString;
  
  translateX = this.currentX + "px";
	translateY = this.currentY + "px";
	
	neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
	neutrino.CSS.setTransitionDuration (this.scrollElement, "400ms");
	neutrino.CSS.setTransitionTimingFunction (this.scrollElement, "ease-out");			
	this.isAnimating = true;
	
	var xAsInt = this.currentX;
	var yAsInt = this.currentY;
	
	if (this.currentPane < 0) {
    this.currentPane ++;
    transitioned = true;
	}
	else { // do we just want to loop?
    if (this.Horizontal) {
      this.currentPane = (this.panes.length-1) * -1;
    } else if (this.Vertical) {
      this.currentPane = (this.panges.height-1) * -1;
    }
	}
	
	
			
  if (this.isHorizontal) 
  {
    if (gApplication.isLogging (gApplication.kLogComponents)) console.log("transitioning with " + this.currentPane + " of " + this.panes.length);
    this.currentX = this.paneWidth * this.currentPane;
    this.scrollOffset.x = this.currentX;
    translateX = this.currentX + "px";

  }		
	else if (this.isVertical) 
  {
    if (gApplication.isLogging (gApplication.kLogComponents)) console.log("transitioning with " + this.currentPane + " of " + this.panes.length);
    this.currentY = this.paneHeight * this.currentPane;
    this.scrollOffset.y = this.currentY;
    translateY = this.currentY + "px";

  }
	neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, translateZ);  
  
  return transitioned;

};

neutrino.components.GalleryView.prototype.gotoPane = function(inPaneNumber) {

  var transitioned = false;
  
  if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("GalleryView.gotoPane() with " + inPaneNumber);
	
	this.isTouching = false;
	this.unbind();
	
	var translateX = "0";
	var translateY = "0";
	var translateZ = "0";
  var translateString;
  
  translateX = this.currentX + "px";
	translateY = this.currentY + "px";
	
	neutrino.CSS.setTransitionProperty (this.scrollElement, "transform");
	neutrino.CSS.setTransitionDuration (this.scrollElement, "400ms");
	neutrino.CSS.setTransitionTimingFunction (this.scrollElement, "ease-out");			
	this.isAnimating = true;
	
	var xAsInt = this.currentX;
	var yAsInt = this.currentY;
	
	this.currentPane = -1 * inPaneNumber;
	// check for overrun?
			
  if (this.isHorizontal) 
  {
    if (gApplication.isLogging (gApplication.kLogComponents)) console.log("transitioning with " + this.currentPane + " of " + this.panes.length);
    this.currentX = this.paneWidth * this.currentPane;
    this.scrollOffset.x = this.currentX;
    translateX = this.currentX + "px";

  }		
	else if (this.isVertical) 
  {
    if (gApplication.isLogging (gApplication.kLogComponents)) console.log("transitioning with " + this.currentPane + " of " + this.panes.length);
    this.currentY = this.paneHeight * this.currentPane;
    this.scrollOffset.y = this.currentY;
    translateY = this.currentY + "px";
  }
  
	neutrino.CSS.setTranslate3D (this.scrollElement, translateX, translateY, translateZ);  
  
  return transitioned;

};

neutrino.provide ("neutrino.components.MediaView");

neutrino.require ("neutrino.View");

neutrino.components.MediaView = function ()
{
	neutrino.View.call (this);
	
	this.events = 
	[
		"canplay",
		"canplaythrough",
		"ended",
		"loadedmetadata",
		"pause",
		"play",
		"progress",
		"timeupdate"
	];
	
};

neutrino.inherits (neutrino.components.MediaView, neutrino.View);

// VIEW OVERRIDES

neutrino.components.MediaView.prototype.onDOMReady = function ()
{
	// console.log ("neutrino.components.MediaView.onDOMReady()");
	neutrino.View.prototype.onDOMReady.call (this);
	
	this.mediaElement = this.nuElement.querySelector ("video,audio");
	
	if (this.mediaElement)
	{
		// can't cleanly decide whether to add autoplay attribute in markup, so...
		if (this.nuParams.autoplay && (this.nuParams.autoplay == "true"))
		{
			this.mediaElement.setAttribute ("autoplay", "true");
		}
		
		var	self = this;
		
		// we COULD do this in markup, but since there are 7 of them...
		for (var i = 0; i < this.events.length; i++)
		{
			this.mediaElement.addEventListener
			(
				this.events [i],
				function (inEvent)
				{
					self.onMediaEvent (inEvent);
				},
				false
			);
		}
	}
	
	// first init, or new source, results in reset status
	this.mediaState = new Object ();
	this.mediaState.loadedmetadata = false;
	this.mediaState.playing = false;
	this.mediaState.ended = false;
	this.mediaState.canplay = false;
	this.mediaState.canplaythrough = false;
	
	this.mediaState.progress = new Object ();
	this.mediaState.progress.percent = 0;
	this.mediaState.progress.ratio = 0;
	this.mediaState.progress.hours = 0;
	this.mediaState.progress.minutes = 0;
	this.mediaState.progress.seconds = 0;
	this.mediaState.progress.milliseconds = 0;

	this.mediaState.play = new Object ();
	this.mediaState.play.percent = 0;
	this.mediaState.play.ratio = 0;
	this.mediaState.play.hours = 0;
	this.mediaState.play.minutes = 0;
	this.mediaState.play.seconds = 0;
	this.mediaState.play.milliseconds = 0;

	this.mediaState.remaining = new Object ();
	this.mediaState.remaining.hours = 0;
	this.mediaState.remaining.minutes = 0;
	this.mediaState.remaining.seconds = 0;
	this.mediaState.remaining.milliseconds = 0;

	this.mediaState.duration = new Object ();
	this.mediaState.duration.hours = 0;
	this.mediaState.duration.minutes = 0;
	this.mediaState.duration.seconds = 0;
	this.mediaState.duration.milliseconds = 0;

}

// the markup takes lists only, so if someone set a single source, convert it
neutrino.components.MediaView.prototype.setParams = function (inParams)
{
	neutrino.View.prototype.setParams.call (this, inParams);
	
	// console.log ("MediaView.setParams()");
	// console.log (this.nuParams);
	
	if (typeof (this.nuParams.sources) == "object" && typeof (this.nuParams.sources.length) == "number")
	{
		// ok then
	}
	else
	{	
		var	source = this.nuParams.source;
		
		if (typeof (source) == "string" && source.length > 0)
		{
			var	sources = new Array ();
			sources.push (source);
			
			this.nuParams.sources = sources;
			this.nuJanxContext.put ("params.sources", sources);
		}
	}
	
}

// API

neutrino.components.MediaView.prototype.play = function ()
{
	if (this.mediaElement)
	{
		if (! this.mediaState.playing)
		{
			this.mediaElement.play ();
		}
	}
	else
	{
		console.error ("media element is not present");
	}
}

neutrino.components.MediaView.prototype.pause = function ()
{
	if (this.mediaElement)
	{
		this.mediaElement.pause ();
	}
	else
	{
		console.error ("media element is not present");
	}
}

// fraction runs 0..1
neutrino.components.MediaView.prototype.setPositionFromFraction = function (inFraction)
{
	if (this.mediaElement)
	{
		if (typeof (this.mediaElement.duration) == "number")
		{
			if (inFraction >= 0 && inFraction <= 1)
			{
				this.mediaElement.currentTime = inFraction * this.mediaElement.duration;
			}
			else
			{
				console.error ("setPositionFromFraction() called with bad fraction: " + inFraction);
			}
		}
		else
		{
			console.error ("setPositionFromFraction() called before duration known");
		}
	}
	else
	{
		console.error ("setPositionFromFraction() called with no media element");
	}
}

// percent runs 0..100
neutrino.components.MediaView.prototype.setPositionFromPercent = function (inPercent)
{
	if (this.mediaElement)
	{
		if (typeof (this.mediaElement.duration) == "number")
		{
			if (inPercent >= 0 && inPercent <= 100)
			{
				var	fraction = inPercent / 100;
				
				this.mediaElement.currentTime = fraction * this.mediaElement.duration;
			}
			else
			{
				console.error ("setPositionFromPercent() called with bad percent: " + inPercent);
			}
		}
		else
		{
			console.error ("setPositionFromPercent() called before duration known");
		}
	}
	else
	{
		console.error ("setPositionFromPercent() called with no media element");
	}
}

// CALLBACKS

neutrino.components.MediaView.prototype.onMediaEvent = function (inEvent)
{
	// console.log ("neutrino.components.MediaView.onMediaEvent() with type " + inEvent.type);
	// console.log (inEvent);
	
	// we keep our own status around to account for browser irregularities, etc
	// and so clients always have the current state available
	this.updateState (inEvent);
	
	// find the media clients with this view as their server
	// TODO may want to cache this list during playback?
	var	clients = document.querySelectorAll ("[nu-media-view=" + this.nuKey + "]");
	
	for (var i = 0; i < clients.length; i++)
	{
		var	sendEvent = true;
		
		var	listenerEvents = clients [i].getAttribute ("nu-media-events");
		
		if (listenerEvents && listenerEvents.length)
		{
			sendEvent = false;
			
			var	listenerEventElements = listenerEvents.split (',');
			
			for (var j = 0; j < listenerEventElements.length; j++)
			{
				if (inEvent.type == neutrino.Utils.stripSpaces (listenerEventElements [j]))
				{
					sendEvent = true;
					break;
				}
			}
		}
		else
		{
			// the default is "receive all events"
		}
		
		if (sendEvent)
		{
			var	clientView = neutrino.DOM.getData (clients [i], "view");
			
			if (clientView)
			{
				clientView.onMediaEvent (inEvent, this.mediaState);
			}
		}
	}
}

// PRIVATE METHODS

neutrino.components.MediaView.prototype.convertTime = function (inTime, outConverted)
{
	var	fullSeconds = Math.floor (inTime);
	
	outConverted.milliseconds = Math.floor ((inTime - fullSeconds) * 1000);
	outConverted.seconds = fullSeconds % 60;
	outConverted.minutes = Math.floor ((fullSeconds / 60) % 60);
	outConverted.hours = Math.floor (fullSeconds / 3600);
}

neutrino.components.MediaView.prototype.updateState = function (inEvent)
{
	if (inEvent.type == "loadedmetadata")
	{
		this.mediaState.loadedmetadata = true;
		
		this.mediaState.duration.value = this.mediaElement.duration;
		this.convertTime (this.mediaElement.duration, this.mediaState.duration);
	}
	else
	if (inEvent.type == "canplay")
	{
		this.mediaState.canplay = true;
	}
	else
	if (inEvent.type == "canplaythrough")
	{
		this.mediaState.canplaythrough = true;
	}
	else
	if (inEvent.type == "progress")
	{
		// careful, some browsers give us progress without duration, sigh
		if (typeof (this.mediaElement.duration) == "number" && !isNaN (this.mediaElement.duration))
		{
			this.mediaState.progress.value = this.mediaElement.currentTime;

			var	bufferedEnd = 0;
			
			// careful again, can get issues with end(0) here :-\
			try
			{
				bufferedEnd = this.mediaElement.buffered.end (0);
			}
			catch (inError)
			{
				this.mediaState.progress.percent = 0;
			}

			// percent is 0..100
			this.mediaState.progress.percent = bufferedEnd / this.mediaElement.duration;
			this.mediaState.progress.percent = Math.round (this.mediaState.progress.percent * 100);
			
			// ratio is 0..1 in 100ths
			this.mediaState.progress.ratio = this.mediaState.progress.percent / 100;
			
			// calculate real time
			this.convertTime (bufferedEnd, this.mediaState.progress);
		}
	}
	else
	if (inEvent.type == "play")
	{
		this.mediaState.playing = true;
		this.mediaState.paused = false;
		this.mediaState.ended = false;
	}
	else
	if (inEvent.type == "pause")
	{
		this.mediaState.playing = false;
		this.mediaState.paused = true;
	}
	else
	if (inEvent.type == "ended")
	{
		this.mediaState.playing = false;
		this.mediaState.ended = true;
		
		if (! this.mediaState.paused)
		{
			// ok so we didn't get a pause event prior to the ended event
			// which means that the next time we call play() we won't get a play event
			// known Safari problem
			// solution is to call pause() ourselves
			this.mediaElement.pause ();
		}
	}
	else
	if (inEvent.type == "timeupdate")
	{
		// careful, some browsers give us progress without duration, sigh
		if (typeof (this.mediaElement.duration) == "number" && !isNaN (this.mediaElement.duration))
		{
			this.mediaState.play.value = this.mediaElement.currentTime;

			// percent is 0..100
			this.mediaState.play.percent = this.mediaElement.currentTime / this.mediaElement.duration;
			this.mediaState.play.percent = Math.round (this.mediaState.play.percent * 100);

			// ratio is 0..1 in 100ths
			this.mediaState.play.ratio = this.mediaState.play.percent / 100;
			
			// calculate real time
			this.convertTime (this.mediaElement.currentTime, this.mediaState.play);
			
			this.mediaState.remaining.value = this.mediaElement.duration - this.mediaElement.currentTime;

			// percent is 0..100
			this.mediaState.remaining.percent = this.mediaState.remaining.value / this.mediaElement.duration;
			this.mediaState.remaining.percent = Math.round (this.mediaState.remaining.percent * 100);
			
			// ratio is 0..1 in 100ths
			this.mediaState.remaining.ratio = this.mediaState.remaining.percent / 100;

			// calculate real time
			this.convertTime (this.mediaState.remaining.value, this.mediaState.remaining);
		}
	}
}


neutrino.provide ("neutrino.components.MediaClientView");

neutrino.require ("neutrino.View");

neutrino.components.MediaClientView = function ()
{
	neutrino.View.call (this);
	
	this.treeWalker = new neutrino.janx.JanxTreeWalker ();
};

neutrino.inherits (neutrino.components.MediaClientView, neutrino.View);

// VIEW OVERRIDES

neutrino.components.MediaClientView.prototype.onDOMReady = function ()
{
	neutrino.View.prototype.onDOMReady.call (this);

	// console.log ("neutrino.components.MediaClientView.onDOMReady()");

	// protect against the situation where progress or timeupdate events
	// arrive in between the Janx run and the onDOMReady() callback
	this.inDynamics = false;
}

// EVENT HANDLERS

neutrino.components.MediaClientView.prototype.onMediaEvent = function (inEvent, inMediaState)
{
	// console.log ("neutrino.components.MediaClientView " + this.nuKey + " with type " + inEvent.type);

	var	params = new Object ();
	params.event = inEvent;
	params.mediastate = inMediaState;
	
	this.setParams (params);
	
	if (this.isVisible ())
	{
		// protect against the situation where progress or timeupdate events
		// arrive in between the Janx run and the onDOMReady() callback
		if (! this.inDynamics)
		{
			this.inDynamics = true;
			
			this.refresh ();
		}
	}
}

neutrino.components.MediaClientView.prototype.onMouseDown = function (inEvent)
{
	this.mouseDown = true;

	var	width = parseInt (window.getComputedStyle (this.nuElement).width);
	
	if (inEvent.changedTouches)
	{
		this.setPositionFromFraction ((inEvent.changedTouches [0].pageX - inEvent.target.offsetLeft) / width);
	}
	else
	{
		this.setPositionFromFraction (inEvent.offsetX / width);
	}
}

neutrino.components.MediaClientView.prototype.onMouseMove = function (inEvent)
{
	if (this.mouseDown)
	{
		var	width = parseInt (window.getComputedStyle (this.nuElement).width);
	
		if (inEvent.changedTouches)
		{
			this.setPositionFromFraction ((inEvent.changedTouches [0].pageX - inEvent.target.offsetLeft) / width);
		}
		else
		{
			this.setPositionFromFraction (inEvent.offsetX / width);
		}
	}
}

neutrino.components.MediaClientView.prototype.onMouseUp = function (inEvent)
{
	this.mouseDown = false;
}

// API

neutrino.components.MediaClientView.prototype.play = function ()
{
	// console.log ("neutrino.components.MediaClientView.play()");

	var	mediaView = gApplication.getView (this.nuElement.getAttribute ("nu-media-view"));
	
	if (mediaView)
	{
		mediaView.play ();
	}
	else
	{
		console.error ("play() called with no media server view");
	}
}

neutrino.components.MediaClientView.prototype.pause = function ()
{
	// console.log ("neutrino.components.MediaClientView.pause()");

	var	mediaView = gApplication.getView (this.nuElement.getAttribute ("nu-media-view"));
	
	if (mediaView)
	{
		mediaView.pause ();
	}
	else
	{
		console.error ("pause() called with no media server view");
	}
}

// fraction runs 0..1
neutrino.components.MediaClientView.prototype.setPositionFromFraction = function (inFraction)
{
	// console.log ("neutrino.components.MediaClientView.setPositionFromFraction() " + inFraction);

	var	mediaView = gApplication.getView (this.nuElement.getAttribute ("nu-media-view"));
	
	if (mediaView)
	{
		mediaView.setPositionFromFraction (inFraction);
	}
	else
	{
		console.error ("MediaClientView.setPositionFromFraction() called with no media server view");
	}
}

// percent runs 0..100
neutrino.components.MediaClientView.prototype.setPositionFromPercent = function (inPercent)
{
	// console.log ("neutrino.components.MediaClientView.setPositionFromPercent() " + inPercent);

	var	mediaView = gApplication.getView (this.nuElement.getAttribute ("nu-media-view"));
	
	if (mediaView)
	{
		mediaView.setPositionFromPercent (inPercent);
	}
	else
	{
		console.error ("MediaClientView.setPositionFromPercent() called with no media server view");
	}
}

/**
*
* @license
* Copyright © 2011, 2012 Subatomic Systems, Inc.  All rights reserved.
*
**/

neutrino.provide ("neutrino.components.TabView");

neutrino.require ("neutrino.components.RadioView");

// CONSTRUCTOR

neutrino.components.TabView = function ()
{
  neutrino.components.RadioView.call (this);

if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("TabView()");

	this.subViewAttribute = "nu-tab-view";
}
neutrino.inherits (neutrino.components.TabView, neutrino.components.RadioView);
neutrino.exportSymbol('neutrino.components.TabView', neutrino.components.TabView);


// NURADIOVIEW OVERRIDES

neutrino.components.TabView.prototype.select = function (inElement)
{
	neutrino.components.RadioView.prototype.select.call (this, inElement);

	var	viewKey = inElement.getAttribute ("nu-tab-view");
	
	gApplication.showView (viewKey);
}

neutrino.components.TabView.prototype.unselect = function (inElement)
{
	neutrino.components.RadioView.prototype.unselect.call (this, inElement);

	var	viewKey = inElement.getAttribute ("nu-tab-view");
	
	gApplication.hideView (viewKey);
}

/**
*
* @license
* Copyright Â© 2011, 2012, Subatomic Systems, Inc.  All rights reserved.
*
**/

/*

classes used

.nu-text-field -> the input field
.nu-text-characters -> how many characters are in the field
.nu-text-remaining -> how many characters remain

*/

neutrino.provide ("neutrino.components.TextView");
neutrino.require ("neutrino.View");

neutrino.components.TextView = function ()
{
	neutrino.View.call (this);

if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("TextView()");
};
neutrino.inherits (neutrino.components.TextView, neutrino.View);
neutrino.exportSymbol('neutrino.components.TextView', neutrino.components.TextView);


neutrino.components.TextView.prototype.onDOMReady = function ()
{
  neutrino.View.prototype.onDOMReady.call (this);
  
// if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("TextView.onDOMReady()");

	// find our goodies
	this.textField = this.nuElement.querySelector (".nu-text-field");
	this.textLength = this.nuElement.querySelector (".nu-text-length");
	this.textRemaining = this.nuElement.querySelector (".nu-text-remaining");
	this.clearButton = this.nuElement.querySelector (".nu-text-clear");
	
	this.nuMaxLength = this.textField.getAttribute ("nu-max-length");
	
	if (this.nuMaxLength && this.nuMaxLength.length)
	{
		this.nuMaxLength = parseInt (this.nuMaxLength);
	}
	
	// update the indicators
	this.onKeyUp ();
	
};

// NU-CLICK

neutrino.components.TextView.prototype.clearText = function ()
{
	var	self = this;
	
	this.textField.value = "";
	this.updateIndicators ();
};

// PRIVATE

neutrino.components.TextView.prototype.onKeyUp = function ()
{
// if (gApplication.isLogging (gApplication.kLogComponents)) console.log ("TextView.updateIndicators()");

	var	text = this.textField.value;

	var	length = 0;
	
	if (text)
	{
		length = parseInt (text.length);
	}
	
	if (this.textLength)
	{
		this.textLength.innerHTML = length;
	}
	
	if (this.textRemaining && this.nuMaxLength)
	{
		this.textRemaining.innerHTML = "" + (this.nuMaxLength - length);
	}
	
	if (length)
	{
		neutrino.DOM.removeClass (this.clearButton, "nu-invisible");
	}
	else
	{
		neutrino.DOM.addClass (this.clearButton, "nu-invisible");
	}
};

/*

OVERVIEW:

  The neutrino.components.media object is a package of components all centered around a MediaView (neutrino.components.media.MediaView).  This component is where the media element itself will live, all other components interact with the MediaView.  To hook up other media components to control or show feedback from the MediaView all you have to do is supply the MediaView's unique nu-view-key ID.  A big plus to this way of working is that the components do not even have to be in the same NuPage to work (although of course they do have to both exist in the dom at the same time for interactions to function).
  
  ///////////////////////////////////////////////////////  
  MediaView (neutrino.components.media.MediaView):
  ///////////////////////////////////////////////////////
  
    The core of the media package is the MediaView component.  A simple example of the markup looks like this:
      <div nu-view-key="myMediaView" nu-component="neutrino.components.media.MediaView" nu-media-src="my-video.mp4" nu-view="mediaview:" nu-media-type="video" class="media-window"></div>
    
    You can also load multiple source files for handling cross-browser compatability like this:
      <div nu-view-key="myMediaView" nu-component="neutrino.components.media.MediaView" nu-view="mediaview:" nu-media-type="video" class="media-window" autoplay>
        <source src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
        <source src="http://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm">
        <source src="http://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg">
      </div>
      
    If you're not loading an initial video you don't even have to set the source (with this setup you can use the LoadNewContentButtonView to load the MediaView with new content to play):
      <div nu-view-key="myMediaView" nu-component="neutrino.components.media.MediaView" nu-view="mediaview:" nu-media-type="video" class="media-view"></div>
      
      styling:
        .media-view {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 480px;
          height: 270px;
          background-color: rgba(0,0,0,.4);
        }
      
    The media tag that gets created and injected into this container is set to width: 100%; and height: 100%, so it will inherit the sizing you give the MediaView's nuElement.
    
  ///////////////////////////////////////////////////////
  PlaybackToggleView (neutrino.components.media.PlaybackToggleView):
  ///////////////////////////////////////////////////////
  
    A simple component for toggling the playback of a MediaView instance.  The instances nuElement will get the class name 'nu-media-playing' when in play mode.  Example:
    
    markup:
      <div nu-component="neutrino.components.media.PlaybackToggleView" nu-view="playbacktoggle:" class="playback-toggle" nu-media-view-id="myMediaView">
        <span class="play">Play</span>
        <span class="pause">Pause</span>
      </div>
      
    styling:
      .playback-toggle {
        position: absolute;
        top: 10px;
        left: 520px;
        width: 80px;
        height: 40px;
        font-size: 22px;
        line-height: 38px;
        text-align: center;
        background-color: rgba(0,200,0,.5);
      }
        .playback-toggle .pause { display: none; }
        .playback-toggle.nu-media-playing .pause { display: block; }
        .playback-toggle.nu-media-playing .play { display: none; }
    

  ///////////////////////////////////////////////////////
  TimelineView (neutrino.components.media.TimelineView):
  ///////////////////////////////////////////////////////
  
    A component that can control scrubbing/jumping to a new position in a MediaView instance.  Also gives visual feedback on how much of the media element is cached and where in the timeline the media is currently.  The current playback position as a percentage (say 10 minutes into a 40 minute media file) will set the 'nu-media-timeline-position' elements width to 25 percent of it's container (if the TimelineView's nuElement is 200px, then the 'nu-media-timeline-position' will have it's width set to 50px).  Same process for the media's caching.
    A child element with the class name 'nu-media-timeline-position' is required, a child element with the class name 'nu-media-timeline-cached' is optional.
    
    markup:
      <div nu-component="neutrino.components.media.TimelineView" nu-view="timeline:" class="timeline" nu-media-view-id="myMediaView">
        <div class="nu-media-timeline-cached"></div>
        <div class="nu-media-timeline-position"></div>
      </div>

    styling:
      .timeline {
        position: absolute;
        top: 70px;
        left: 520px;
        width: 400px;
        height: 40px;
        border: 1px solid black;
      }
      
        .nu-media-timeline-position{
          position: absolute;
          width: 100px;
          height: 100%;
          background-color: red;
        }
        
        .nu-media-timeline-cached{
          position: absolute;
          width: 100px;
          height: 100%;
          background-color: rgba(0,0,0,.1);
        }
        
        
  ///////////////////////////////////////////////////////
  CurrentTimeView (neutrino.components.media.CurrentTimeView):
  ///////////////////////////////////////////////////////
  
    Gives the current time of the MediaView's media tag (5:30, 5:31, etc.). Example:
    
    markup:
      <div nu-component="neutrino.components.media.CurrentTimeView" nu-view="currenttime:" class="current-time" nu-media-view-id="myMediaView"></div>
    
    styling:
      .current-time{
        position: absolute;
        top: 130px;
        left: 520px;
        width: 100px;
        height: 40px;
        font-size: 22px;
        line-height: 38px;
        text-align: center;
        background-color: rgba(0,0,200,.5);
      }
      
      
  ///////////////////////////////////////////////////////
  RemainingTimeView (neutrino.components.media.RemainingTimeView):
  ///////////////////////////////////////////////////////
  
    Gives the remaing time of the MediaView's media tag (5:30, 5:31, etc.). Example:
    
    markup:
      <div nu-component="neutrino.components.media.RemainingTimeView" nu-view="remainingtime:" class="remaining-time" nu-media-view-id="myMediaView"></div>
    
    styling:
      .remaining-time{
        position: absolute;
        top: 190px;
        left: 520px;
        width: 100px;
        height: 40px;
        font-size: 22px;
        line-height: 38px;
        text-align: center;
        background-color: rgba(0,100,0,.5);
      }
      
      
  ///////////////////////////////////////////////////////
  LoadNewContentButtonView (neutrino.components.media.LoadNewContentButtonView):
  ///////////////////////////////////////////////////////
  
    Loads new content into the MediaView and autoplays.  You can either supply the src for the media file as an attribute, or with a number of <source> tags (formatted to html5 spec).  Example:
  
    markup:
      <div nu-component="neutrino.components.media.LoadNewContentButtonView" nu-view="loadnewcontent:" class="load-new-content-button" nu-media-view-id="myMediaView">
        Play Bunny Vid
        <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4">
        <source src="http://clips.vorwaerts-gmbh.de/VfE.webM" type="video/webm">
        <source src="http://clips.vorwaerts-gmbh.de/VfE.ogv" type="video/ogg">
      </div>

    styling:
      .load-new-content-button{
        position: absolute;
        top: 250px;
        left: 520px;
        width: 160px;
        height: 40px;
        font-size: 16px;
        line-height: 38px;
        text-align: center;
        background-color: rgba(100,0,0,.5);
      } 
      
      
  ///////////////////////////////////////////////////////
  LoadingIndicatorView (neutrino.components.media.LoadingIndicatorView):
  ///////////////////////////////////////////////////////
  
    A component to handle loading indication.  When the MediaView is loading and can not yet play back it's content, this components view gets the class "nu-media-load-active".
    
      markup:
        <div nu-component="neutrino.components.media.LoadingIndicatorView" nu-view="medialoadingindicator:" class="loading-indicator" nu-media-view-id="myMediaView">Loading</div>
        
      styling:
        .loading-indicator{
          position: absolute;
          top: 280px;
          left: 10px;
          width: 160px;
          height: 40px;
          font-size: 50px;
          line-height: 50px;
          font-weight: bold;
          color: red;
          display:none;
        }
          .loading-indicator.nu-media-load-active { display: block; }

/* --------------------------------------------------------------------- Media View */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.MediaView");
neutrino.require ("neutrino.View");

neutrino.components.media.MediaView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.MediaView, neutrino.View);


neutrino.components.media.MediaView.prototype.delegates = [];
neutrino.components.media.MediaView.prototype.playbackToggleObjects = [];
neutrino.components.media.MediaView.prototype.timelineObjects = [];
neutrino.components.media.MediaView.prototype.currentTimeObjects = [];
neutrino.components.media.MediaView.prototype.remainingTimeObjects = [];
neutrino.components.media.MediaView.prototype.loadingIndicatorObjects = [];
neutrino.components.media.MediaView.prototype.autoplayModeIsActive = false;
neutrino.components.media.MediaView.prototype.mediaFirstPlayingEventHasFired = false;
neutrino.components.media.MediaView.prototype.cachingEventTimeout = null;
neutrino.components.media.MediaView.prototype.srcIsSet = false;


// Implementation Methods

neutrino.components.media.MediaView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	
	this.setup();
};

neutrino.components.media.MediaView.prototype.onDOMReady = function() {

  // call our superclass
	neutrino.View.prototype.onDOMReady.call (this);
  //console.log(this.nuElement.querySelector("test"));
};

neutrino.components.media.MediaView.prototype.onVisible = function() {
  // call our superclass
	neutrino.View.prototype.onVisible.call (this);
	
};

neutrino.components.media.MediaView.prototype.onInvisible = function() {

  // call our superclass
	neutrino.View.prototype.onInvisible.call (this);
  
};

neutrino.components.media.MediaView.prototype.handleEvent = function(e) {
  var self = this;
  if(e.currentTarget == this.mediaElement){
    this.mediaEvent(e);
  }
};

neutrino.components.media.MediaView.prototype.setup = function() {
  var self = this;
  this.isMobile = gApplication.nuBrowser.isMobile;
  setTimeout(function(){ self.createMediaElement(); }, 0);
};

neutrino.components.media.MediaView.prototype.addDelegate = function(newDelegate) {
  var alreadyDelegated = false;
  for(var x = 0; x < this.delegates.length; x++){
    if(this.delegates[x] == newDelegate){ alreadyDelegated = true; }
  }
  if(!alreadyDelegated){
    this.delegates.push(newDelegate);
  }
};

neutrino.components.media.MediaView.prototype.removeDelegate = function(newDelegate) {
  var delegateIndex = null;
  for(var x = 0; x < this.delegates.length; x++){
    if(this.delegates[x] == newDelegate){ delegateIndex = x; }
  }
  if(delegateIndex !== null){
    this.delegates.splice(delegateIndex, 1);
  }
};

neutrino.components.media.MediaView.prototype.loadNewContent = function(config) {
  this.reset();
  this.createMediaElement(config);
};

neutrino.components.media.MediaView.prototype.reset = function() {
  clearTimeout(this.cachingEventTimeout);
  this.removeMediaElementEventListeners();
  this.mediaElement.parentNode.removeChild(this.mediaElement);
  var x = 0;
  for(x = 0; x < this.playbackToggleObjects.length; x++){
    this.playbackToggleObjects[x].reset();
  }
  for(x = 0; x < this.timelineObjects.length; x++){
    this.timelineObjects[x].reset();
  }
  for(x = 0; x < this.currentTimeObjects.length; x++){
    this.currentTimeObjects[x].reset();
  }
  for(x = 0; x < this.remainingTimeObjects.length; x++){
    this.remainingTimeObjects[x].reset();
  }
};

neutrino.components.media.MediaView.prototype.createMediaElement = function(config) {

  var elementType = this.nuElement.getAttribute("nu-media-type");
  
  this.mediaFirstPlayingEventHasFired = false;
  this.srcIsSet = false;

  if(elementType == "audio"){
    this.mediaElement = document.createElement("audio");
  }
  else{
    this.mediaElement = document.createElement("video");
  }
  this.mediaElement.setAttribute("style","width: 100%; height: 100%;");
  
  if(this.nuElement.hasAttribute("controls")){
    this.mediaElement.controls = "true";
  }
  
  if(config){
    if(config.srcElements.length > 0){
      for(var x = 0; x < config.srcElements.length; x++){
        this.mediaElement.appendChild(config.srcElements[x]);
      }
      this.srcIsSet = true;
    }
    else if(config.srcAttribute){
      this.mediaElement.setAttribute("src",config.srcAttribute);
      this.srcIsSet = true;
    }
  }
  else{
    var sourceNodes = this.nuElement.querySelectorAll("source");
    if(sourceNodes.length > 0){
      for(var x = 0; x < sourceNodes.length; x++){
        this.mediaElement.appendChild(sourceNodes[x]);
      }
      this.srcIsSet = true;
    }
    else if(this.nuElement.hasAttribute("nu-media-src")){
      this.mediaElement.setAttribute("src",this.nuElement.getAttribute("nu-media-src"));
      this.srcIsSet = true;
    }
  }
  
  this.nuElement.appendChild(this.mediaElement);
  
  this.addMediaElementEventListeners();
  
  // handle autoplay
  if(this.nuElement.hasAttribute("autoplay")){
    this.autoplayModeIsActive = true;
    if(!this.isMobile){
      this.mediaElement.autoplay = "true";
    }
    else{
      this.mediaElement.play();
    }
    this.showLoadingIndicator();
  }
  else{
    this.autoplayModeIsActive = false;
  }
  
};

/* ---------------------------------------- */
neutrino.components.media.MediaView.prototype.registerPlaybackToggleObject = function(playbackToggleObject) {
  this.playbackToggleObjects.push(playbackToggleObject);
};

neutrino.components.media.MediaView.prototype.registerTimelineObject = function(timelineObject) {
  this.timelineObjects.push(timelineObject);
};

neutrino.components.media.MediaView.prototype.registerCurrentTimeObject = function(currentTimeObject) {
  this.currentTimeObjects.push(currentTimeObject);
};

neutrino.components.media.MediaView.prototype.registerRemainingTimeObject = function(remainingTimeObject) {
  this.remainingTimeObjects.push(remainingTimeObject);
};

neutrino.components.media.MediaView.prototype.registerLoadingIndicator = function(loadingIndicatorObject) {
  this.loadingIndicatorObjects.push(loadingIndicatorObject);
};
/* ---------------------------------------- */
neutrino.components.media.MediaView.prototype.togglePlayback = function() {
  if(!this.mediaIsActionable()){ return; }
  if(this.mediaElement.paused){
    this.mediaElement.play();
  }
  else{
    this.mediaElement.pause();
  }
};

neutrino.components.media.MediaView.prototype.play = function() {
  if(this.mediaIsActionable() && this.mediaElement.paused){
    this.mediaElement.play();
  }
};

neutrino.components.media.MediaView.prototype.pause = function() {
  if(this.mediaIsActionable() && !this.mediaElement.paused){
    this.mediaElement.pause();
  }
};

neutrino.components.media.MediaView.prototype.mediaIsPaused = function() {
	var	paused = true;
  if(this.mediaIsActionable()){
    paused = this.mediaElement.paused;
  }
  return paused;
};

neutrino.components.media.MediaView.prototype.mediaHasEnded = function() {
	var	ended = true;
  if(this.mediaIsActionable()){
    ended = this.mediaElement.ended;
  }
  return ended;
};

neutrino.components.media.MediaView.prototype.timeUpdateEvent = function() {
  // update timeline objects
  var currentPercentage = this.mediaElement.currentTime / this.mediaElement.duration;
  for(var x = 0; x < this.timelineObjects.length; x++){
    this.timelineObjects[x].setByPercentage(currentPercentage);
  }
  // update currenttime and remainingtime objects
  for(var x = 0; x < this.currentTimeObjects.length; x++){
    this.currentTimeObjects[x].setByFloatingNumber(this.mediaElement.currentTime);
  }
  if(this.mediaElement.duration){
    for(var x = 0; x < this.remainingTimeObjects.length; x++){
      this.remainingTimeObjects[x].setByFloatingNumber(Math.floor(this.mediaElement.duration) - this.mediaElement.currentTime);
    }
  }
};

neutrino.components.media.MediaView.prototype.cachingEvent = function() {
  var self = this;
  
  this.cachingEventTimeout = setTimeout(function(){
    if(self.mediaElement.duration === null){ return; }
    var percentageLoaded = self.mediaElement.buffered.end(0) / self.mediaElement.duration;
    for(var x = 0; x < self.timelineObjects.length; x++){
      self.timelineObjects[x].setCachedByPercentage(percentageLoaded);
    }
  }, 200);
};

neutrino.components.media.MediaView.prototype.jumpToTimeByPercentage = function(percentage) {
  if(!this.mediaIsActionable()){ return; }
  if(this.mediaElement.duration === null){ return; }
  var time = this.mediaElement.duration * percentage;
  this.mediaElement.currentTime = time;
};

neutrino.components.media.MediaView.prototype.showLoadingIndicator = function() {
  if(!this.mediaIsActionable()){ return; } 
  this.nuElement.className += " loading";
  for(var x = 0; x < this.loadingIndicatorObjects.length; x++){
    this.loadingIndicatorObjects[x].activate();
  }
};

neutrino.components.media.MediaView.prototype.hideLoadingIndicator = function() {
  if(!this.mediaIsActionable()){ return; }
  this.nuElement.className = this.nuElement.className.replace(/ loading/g, "");
  for(var x = 0; x < this.loadingIndicatorObjects.length; x++){
    this.loadingIndicatorObjects[x].deActivate();
  }
};

neutrino.components.media.MediaView.prototype.mediaIsActionable = function() {
  // if there's an issue with the media tag, do not allow any actions from companion components
  var isActionable = true;
  if(!this.srcIsSet){
    isActionable = false;
    console.error("media element src has not been set, no actions can be taken");
  }
  
  return isActionable;
};

/* add all event listeners for HTML5 media element events */ 
neutrino.components.media.MediaView.prototype.mediaEvents = [  
  'canplaythrough',
  'canplay',
  'loadeddata', 
  'loadedmetadata',
  'pause',
  'play',
  'playing',   
  'progress',  
  'timeupdate',
  'ended' 
  // 'webkitbeginfullscreen', 
  // 'webkitendfullscreen',
  // 'loadstart', 
  // 'abort',
  // 'emptied',
  // 'error',
  // 'stalled',
  // 'suspend',
  // 'waiting',
  // 'volumechange',
  // 'durationchange',
  // 'ratechange',
  // 'seeked',    
  // 'seeking' 
];

neutrino.components.media.MediaView.prototype.addMediaElementEventListeners = function(){
	var self = this;
 	for(var x = 0; x < this.mediaEvents.length; x++){
 	  self.mediaElement.addEventListener(this.mediaEvents[x], this, false);
 	}
};

neutrino.components.media.MediaView.prototype.removeMediaElementEventListeners = function(){
	var self = this;
 	for(var x = 0; x < this.mediaEvents.length; x++){
 	  self.mediaElement.removeEventListener(this.mediaEvents[x], this, false);
 	}
};

/*
neutrino.components.media.MediaView.prototype.clearOutAllMediaElements = function () {
	var self = this;
	var vidTags = document.getElementsByTagName("video");
	for(var x = 0; x < vidTags.length; x++){
		vidTags[x].parentNode.removeChild(vidTags[x]);
	}
	
	var audioTags = document.getElementsByTagName("audio");
	for(var x = 0; x < audioTags.length; x++){
		audioTags[x].parentNode.removeChild(audioTags[x]);
	}
};
*/

neutrino.components.media.MediaView.prototype.mediaEvent = function(evt){
	var self = this;
    var message = null; 
    /* add a note describing what each event does */
    switch (evt.type) {
        case 'loadstart' :
            message = "begin loading media data";
            break;
        case 'progress':
            message = "fetching media...";
            this.cachingEvent();
            break;
        case 'canplay':
            message = "can play, but will eventually have to buffer";
            //console.log("canplay");
            break;
        case 'canplaythrough':
            message = "can play, won't have to buffer anymore";
            break;
        case 'loadeddata':
            message = "can render media data at current playback position";
            break;
        case 'loadedmetadata':
            message = "now we know duration, height, width, and more";
            break;
        case 'timeupdate':
            //message += " " + evt.target.currentTime.toFixed(3);
            this.timeUpdateEvent();
            break;
        case 'durationchange':
            message = "new info about the duration";
            break;
        case 'volumechange':
            message = "volume or muted property has changed";
            break;
        case 'play':
            message = "just returned from the play function";
            this.mediaPlayEvent();
            break;
        case 'playing':
            message = "playback has started";
            this.mediaPlayingEvent();
            break;
        case 'pause':
            message = "just returned from the pause function";
            this.mediaPauseEvent();
            break;
        case 'suspend':
            message = "loading has stopped, but not all of the media has downloaded";
            break;
        case 'waiting':
            message = "stopped playback because we're waiting for the next frame";
            break;
        case 'stalled':
            message = "fetching media data, but none is arriving";
            break;
        case 'ended':
            message = "ended";
            this.mediaEndedEvent();
            break;
        case 'webkitbeginfullscreen':
            message = "entering fullscreen mode";
            break;
        case 'webkitendfullscreen':
            message = "exiting fullscreen mode";
            break;
        case 'error':  
            var error = this.mediaElement.error;
            switch (error.code) {
              case error.MEDIA_ERR_ABORTED:
                message = "fetching aborted at the user's request"; 
                break;
              case error.MEDIA_ERR_NETWORK:
                message = "a network error caused the browser to stop fetching the media"; 
                break;
              case error.MEDIA_ERR_DECODE:
                message = "an error occurred while decoding the media"; 
                break;
              case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                message = "the media indicated by the src attribute was not suitable"; 
                break;
              default:
                message = "an error occurred"; 
                break;
            }
            break;
    }
 
    // console.log("[neutrino.components.media.MediaView]: "+message);
};

neutrino.components.media.MediaView.prototype.mediaPlayingEvent = function() {
  if(!this.mediaFirstPlayingEventHasFired){
    this.mediaFirstPlayingEventHasFired = true;
    this.hideLoadingIndicator();
  }
};

neutrino.components.media.MediaView.prototype.mediaPlayEvent = function() {
  for(var x = 0; x < this.playbackToggleObjects.length; x++){
    this.playbackToggleObjects[x].mediaPlayEvent();
  }
  for(var x = 0; x < this.delegates.length; x++){
    var delegate = this.delegates[x];
    if("mediaPlayEvent" in delegate){ delegate.mediaPlayEvent(); }
  }
};

neutrino.components.media.MediaView.prototype.mediaPauseEvent = function() {
  for(var x = 0; x < this.playbackToggleObjects.length; x++){
    this.playbackToggleObjects[x].mediaPauseEvent();
  }
  for(var x = 0; x < this.delegates.length; x++){
    var delegate = this.delegates[x];
    if("mediaPauseEvent" in delegate){ delegate.mediaPauseEvent(); }
  }
};

neutrino.components.media.MediaView.prototype.mediaEndedEvent = function() {
  for(var x = 0; x < this.delegates.length; x++){
    var delegate = this.delegates[x];
    if("mediaEndedEvent" in delegate){ delegate.mediaEndedEvent(); }
  }
};

neutrino.components.media.MediaView.prototype.getFormatedTimeString = function(float) {
  var rawSeconds = Math.floor(float);
  var milliseconds = Math.floor( (float - rawSeconds) * 100 ); // milliseconds to two decimal positions
  
  var string = "";
  
  var hours = Math.floor( Math.floor(rawSeconds / 60) / 60 );
  if(hours > 0){ string = hours+":"; }
  
  var minutes = Math.floor(rawSeconds / 60) % 60;
  if(hours > 0 && minutes < 10){ string += "0"; }
  string += minutes+":";
  
  var seconds = rawSeconds % 60;
  if(seconds < 10){ string += "0"; }
  string += seconds;
  
  return string;
};




/* --------------------------------------------------------------------- PlaybackToggleView */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.PlaybackToggleView");
neutrino.require ("neutrino.View");

neutrino.components.media.PlaybackToggleView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.PlaybackToggleView, neutrino.View);

neutrino.components.media.PlaybackToggleView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	
	this.setup();
	this.addEventListeners();
};

neutrino.components.media.PlaybackToggleView.prototype.setup = function() {
  var mediaViewKey = this.nuElement.getAttribute("nu-media-view-id");
  this.mediaWindowObject = gApplication.getView(mediaViewKey);
  this.mediaWindowObject.registerPlaybackToggleObject(this);
};

neutrino.components.media.PlaybackToggleView.prototype.reset = function() {
  this.nuElement.className = this.nuElement.className.replace(/ nu-media-playing/g, "");
};

neutrino.components.media.PlaybackToggleView.prototype.addEventListeners = function() {
  this.nuElement.addEventListener("click", this, false);
};

neutrino.components.media.PlaybackToggleView.prototype.handleEvent = function(e) {
  var self = this;
  if(e.type == "click" && e.currentTarget == this.nuElement){
    this.buttonPressed();
  }
};

neutrino.components.media.PlaybackToggleView.prototype.buttonPressed = function() {
  this.mediaWindowObject.togglePlayback();
};

neutrino.components.media.PlaybackToggleView.prototype.mediaPlayEvent = function() {
  this.nuElement.className += " nu-media-playing";
};

neutrino.components.media.PlaybackToggleView.prototype.mediaPauseEvent = function() {
  this.nuElement.className = this.nuElement.className.replace(/ nu-media-playing/g, "");
};

/* --------------------------------------------------------------------- TimelineView */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.TimelineView");
neutrino.require ("neutrino.View");

neutrino.components.media.TimelineView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.TimelineView, neutrino.View);

neutrino.components.media.TimelineView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	
	this.setup();
	this.addEventListeners();
	
};

neutrino.components.media.TimelineView.prototype.setup = function() {
  // grab media window element from id
  var mediaViewKey = this.nuElement.getAttribute("nu-media-view-id");
  this.mediaWindowObject = gApplication.getView(mediaViewKey);
  
  this.mediaWindowObject.registerTimelineObject(this);
  
  // get dimensions
  var computedStyle = window.getComputedStyle(this.nuElement);
  this.size = {width: parseInt(computedStyle.width, 10), height: parseInt(computedStyle.height, 10)};
  
  // get inner timeline element
  this.statusElement = this.nuElement.querySelector(".nu-media-timeline-position");
  this.setByPercentage(0);
  
  // get cached element if it exists
  this.cachedElement = this.nuElement.querySelector(".nu-media-timeline-cached");
  if(this.cachedElement){
    this.setCachedByPercentage(0);
  }
};

neutrino.components.media.TimelineView.prototype.reset = function() {
  this.setByPercentage(0);
  this.setCachedByPercentage(0);
};

neutrino.components.media.TimelineView.prototype.setByPercentage = function(percentage) {
  var widthFromPercentage = Math.round(this.size.width * percentage);
  this.statusElement.style.width = widthFromPercentage+"px";
};

neutrino.components.media.TimelineView.prototype.setCachedByPercentage = function(percentage) {
  if(this.cachedElement === null){ return; }
  var widthFromPercentage = Math.round(this.size.width * percentage);
  this.cachedElement.style.width = widthFromPercentage+"px";
};

neutrino.components.media.TimelineView.prototype.addEventListeners = function() {
  var self = this;
  var isTouchDevice = gApplication.nuBrowser.isMobile;
  this.nuElement.addEventListener(isTouchDevice ? "touchstart" : "mousedown", function(e){ self.touchStart(e); }, false);
  this.nuElement.addEventListener(isTouchDevice ? "touchmove" : "mousemove", function(e){ self.touchMove(e); }, false);
  this.nuElement.addEventListener(isTouchDevice ? "touchend" : "mouseup", function(e){ self.touchEnd(e); }, false);
};

neutrino.components.media.TimelineView.prototype.handleEvent = function(e) {
  var self = this;
  
};

neutrino.components.media.TimelineView.prototype.touchStart = function(e) {
  if(!this.mediaWindowObject.mediaIsActionable()){ return; }
  // console.log("[ThumbnailsView]: touchStart");
  this.touchIsActive = true;
  this.touchStartEvent = e;
  var event = gApplication.nuBrowser.isMobile ? e.touches[0] : e;
  this.touchStartPos = {x: event.pageX, y: event.pageY};
  this.updateTimelinePos(this.touchStartPos);
};

neutrino.components.media.TimelineView.prototype.touchMove = function(e) {
  if(!this.touchIsActive){ return; }
  // console.log("[ThumbnailsView]: touchMove");
  var isTouchDevice = gApplication.nuBrowser.isMobile;
  var event = gApplication.nuBrowser.isMobile ? e.touches[0] : e;
  var newPos = {x: event.pageX, y: event.pageY};
  var delta = {x: newPos.x - this.touchStartPos.x, y: newPos.y - this.touchStartPos.y};
  this.updateTimelinePos(newPos);
};

neutrino.components.media.TimelineView.prototype.touchEnd = function(e) {
  if(!this.mediaWindowObject.mediaIsActionable()){ return; }
  this.touchIsActive = false;
  // console.log("[ThumbnailsView]: touchEnd");
};

neutrino.components.media.TimelineView.prototype.updateTimelinePos = function(newPos) {
  var percentage = this.calculateTouchPercentage(newPos);
  this.setByPercentage(percentage);
  this.mediaWindowObject.jumpToTimeByPercentage(percentage);
};

neutrino.components.media.TimelineView.prototype.calculateTouchPercentage = function(newPos) {
  var offsetLeft = $(this.statusElement).offset().left;
  var percentage = (newPos.x - offsetLeft) / this.size.width;
  return percentage;
};

/* --------------------------------------------------------------------- CurrentTimeView */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.CurrentTimeView");
neutrino.require ("neutrino.View");

neutrino.components.media.CurrentTimeView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.CurrentTimeView, neutrino.View);

neutrino.components.media.CurrentTimeView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	
	this.setup();
	
};

neutrino.components.media.CurrentTimeView.prototype.setup = function() {
  // grab media window element from id
  var mediaViewKey = this.nuElement.getAttribute("nu-media-view-id");
  this.mediaWindowObject = gApplication.getView(mediaViewKey);
  
  this.mediaWindowObject.registerCurrentTimeObject(this);
  
};

neutrino.components.media.CurrentTimeView.prototype.reset = function() {
  this.nuElement.innerHTML = "";
};

neutrino.components.media.CurrentTimeView.prototype.setByFloatingNumber = function(float) {
  this.nuElement.innerHTML = this.mediaWindowObject.getFormatedTimeString(float);
};

/* --------------------------------------------------------------------- RemainingTimeView */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.RemainingTimeView");
neutrino.require ("neutrino.View");

neutrino.components.media.RemainingTimeView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.RemainingTimeView, neutrino.View);

neutrino.components.media.RemainingTimeView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	
	this.setup();
	
};

neutrino.components.media.RemainingTimeView.prototype.setup = function() {
  // grab media window element from id
  var mediaViewKey = this.nuElement.getAttribute("nu-media-view-id");
  this.mediaWindowObject = gApplication.getView(mediaViewKey);
  
  this.mediaWindowObject.registerRemainingTimeObject(this);
  
};

neutrino.components.media.RemainingTimeView.prototype.reset = function() {
  this.nuElement.innerHTML = "";
};

neutrino.components.media.RemainingTimeView.prototype.setByFloatingNumber = function(float) {
  if(float !== null){
    this.nuElement.innerHTML = "-" + this.mediaWindowObject.getFormatedTimeString(float);
  }
  else{
    this.nuElement.innerHTML = "";
  }
};

/* --------------------------------------------------------------------- LoadNewContentButtonView */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.LoadNewContentButtonView");
neutrino.require ("neutrino.View");

neutrino.components.media.LoadNewContentButtonView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.LoadNewContentButtonView, neutrino.View);

neutrino.components.media.LoadNewContentButtonView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	this.setup();
	this.addEventListeners();
};

neutrino.components.media.LoadNewContentButtonView.prototype.setup = function() {
  // grab media window element from id
  var mediaViewKey = this.nuElement.getAttribute("nu-media-view-id");
  this.mediaWindowObject = gApplication.getView(mediaViewKey);
};

neutrino.components.media.LoadNewContentButtonView.prototype.addEventListeners = function() {
  var self = this;
  this.nuElement.addEventListener("click", function(){ self.buttonPressed(); }, false);
};

neutrino.components.media.LoadNewContentButtonView.prototype.buttonPressed = function() {
  // gather source elements and dupe
  var sourceElements = this.nuElement.querySelectorAll("source");
  var sourceElementDupes = [];
  for(var x = 0; x < sourceElements.length; x++){
    sourceElementDupes.push(sourceElements[x].cloneNode());
  }
  
  var config = {srcElements: [], srcAttribute: null}; // srcElements are given the higher priority, if those exist srcAttribute is not loaded
  if(sourceElements.length > 0){
    config.srcElements = sourceElementDupes;
  }
  else{
    config.srcAttribute = this.nuElement.getAttribute("nu-media-src");
  }
  this.mediaWindowObject.loadNewContent(config);
};

/* --------------------------------------------------------------------- LoadingIndicatorView */
/* --------------------------------------------------------------------- */

neutrino.provide ("neutrino.components.media.LoadingIndicatorView");
neutrino.require ("neutrino.View");

neutrino.components.media.LoadingIndicatorView = function ()
{
	neutrino.View.call (this);
}

neutrino.inherits (neutrino.components.media.LoadingIndicatorView, neutrino.View);

neutrino.components.media.LoadingIndicatorView.prototype.onLoaded = function() {
  // call our superclass
	neutrino.View.prototype.onLoaded.call (this);
	this.setup();
};

neutrino.components.media.LoadingIndicatorView.prototype.setup = function() {
  // grab media window element from id
  //var mediaViewId = this.nuElement.getAttribute("nu-media-view-id");
  //var mediaWindowElement = document.querySelector("#"+mediaViewId);
  //this.mediaWindowObject = neutrino.DOM.getData (mediaWindowElement, "view");
  
  var mediaViewKey = this.nuElement.getAttribute("nu-media-view-id");
  this.mediaWindowObject = gApplication.getView(mediaViewKey);
  
  this.mediaWindowObject.registerLoadingIndicator(this);
};

neutrino.components.media.LoadingIndicatorView.prototype.activate = function() {
  this.nuElement.className += " active";
};

neutrino.components.media.LoadingIndicatorView.prototype.deActivate = function() {
  this.nuElement.className = this.nuElement.className.replace(/ active/g, "");
};
