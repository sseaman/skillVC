/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var svUtil = require('../../util.js');
var log = require('winston-simple').getLogger('IntentHandlerProviderByFile');

/**
 * Provides an intent from a single file
 * 
 * Intent is loaded asynchronously but if a intent is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @constructor
 * @implements {Provider}
 * @see {@link AbstractProviderByFile}
 * @see {@link DefaultJSFilenameFormatter}
 * @param {String} file The file that represnts an intent
 * @param {Object} options Options for the file loading
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when an intent is requested.  It is generally
 *         more efficient to load only when the intent is requested.
 * @param {FileNameFormatter} [options.filenameFormatter=DefaultJSFilenameFormatter] The FilenameFormmatter to use to parse the 
 *     filenames if there are no intents specified by getIntentsList() (or if getIntentsList is not implemented)
 */
function IntentHandlerProviderByFile(file, options) {
	this._file = file;

	this._filenameFormatter = (options && options.filenameFormatter) 
		? options.filenameFormatter
		: new DefaultJSFilenameFormatter();

	AbstractProviderByFile.apply(this, [
		file, 
		this._processFile,
		options]);
}

IntentHandlerProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
IntentHandlerProviderByFile.prototype.constructor = IntentHandlerProviderByFile;

/**
 * Load the file and registers it based on the list of intents specified by {@link IntentHandler.getIntentsList}. If 
 * {@link IntentHandler.getIntentsList} does not exist the intent will be registered under the name of the file as
 * parsed by the defined {@link FilenameFormatter}.
 * 
 * @protected
 * @param  {String} file  The file to process
 * @return {Provider~processorResult} The loaded item 
 */
IntentHandlerProviderByFile.prototype._processFile = function(file) {
	try {
		var loaded = require(file);
		if (svUtil.isFunction(loaded.getIntentsList)) {
			var handledIntents = loaded.getIntentsList();
			var processed = [];
			for (var i=0;i<handledIntents.length;i++) {
				processed.push({'itemId' : handledIntents[i], 'item': loaded});
			}
			return (processed.length > 0) ? processed : null;
		}
		else {
			return [{'itemId' : this._filenameFormatter.parse(file)[0], 'item': loaded}];
		}
	}
	catch (err) {
		log.error("Error loading intent "+intentId+". Error:"+err);
		return null;
	}
}

module.exports = IntentHandlerProviderByFile;