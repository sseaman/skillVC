/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultJSFilenameFormatter = require ('./defaultJSFilenameFormatter.js');
var log = require('winston-simple').getLogger('FilterProviderByDirectory');
var path = require('path');
var fs = require('fs');
var alreadyLoaded = {};

/**
 * Provides an item by loading all of the files in a directory
 * 
 * Items are loaded synchronously.  This object should only be used to load files that must be processed immediately as it
 * will block execution until all the files in the directory have been processed.
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @param {String} directory The directory to read from
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the ItemProcessor
 *        if the implementing class wants to pass information into the ItemProcessor method
 * @param {FilenameFormatter} [options.filenameFormatter=DefaultJSFilenameFormatter] The FilenameFormmatter to use to 
 *     parse the filenames to determine item file name as well as how to format the itemId to become a filename. 
 *     This object will only load files that match the formatters isValid() method
 * @param {String} [options.fileEncoding=utf8] The file encoding to use when reading files and directories
 * @param {Object.<String, Object>} [options.itemMap] A map that may be passed in to prime the internal map with.
 */
function AbstractProviderBySyncDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	if (alreadyLoaded[directory]) {
		log.debug('Filters already loaded. Skipping');
		return;
	}

	this._options = options;

	this._directory = path.normalize(directory);
	this._directory += (this._directory.endsWith(path.sep))
		? ''
		: path.sep;

	this._filenameFormatter = (options && options.filenameFormatter)
		? options.filenameParser
		: new DefaultJSFilenameFormatter();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._items = (options && options.itemMap) 
		? options.itemMap
		: {};

	var files = fs.readdirSync(this._directory, this._fileEncoding);
	for (var i=0;i<files.length;i++) {
		if (this._filenameFormatter.isValid(files[i])) {
			this.processItems(this._items, path.resolve(this._directory, files[i]), options);
		}
	}
	alreadyLoaded[directory] = true;
}

/**
 * Returns the item stored under the itemId.  May be null
 * 
 * @function
 * @param {String} itemId The Id of the item to return
 * @return {Object} The item corresponding to the itemId
 */
AbstractProviderBySyncDirectory.prototype.getItem = function(itemId) {
	return this._items[itemId];
};

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @abstract
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
AbstractProviderBySyncDirectory.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Must be implemented by subclass');
};

/**
 * Processes multiple items at once
 * 
 * @function
 * @abstract
 * @param {Map} items Map of the items being processed
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
AbstractProviderBySyncDirectory.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Must be implemented by subclass');
};

module.exports = AbstractProviderBySyncDirectory;
