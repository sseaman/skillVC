var AbstractProviderByDirectory = require('../../provider/abstractProviderByDirectory.js');
var DefaultJSONFilenameFormatter = require ('../../provider/defaultJSONFilenameFormatter.js');
var DefaultCardBuilder = require ('../defaultCardBuilder.js');
const fs = require('fs');
const path = require('path');

/**
 * Provides cards by loading all of the files in a directory as cards
 * 
 * Cards are loaded asynchronously but if a card is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} directory The directory to read all cards from
 * @param {Object} options Options for the was the directory is process
 * @param {String} options.fileEncoding The encoding of the files.  Defaults to utf8
 * @param {FileNameFormatter} options.filenameFormatter The FilenameFormmatter to use to parse the filenames to determine card name as well
 *     as how to format the cardId to become a filename. This object will only load files that match the formatters isValid() method
 *     Defaults to DefaultJSONFilenameFormatter
 * @param {CardBuilder} options.cardBuilder The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
 */
function CardProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._directory = path.normalize(directory);
	this._directory += (this._directory.endsWith(path.delimiter))
		? ''
		: path.sep;

	this._filenameFormatter = (options && options.filenameFormatter)
		? options.filenameParser
		: new DefaultJSONFilenameFormatter();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._cardBuilder = (options && options.cardBuilder) 
		? options.cardBuilder
		: new DefaultCardBuilder();

	AbstractProviderByDirectory.apply(this, [
		directory, 
		this._filenameFormatter, 
		this._processFile]);
}

CardProviderByDirectory.prototype = AbstractProviderByDirectory.prototype;
CardProviderByDirectory.prototype.contructor = CardProviderByDirectory;

CardProviderByDirectory.prototype._processFile = function(cardId, file) {
	var contents = fs.readFileSync(file, this._fileEncoding);
	return (contents != null) 
		? { itemId : cardId, item : this._cardBuilder.withCardId(cardId).withString(contents).build() }
		: null;
}

module.exports = CardProviderByDirectory;
