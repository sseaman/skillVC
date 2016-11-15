/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderBySyncDirectory = require('../abstractProviderBySyncDirectory.js');
var svUtil = require('../../util.js');
var providerUtil = require('../providerUtil.js');
var path = require('path');
var log = require('winston-simple').getLogger('IntentHandlerProviderByDirectory2');

/**
 * NOTE: Not used in default SkillVC configuration.  Here just in case
 * 
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
function IntentHandlerProviderByDirectory2(directory, options) {
	if (!directory) throw Error('directory required');

	AbstractProviderBySyncDirectory.apply(this, [
		directory, 
		options]);
}

IntentHandlerProviderByDirectory2.prototype = Object.create(AbstractProviderBySyncDirectory.prototype);
IntentHandlerProviderByDirectory2.prototype.constructor = IntentHandlerProviderByDirectory2;

/**
 * Not supported
 *
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
IntentHandlerProviderByDirectory2.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Does not support the processing of individual items');
};

/**
 * Uses node require to load the file.  If the intent is not found this method
 * will favor performance and never look for the file again.
 *
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
IntentHandlerProviderByDirectory2.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	try {
		var loaded = svUtil.instantiate(path.resolve(fileName));

		providerUtil.addFunctions(loaded, { 'name' : path.parse(fileName).name });

		if (svUtil.isFunction(loaded.getIntentsList)) { // it specifies its intent list
			var handledIntents = loaded.getIntentsList();
			if (!handledIntents) handledIntents = path.parse(fileName).name; // if it didn't return anything, use filename (not extension)
			
			for (var i=0;i<handledIntents.length;i++) {
				items[handledIntents[i]] = loaded;
				log.info('Loaded intent handler '+loaded.getName()+ ' for intent '+handledIntents[i]);
			}
		}
		else { // it didn't specify an intent list, so make it what the name of the file is
			items[path.parse(fileName).name] = loaded;
			log.info('Loaded intent handler '+loaded.getName()+ ' for intent '+path.parse(fileName).name);
		}
	}
	catch (err) {
		log.error("Error loading intent "+path.parse(fileName).base+". "+err.stack);
	}
};

module.exports = IntentHandlerProviderByDirectory2;
