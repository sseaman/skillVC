/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Formats/Parses a file that has the format: itemId.js
 *
 * @constructor
 * @param {Object} options The options 
 * @param {String} [options.delimiter=.] The delimiter between the card name and the suffix of the file.
 * @param {String} [options.suffix=js] The suffix of the file.
 */
function DefaultJSFilenameFormatter(options) { 
	this._delimiter = (options && options.delimiter)
		? options.delimiter
		: '.';
	this._suffix = (options && options.suffix)
		? options.suffix
		: 'js';
}

/**
 * Formats the itemId to itemId+delimiter+suffix
 *
 * @function
 * @param  {String} itemId The itemId to use
 * @return {String}        The formatted string
 */
DefaultJSFilenameFormatter.prototype.format = function(itemId) {
	return itemId + this._delimiter + this._suffix;
}

/**
 * Parses a filename into [itemId, suffix]
 *
 * @function
 * @param  {String} fileName The filename to parse
 * @return {Array.String}        Array of itemId and suffix
 */
DefaultJSFilenameFormatter.prototype.parse = function(fileName) {
	return fileName.split(this._delimiter);
}

/**
 * Returns true if the fileName matches the type supported by this FilenameFormmatter
 *
 * @function
 * @param  {String}  fileName The filename
 * @return {Boolean}          True if fileName is a match to endsWith(this._delimiter + this._suffix)
 */
DefaultJSFilenameFormatter.prototype.isValid = function(fileName) {
	return fileName.endsWith(this._delimiter + this._suffix);
}

module.exports = DefaultJSFilenameFormatter;