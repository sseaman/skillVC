/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByAsyncDirectory = require('../abstractProviderByAsyncDirectory.js');
var DefaultJSFilenameFormatter = require ('../defaultJSFilenameFormatter.js');
var log = require('../../skillVCLogger.js').getLogger('IntentHandlerProviderByDirectory');
var svUtil = require('../../util.js');
const path = require('path');
const fs = require('fs');

/**
 * Provides intents by loading all of the files in a directory as intents
 * 
 * Intents are loaded asynchronously but if an intent is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * If the intent being loaded does not implement {@link IntentHandler~getIntentList} then the filename
 * will be treated as the name of the intent and registered as such.
 *
 * @constructor
 * @implements {Provider}
 * @see {@link AbstractProviderByAsyncDirectory}
 * @see {@link DefaultJSFilenameFormatter}
 * @param {String} directory The directory to read all intents from
 * @param {Object} options Options for the was the directory is process
 * @param {FileNameFormatter} [options.filenameFormatter=DefaultJSONFilenameFormatter] The FilenameFormmatter to use to parse the 
 *     filenames to determine name as well as how to format the id to become a filename. This object will only 
 *     load files that match the formatters isValid() method
 */
function IntentHandlerProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	AbstractProviderByAsyncDirectory.apply(this, [
		directory, 
		this._process,
		options]);
}

IntentHandlerProviderByDirectory.prototype = Object.create(AbstractProviderByAsyncDirectory.prototype);
IntentHandlerProviderByDirectory.prototype.constructor = IntentHandlerProviderByDirectory;

/**
 * Uses nodejs require to load the file.  If the intent is not found this method
 * will favor performance and never look for the file again.
 * 
 * @protected
 * @param  {String} itemId The id of the item
 * @param  {String} file   The file to load the intent from
 * @return {Provider~processorResult}  The loaded information
 */
IntentHandlerProviderByDirectory.prototype._process = function(itemId, file) {
	try {
		var loaded = new (require(process.cwd()+path.sep+file));
		if (svUtil.isFunction(loaded.getIntentsList)) { // it specifies its intent list
			var handledIntents = loaded.getIntentsList();
			if (!handledIntents) handledIntents = [itemId]; // if it didn't return anything
			
			var processed = [];
			for (var i=0;i<handledIntents.length;i++) {
				processed.push({'itemId' : handledIntents[i], 'item': loaded});
			}
			return (processed.length > 0) ? processed : null;
		}
		else { // it didn't specify an intent list, so make it what the itemId is
			return [{'itemId' : itemId, 'item': loaded}];
		}
	}
	catch (err) {
		log.error("Error loading intent "+itemId+". Error:"+err);
		return null;
	}
}

module.exports = IntentHandlerProviderByDirectory;
