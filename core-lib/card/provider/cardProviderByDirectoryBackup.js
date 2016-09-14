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

	this._cards = {};
	this._cardNotFound = {};

	var cp = this; // scope
	fs.readdir(directory, function(err, files) { // async read so we don't lock on construction
		if (files) {
			for (var i=0;i<files.length;i++) {
				if (cp._filenameFormatter.isValid(files[i])) { // only process files that match the filenameFormatter support
					var cardId = cp._filenameFormatter.parse(files[i])[0];
					if (!cp._cards[cardId]) { // wasn't already retrieved by getCard
						cp._cards[cardId] = cp._processFile(cardId, files[i]);
					}
				}
			}
		}
		else if (err) {
			throw Error('Could not read card directory '+directory);
		}
	});
}

/**
 * Returns the card based on the cardId
 * 
 * @param  {String} cardId The id of the card to retrieve. If the card is not already loaded, it will load it
 * @return {Card}  The card.  Null if no card is found
 */
CardProviderByDirectory.prototype.getCard = function(cardId) {
	var card = this._cards[cardId];

	if (card == null && !this._cardNotFound[cardId]) { 
		// if I don't find it in the cache, look for it as this could still be loading and could be faster 
		// if there are a lot of files in the dircetory
		card = this._processFile(cardId, this._filenameFormatter.format(cardId));
		this._cards[cardId] = card;
		// still not found? then it doesn't exist and don't evey look again
		if (card == null) this._cardNotFound[cardId] = true; 
	}
	return card;
}

CardProviderByDirectory.prototype._processFile = function(cardId, file) {
	var contents = fs.readFileSync(this._directory + file, this._fileEncoding);
	return (contents != null) ? this._cardBuilder.withCardId(cardId).withString(contents).build() : null;
}

module.exports = CardProviderByDirectory;
