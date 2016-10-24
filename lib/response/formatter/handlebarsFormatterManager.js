/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var Handlebars = require('handlebars');
var util = require('../../util.js');

/**
 * A formatter that support all the functionality of Handlebars 
 *
 * This supports full objects to use with handlebars and not just a function, as handlebars defaults to with helpers.
 * This allows the passed in formatters to still work as a normal helper but keep the context of the object itself,
 * something that is lost because handlebars justs wants a function when registering a helper
 * 
 * @param {Object.<string,Formatter>} formatterMap Map of formatters where the key is the id of the helper (what will match in the {{ }})
 *                           and the value is the Formatter object that implements .format(value) and returns a string
 * @param {Handlerbars} [handlebarsInstance=Handlebars.create()] An instance (cannot be global) of handlebars to use.
 *                           This allows for the preregistration of handlebars functionality if required.
 *                           Defaults to Handlebars.create();
 * @class
 * @constructor
 * @implements {FormatterManager}
 */
function HandlebarsFormatterManager(formatterMap, handlebarsInstance) {
	this._handlebars = (handlebarsInstance)
		? handlebarsInstance
		: Handlebars.create();

	this._formatters = {};
	this.addFormatters(formatterMap);
}

/**
 * Returns the formatter stored under the formatterId
 *
 * @function
 * @param  {String} formatterId The Id of the formatter to return
 * @return {Formatter} The formatter, null if not found;
 */
HandlebarsFormatterManager.prototype.getFormatter = function(formatterId) {
	return this._formatters[formatterId];
};

/**
 * Adds a formatter.  In the case of handlebars and this object, a 'Helper' object (not just the function)
 *
 * This supports full objects to use with handlebars and not just a function, as handlebars defaults to with helpers.
 * This allows the passed in formatters to still work as a normal helper but keep the context of the object itself,
 * something that is lost because handlebars justs wants a function when registering a helper
 *
 * @function
 * @param {Object.<string, Formatter>} formatterMap Map of formatters where the key is the id of the helper (what will match in the {{ }})
 *                           and the value is the Formatter object that implements .format(value) and returns a string
 */
HandlebarsFormatterManager.prototype.addFormatters = function(formatterMap) {
	for (var fmKey in formatterMap) {
		this._formatters[fmKey] = formatterMap[fmKey];
	}

	var hfm = this; // scope
	// handlebars requires the helpers to be a function, but I want to deal on the object level
	// to let people put in the object and I'll register the format method for them and still keep the object context
	for (var fKey in this._formatters) {
		if (!util.isFunction(this._formatters[fKey])) {
			this._handlebars.registerHelper(fKey, function(string, options) {
				// options.name has the name of the helper
				return hfm._formatters[options.name].format.call(hfm._formatters[options.name], string);
			});
		}
	}
};

/**
 * Formats the string uses the values in the valueMap.
 *
 * If formatters have been registered the values will first be passed to the formatter to format the value and 
 * the resulting string will be placed in the placeholder ({{ }}) location in the passed in string
 *
 * @function
 * @param  {String} string    The string to format
 * @param  {Object.<string, Object>}    valuesMap The values map where the key is equal to some variable in the handlebars placeholder ({{}})
 *                            and the value is the value to place in the placeholder (once passed through a formatter, if registered)
 * @return {String}           The final formatted string
 */
HandlebarsFormatterManager.prototype.format = function(string, valuesMap) {
	// compile returns a template which we then call with the valuesMap
	return (this._handlebars.compile(string))(valuesMap); 
};


module.exports = HandlebarsFormatterManager;