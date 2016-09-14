/**
 * Default formatter.  Does nothing but return what is passed in.
 *
 */
function DefaultFormatter() { }

/**
 * Returns what was passed in
 * @param {String} value The value to use in the formatting
 * @return {String} The same string that was passed in
 */
DefaultFormatter.prototype.format = function(value) {
	return value;
}

module.exports = DefaultFormatter;