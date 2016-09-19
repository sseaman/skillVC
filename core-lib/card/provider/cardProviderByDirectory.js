/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
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
 * @param {String} [options.fileEncoding=utf8] The encoding of the files.
 * @param {FileNameFormatter} [options.filenameFormatter=DefaultJSONFilenameFormatter] The FilenameFormmatter to use to parse the 
 *     filenames to determine card name as well as how to format the cardId to become a filename. This object will only 
 *     load files that match the formatters isValid() method
 * @param {CardBuilder} [options.cardBuilder=DefaultCardBuilder] The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
 *
 * @constructor
 * @implements {Provider}
 * @see {@link DefaultCardBuilder}
 * @see {@link DefaultJSONFilenameFormatter}
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

/**
 * Syncronously reads a file and, using the CardBuilder from the constructor, builds a response for the
 * use in {@link AbstractProviderByDictionary}
 *
 * @protected
 * @function
 * @param  {String} cardId The Id of the card to process
 * @param  {String} file   The file to process
 * @return {Provider~processorResult}  The loaded card information
 */
CardProviderByDirectory.prototype._processFile = function(cardId, file) {
	var contents = fs.readFileSync(file, this._fileEncoding);
	return (contents != null) 
		? [{ itemId : cardId, item : this._cardBuilder.withCardId(cardId).withString(contents).build() }]
		: null;
}

module.exports = CardProviderByDirectory;
