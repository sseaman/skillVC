/**
 * Basic Formatter Manager that looks for strings in { } and uses the value inside the
 * { } as a key to look for both a formatter and a value in the valuesMap when formatting.
 *
 * This object will call the formmatter defined by the value in the { }, and take the formatted 
 * results and place them where the { } was
 * 
 * @param {Map} formatterMap Map of formatters where the key is the id of the formatter (what will match in the { })
 *                           and the value is the Formatter object that implements .format(value) and returns a string
 */
function BasicFormatterManager(formatterMap) {
	this._formatters = this.addFormatters(formatterMap);

	//this._regEx = new RegExp('[^{}]+(?=\})','gi'); // returns what's inside the {} only
	this._regEx = /\{([^}]+)\}/g;
}

/**
 * Returns the formatter stored under the formatterId
 * 
 * @param  {String]} formatterId The Id of the formatter to return
 * @return {Formatter} The formatter, null if not found;
 */
BasicFormatterManager.prototype.getFormatter = function(formatterId) {
	return this._formatters[formatterId];
}

/**
 * Adds formatters (any object that has .format(string) and returns a string)
 * 
 * @param {Map} formatterMap Map of formatters where the key is the id of the formatter (what will match in the { })
 *                           and the value is the Formatter object that implements .format(value) and returns a string
 */
BasicFormatterManager.prototype.addFormatters = function(formatterMap) {
	for (var key in formatterMap) {
		this._formatters[key] = formatterMap[key];
	}
}

/**
 * Formats everything in the passed in string.
 *
 * This does so by looking for any {id} in the string, where id is some text, and matching
 * the id to an id the formatterMap map and valuesMap.
 *
 * The formatter found by the id is called using the value found in the valuesMap
 * 
 * @param  {String} string    The string to format that contatins N number of {someString}
 * @param  {Object} valuesMap The map that contains values where the key is equal to someString
 * @return {String}           A new string with all the values formatted and replaced
 */
BasicFormatterManager.prototype.format = function(string, valuesMap) {
	var fms = this._formatters; // for scope
    return string.replace(this._regEx, function(matched) {
    	var cleanedMatch = matched.substring(1, matched.length-1); // remove the {}
    	return (cleanedMatch in fms) 
    		? fms[cleanedMatch].format(valuesMap[cleanedMatch])
    		: valuesMap[cleanedMatch];
    });
}

module.exports = BasicFormatterManager;