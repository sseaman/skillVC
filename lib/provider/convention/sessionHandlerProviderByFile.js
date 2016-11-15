/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var svUtil = require('../../util.js');
var providerUtil = require('../providerUtil.js');
var path = require('path');
var log = require('winston-simple').getLogger('SessionHandlerProviderByFile');

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
	this._start = false;
	this._end = false;

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
		if (!this._loaded) this._loaded = svUtil.instantiate(path.resolve(process.cwd(), fileName));

		providerUtil.addFunctions(this._loaded, { 'name' : path.parse(fileName).name });

		if (svUtil.isFunction(this._loaded.sessionStart)) {
			this._start = true;
		}
		if (svUtil.isFunction(this._loaded.sessionEnd)) {
			this._end = true;
		}

		items[fileName] = this._loaded;
	}
	catch (err) {
		log.error("Error loading session handler "+path.parse(fileName).base+". Error:"+err.stack);
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

/**
 * Returns all the pre items (items that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre items
 */
SessionHandlerProviderByFile.prototype.getStartSessionHandlers = function() {
	return (this._start) ? [ this._loaded ] : [];
};

/**
 * Returns all the post items (items that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post items
 */
SessionHandlerProviderByFile.prototype.getEndSessionHandlers = function() {
	return (this._end) ? [ this._loaded ] : [];
};

module.exports = SessionHandlerProviderByFile;