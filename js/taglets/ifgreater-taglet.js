// ifgreater_taglet.js

neutrino.provide ("neutrino.janx.IfGreaterTaglet");
neutrino.require ("neutrino.janx.ConditionTaglet");

/**
 * @constructor
 */
neutrino.janx.IfGreaterTaglet = function ()
{
	neutrino.janx.ConditionTaglet.call (this);
};
neutrino.inherits (neutrino.janx.IfGreaterTaglet, neutrino.janx.ConditionTaglet);
neutrino.exportSymbol('neutrino.janx.IfGreaterTaglet', neutrino.janx.IfGreaterTaglet);


// inElement: DOM element
// inContext: map<string,string>
// return: true/false
neutrino.janx.IfGreaterTaglet.prototype.matches = function (inElement, inContext)
{
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
			var	thisMatches = lhs > rhs;
			
			if (thisMatches)
			{
				matches = true;
			}
			else
			{			
				matches = false;
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