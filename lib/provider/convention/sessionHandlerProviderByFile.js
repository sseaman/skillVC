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
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
SessionHandlerProviderByFile.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	try { 
		if (!this._loaded) this._loaded = new (require(path.join(process.cwd(), fileName)))();
		items[fileName] = this._loaded;
	}
	catch (err) {
		log.error("Error loading session handler "+path.parse(fileName).base+". Error:"+err);
	}
};

/**
 * Uses node.js require to load the file and register it with the provider system
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
SessionHandlerProviderByFile.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	this.processItem(items, null, fileName, options);
};

module.exports = SessionHandlerProviderByFile;