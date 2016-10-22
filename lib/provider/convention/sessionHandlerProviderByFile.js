/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var path = require('path');
var log = require('winston-simple').getLogger('FilterProviderByFile');

/**
 * Provides a SessionHandler from a single file
 * 
 * SessionHandler will be loaded synchronously as there is no way to determine when a SessionHandler is required asynchronously
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @see {@link AbstractProviderByFile}
 * @param {String} file The file that represnts an intent
 * @param {Object} [options] Options 
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a session handler is requested
 */
function SessionHandlerProviderByFile(file, options) {
	this._file = file;
	this._loaded = null;

	AbstractProviderByFile.apply(this, [
		file, 
		options]);
}

SessionHandlerProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
SessionHandlerProviderByFile.prototype.constructor = SessionHandlerProviderByFile;

/**
 * Uses node.js require to load the file and register it with the provider system
 * 
 * @function
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
SessionHandlerProviderByFile.prototype.processItem = function(itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	try { 
		if (!this._loaded) this._loaded = new (require(path.join(process.cwd(), fileName)))();
		return { 'itemId' : fileName, 'item' : this._loaded};
	}
	catch (err) {
		log.error("Error loading session handler "+path.parse(fileName).base+". Error:"+err);
		return null;
	}
};

/**
 * Uses node.js require to load the file and register it with the provider system
 * 
 * @function
 * @param {Array.String} items Array of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
SessionHandlerProviderByFile.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	var result = this.processItem(null, fileName, options);
	return (result) ? [result] : null;
};

module.exports = SessionHandlerProviderByFile;