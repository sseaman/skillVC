/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var DefaultJSFilenameFormatter = require('../defaultJSFilenameFormatter.js');
var path = require('path');
var svUtil = require('../../util.js');
var providerUtil = require('../providerUtil.js');
var log = require('winston-simple').getLogger('IntentHandlerProviderByFile');

/**
 * Provides an intent from a single file
 * 
 * Intent is loaded asynchronously but if a intent is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProvider}
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
	this._loaded = null;

	this._filenameFormatter = (options && options.filenameFormatter) 
		? options.filenameFormatter
		: new DefaultJSFilenameFormatter();

	AbstractProviderByFile.apply(this, [
		file, 
		options]);
}

IntentHandlerProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
IntentHandlerProviderByFile.prototype.constructor = IntentHandlerProviderByFile;

/**
 * Load the file and registers it based on the list of intents specified by {@link IntentHandler.getIntentsList}. If 
 * {@link IntentHandler.getIntentsList} does not exist the intent will be registered under the name of the file as
 * parsed by the defined {@link FilenameFormatter}.
 *
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
IntentHandlerProviderByFile.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	try {
		if (!this._loaded) this._loaded = svUtil.instantiate(path.resolve(process.cwd(), fileName));

		providerUtil.addFunctions(this._loaded, { 'name' : path.parse(fileName).name });

		if (svUtil.isFunction(this._loaded.getIntentsList)) {
			var handledIntents = this._loaded.getIntentsList();
			for (var i=0;i<handledIntents.length;i++) {
				if (handledIntents[i] === itemId) {
					items[handledIntents[i]] = this._loaded;
				}
			}
		}
		else {
			items[this._filenameFormatter.parse(fileName)[0]] = this._loaded;
		}
	}
	catch (err) {
		log.error("Error loading intent handler "+path.parse(fileName).base+". Error:"+err);
	}
};

/**
 * Load the file and registers it based on the list of intents specified by {@link IntentHandler.getIntentsList}. If 
 * {@link IntentHandler.getIntentsList} does not exist the intent will be registered under the name of the file as
 * parsed by the defined {@link FilenameFormatter}.
 *
 * @function
 * @param {Map} items Map of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
IntentHandlerProviderByFile.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	try {
		if (!this._loaded) this._loaded = new (require(path.resolve(process.cwd(), fileName)))();
		if (svUtil.isFunction(this._loaded.getIntentsList)) {
			var handledIntents = this._loaded.getIntentsList();
			for (var i=0;i<handledIntents.length;i++) {
				items[handledIntents[i]] = this._loaded;
			}
		}
		else {
			items[this._filenameFormatter.parse(fileName)[0]] = this._loaded;
		}
	}
	catch (err) {
		log.error("Error loading intent handler "+path.parse(fileName).base+". Error:"+err.stack);
	}
};

module.exports = IntentHandlerProviderByFile;