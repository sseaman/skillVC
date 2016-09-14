var AbstractProviderByDirectory = require('../../provider/abstractProviderByDirectory.js');
var DefaultJSFilenameFormatter = require ('../../provider/defaultJSFilenameFormatter.js');
var svUtil = require('../../util.js');
const path = require('path');
const fs = require('fs');

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
 *     Defaults to DefaultCardFilenameFormatter
 * @param {CardBuilder} options.cardBuilder The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
 */
function IntentHandlerProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._directory = path.normalize(directory);
	this._directory += (this._directory.endsWith(path.delimiter))
		? ''
		: path.sep;

	this._filenameFormatter = (options && options.filenameFormatter)
		? options.filenameParser
		: new DefaultJSFilenameFormatter();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	AbstractProviderByDirectory.apply(this, [
		directory, 
		this._filenameFormatter, 
		this._processIntent]);
}

IntentHandlerProviderByDirectory.prototype = AbstractProviderByDirectory.prototype;
IntentHandlerProviderByDirectory.prototype.contructor = IntentHandlerProviderByDirectory;

IntentHandlerProviderByDirectory.prototype._processIntent = function(intentId, file) {
	try {
		var loaded = new (require(process.cwd()+path.sep+file));
		if (svUtil.isFunction(loaded.getIntentsList)) { // it specifies its intent list
			var handledIntents = loaded.getIntentsList();
			if (!handledIntents) handledIntents = [intentId]; // if it didn't return anything
			
			var processed = [];
			for (var i=0;i<handledIntents.length;i++) {
				processed.push({itemId : handledIntents[i], item: loaded});
			}
			return (processed.length > 0) ? processed : null;
		}
		else { // it didn't specify an intent list, so make it what the intentId is
			return {itemId : intentId, item: loaded};
		}
	}
	catch (err) {
		console.log("Error loading intent "+intentId+". Error:"+err);
		return null;
	}
}

module.exports = IntentHandlerProviderByDirectory;
