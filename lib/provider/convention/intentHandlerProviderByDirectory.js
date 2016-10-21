/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByAsyncDirectory = require('../abstractProviderByAsyncDirectory.js');
var DefaultJSFilenameFormatter = require ('../defaultJSFilenameFormatter.js');
var log = require('winston-simple').getLogger('IntentHandlerProviderByDirectory');
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
 * @implements {ItemProcessor}
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
		options]);
}

IntentHandlerProviderByDirectory.prototype = Object.create(AbstractProviderByAsyncDirectory.prototype);
IntentHandlerProviderByDirectory.prototype.constructor = IntentHandlerProviderByDirectory;

/**
 * Not supported
 * 
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
IntentHandlerProviderByDirectory.prototype.processItem = function(itemId, fileName, options) {
	throw new Error('Does not support the processing of individual items')
}

/**
 * Uses node require to load the file.  If the intent is not found this method
 * will favor performance and never look for the file again.
 *
 * @function
 * @param {Array.String} items Array of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
IntentHandlerProviderByDirectory.prototype.processItems = function(items, fileName, options) {
	try {
		var loaded = new (require(fileName));
		if (svUtil.isFunction(loaded.getIntentsList)) { // it specifies its intent list
			var handledIntents = loaded.getIntentsList();
			if (!handledIntents) handledIntents = [itemId]; // if it didn't return anything
			
			var processed = [];
			for (var i=0;i<handledIntents.length;i++) {
				processed.push({'itemId' : handledIntents[i], 'item': loaded});
			}
			return (processed.length > 0) ? processed : null;
		}
		else { // it didn't specify an intent list, so make it what the name of the file is
			return [{'itemId' : path.parse(fileName).name, 'item': loaded}];
		}
	}
	catch (err) {
		log.error("Error loading intent "+path.parse(fileName).base+". Error:"+err);
		return null;
	}
}

module.exports = IntentHandlerProviderByDirectory;
