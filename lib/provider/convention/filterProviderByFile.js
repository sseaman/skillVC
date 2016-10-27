/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var svUtil = require('../../util.js');
var log = require('winston-simple').getLogger('FilterProviderByFile');
var path = require('path');

/**
 * Provides a filter from a single file
 * 
 * Filter will be loaded synchronously as there is no way to determine when a filter is required asynchronously
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProvider}
 * @see {@link AbstractProviderByFile}
 * @param {String} file The file that represnts an intent
 * @param {Object} [options] Options 
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a filter is requested
 */
function FilterProviderByFile(file, options) {
	this._file = file;
	this._loaded = null;

	AbstractProviderByFile.apply(this, [
		file, 
		options]);
}

FilterProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
FilterProviderByFile.prototype.constructor = FilterProviderByFile;

/**
 * Uses node.js require to load the file and register it with the provider system
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
FilterProviderByFile.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	try { 
		if (!this._loaded) this._loaded = svUtil.instantiate(path.resolve(process.cwd(), fileName));

		if (!svUtil.isFunction(this._loaded.getName)) this._loaded['getName'] = function() {return fileName;};
		
		items[itemId] = this._loaded;
	}
	catch (err) {
		log.error("Error loading filter "+path.parse(fileName).base+". Error:"+err);
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
FilterProviderByFile.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	this.processItem(items, fileName, fileName, options);
};

module.exports = FilterProviderByFile;