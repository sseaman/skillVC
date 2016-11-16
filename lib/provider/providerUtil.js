var svUtil = require('../util.js');

module.exports = {
	
	/**
	 * Adds functions to the passed in object.
	 * 
	 * @param {Object} obj  The object to add to
	 * @param {Object} options The options to use
	 * @param {String} [options.name] The name of the object (for `addName()`)
	 */
	addFunctions : function(obj, options) {
		this.addName(obj, options.name);
	},

	/**
	 * Adds a `getName()` method to an object if it doesn't already exist.
	 *
	 * Order of checking is:
	 * * Does getName already exist, if so, don't do anything
	 * * Does object has constructor, use it's name
	 * * If name was passed in, use name
	 * * Could not determine, default to 'Object'
	 * 
	 * @param {Object} obj  The object to add to
	 * @param {String} name The name to add (only added if the getName() function doesn't already exist on the object)
	 */
	addName : function(obj, name) {
		if (!svUtil.isFunction(obj.getName)) {
			if (obj.constructor && obj.constructor.name && obj.constructor.name !== 'Object') {
				obj['getName'] = function() { return obj.constructor.name; };
			}
			else if (name) {
				obj['getName'] = function() { return name; };
			}
			else {
				obj['getName'] = function() { return 'Object'; };
			}
		}
	}

};