var AbstractProviderByFile = require('../../provider/abstractProviderByFile.js');
var log = require('../../skillVCLogger.js').getLogger('IntentHandlerProviderByFile');

/**
 * Provides an intent from a single file
 * 
 * Intent is loaded asynchronously but if a intent is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} file The file that represnts an intent
 * @param {Object} options Options 
 * @param {Boolean} options.preload Should the file be preloaded or only loaded when a card is requested (defaults to false)
 */
function IntentHandlerProviderByFile(file, options) {
	this._file = file;

	this._preload = (options && options.preload) 
		? options.preload
		: false;

	AbstractProviderByFile.apply(this, [
		file, 
		this._preload, 
		this._processFile]);
}

IntentHandlerProviderByFile.prototype = AbstractProviderByFile.prototype;
IntentHandlerProviderByFile.prototype.contructor = IntentHandlerProviderByFile;

IntentHandlerProviderByFile.prototype._processFile = function(file, cards) {
	try {
		var loaded = require(file);
		var handledIntents = loaded.getIntentsList();
		var processed = [];
		for (var i=0;i<handledIntents.length;i++) {
			processed.push({'itemId' : handledIntents[i], 'item': loaded});
		}
		return (processed.length > 0) ? processed : null;
	}
	catch (err) {
		log.error("Error loading intent "+intentId+". Error:"+err);
		return null;
	}
}

module.exports = IntentHandlerProviderByFile;