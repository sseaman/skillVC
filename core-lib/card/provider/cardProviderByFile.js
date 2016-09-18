/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../../provider/abstractProviderByFile.js');
var DefaultCardBuilder = require ('../defaultCardBuilder.js');
const fs = require('fs');

/**
 * Provides cards by a single file with multiple cards defined in the file
 * 
 * Cards are loaded asynchronously but if a card is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} file The file to read all cards from
 * @param {Object} options Options for the was the directory is process
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a card is requested.  It is generally
 *         more efficient to load only when the card is requested.
 * @param {String} [options.fileEncoding =utf8] The encoding of the files
 * @param {CardBuilder} [options.cardBuilder=DefaultCardBuilder] The CardBuilder to use when building cards
 *
 * @class 
 * @constructor
 * @implements {Provider}
 * @see {@link DefaultCardBuilder}
 */
function CardProviderByFile(file, options) {
	this._file = file;

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._cardBuilder = (options && options.cardBuilder) 
		? options.cardBuilder
		: new DefaultCardBuilder();

	this._preload = (options && options.preload) 
		? options.preload
		: false;

	AbstractProviderByFile.apply(this, [
		file, 
		this._preload, 
		this._processFile]);
}

AbstractProviderByFile.prototype = AbstractProviderByFile.prototype;
AbstractProviderByFile.prototype.contructor = CardProviderByFile;

/**
 * Process a file tha may have many cards in it.  Converts each json card to a {@link Card} and results
 * an array of the resulting cards
 *
 * @protected
 * @function
 * @param  {String} file  The file to process
 * @return {Array.Provider~processorResult} The results of the processing
 */
CardProviderByFile.prototype._processFile = function(file) {
	var contents = fs.readFileSync(file, this._fileEncoding);
	if (contents) {
		var json = JSON.parse(contents);
		var processed = [];
		for (var key in json) {
			var card = this._cardBuilder.withCardId(key).withJSON(json[key]).build();
			processed.push({'itemId' : key, 'item': card});
		}
		return (processed.length > 0) ? processed : null;
	}

	return null;
}

module.exports = CardProviderByFile;