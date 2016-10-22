/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var path = require('path');

/**
 * Formats/Parses a file that has the format: itemId.js
 *
 * @constructor
 * @implements {FilenameFormatter}
 * @param {Object} options The options 
 * @param {String} [options.delimiter=.] The delimiter between the response name and the suffix of the file.
 * @param {String} [options.suffix=''] The suffix of the file.
 */
function DefaultFilenameFormatter(options) { 
	this._delimiter = (options && options.delimiter)
		? options.delimiter
		: '.';
	this._suffix = (options && options.suffix)
		? options.suffix
		: '';
}

/**
 * Formats the itemId to itemId+delimiter+suffix
 *
 * @function
 * @param  {String} itemId The itemId to use
 * @return {String}        The formatted string
 */
DefaultFilenameFormatter.prototype.format = function(itemId) {
	return itemId + this._delimiter + this._suffix;
};

/**
 * Parses a filename into [itemId, suffix]
 *
 * @function
 * @param  {String} fileName The filename to parse
 * @return {Array.String}        Array of itemId and suffix
 */
DefaultFilenameFormatter.prototype.parse = function(fileName) {
	var fn = path.basename(fileName); // get the filename out 
	return fn.split(this._delimiter);
};

/**
 * Returns true if the fileName matches the type supported by this FilenameFormmatter
 *
 * @function
 * @param  {String}  fileName The filename
 * @return {Boolean}          True if fileName is a match to endsWith(this._delimiter + this._suffix)
 */
DefaultFilenameFormatter.prototype.isValid = function(fileName) {
	return fileName.endsWith(this._delimiter + this._suffix);
};

module.exports = DefaultFilenameFormatter;