/**
 * Formats/Parses a card filename
 * 
 * @param {Object} options The options 
 * @param {String} options.delimiter The delimiter between the card name and the suffix of the file.  Defaults to '.'
 * @param {String} options.suffix The suffix of the file. Defaults to 'json'
 */
function DefaultCardFilenameFormatter(options) { 
	this._delimiter = (options && options.delimiter)
		? options.delimiter
		: '.';
	this._suffix = (options && options.suffix)
		? options.suffix
		: 'js';
}

/**
 * Formats the cardId to cardId+delimiter+suffix
 * @param  {String} cardId The cardId to use
 * @return {String}        The formatted string
 */
DefaultCardFilenameFormatter.prototype.format = function(cardId) {
	return cardId + this._delimiter + this._suffix;
}

/**
 * Parses a filename into [cardId, suffix]
 * @param  {String} fileName The filename to parse
 * @return {[String]}        Array of cardId and suffix
 */
DefaultCardFilenameFormatter.prototype.parse = function(fileName) {
	return fileName.split(this._delimiter);
}

/**
 * Returns true if the fileName matches the type supported by this FilenameFormmatter
 * @param  {String}  fileName The filename
 * @return {Boolean}          True if fileName is a match to endsWith(this._delimiter + this._suffix)
 */
DefaultCardFilenameFormatter.prototype.isValid = function(fileName) {
	return fileName.endsWith(this._delimiter + this._suffix);
}

module.exports = DefaultCardFilenameFormatter;