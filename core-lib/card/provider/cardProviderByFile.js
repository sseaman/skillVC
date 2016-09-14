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
 * @param {Boolean} options.preload Should the file be preloaded or only loaded when a card is requested (defaults to false)
 * @param {String} options.fileEncoding The encoding of the files.  Defaults to utf8
 * @param {CardBuilder} options.cardBuilder The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
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

CardProviderByFile.prototype._processFile = function(file, cards) {
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