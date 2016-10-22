/**
 * Simple formatter example that formats a number to have two decimal places
 * 
 * @implements {Formatter}
 * @constructor 
 */
function NumberFormatter() { }

/**
 * Required method that formats the passed in number
 *
 * @function
 * @param {String} value The value to use in the formatting
 * @return {String} The final formatted string
 */
NumberFormatter.prototype.format = function(value) {
	// makes any number only have two decimal points
    return value.toFixed(2);
};

module.exports = NumberFormatter;