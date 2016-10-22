/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Default formatter.  Does nothing but return what is passed in.
 *
 * @class DefaultFormatter
 * @constructor
 * @implements {Formatter}
 */
function DefaultFormatter() { }

/**
 * Returns what was passed in
 *
 * @param {String} value The value to use in the formatting
 * @return {String} The same string that was passed in
 */
DefaultFormatter.prototype.format = function(value) {
	return value;
};

module.exports = DefaultFormatter;