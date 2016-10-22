/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultJSFilenameFormatter = require ('./defaultJSFilenameFormatter.js');
var log = require('winston-simple').getLogger('ProviderByDirectory');
var fs = require('fs');
var path = require('path');

/**
 * Provides an item by loading all of the files in a directory
 * 
 * Items are loaded asynchronously but if an item is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @abstract
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @param {String} directory The directory to read all items from
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the itemProcessor
 *        if the implementing class wants to pass information into the itemProcessor method
 * @param {FilenameFormatter} [options.filenameFormatter=DefaultJSFilenameFormatter] The FilenameFormmatter to use to 
 *     parse the filenames to determine item file name as well as how to format the itemId to become a filename. 
 *     This object will only load files that match the formatters isValid() method
 * @param {String} [options.fileEncoding=utf8] The file encoding to use when reading files and directories
 * @param {Object.<String, Object>} [options.itemMap] A map that may be passed in to prime the internal map with.
 */
function AbstractProviderByAsyncDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._directory = path.normalize(directory);
	this._directory += (this._directory.endsWith(path.sep))
		? ''
		: path.sep;

	this._options = options;

	this._filenameFormatter = (options && options.filenameFormatter)
		? options.filenameFormatter
		: new DefaultJSFilenameFormatter();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._items = (options && options.itemMap) 
		? options.itemMap
		: {};

	this._itemNotFound = {};

	var cp = this; // scope
	fs.readdir(cp._directory, function(err, files) { // async read so we don't lock on construction
		if (files) {
			var itemId = null;
			var processed = null;
			for (var fileIdx=0;fileIdx<files.length;fileIdx++) {
				if (cp._filenameFormatter.isValid(files[fileIdx])) { // only process files that match the filenameFormatter support
					itemId = cp._filenameFormatter.parse(files[fileIdx])[0];

					if (!cp._items[itemId] && !cp._itemNotFound[itemId]) { // wasn't already retrieved
						log.debug('Async loading file: '+files[fileIdx]);
						processed = cp.processItems(cp._items, path.join(cp._directory, files[fileIdx]), cp._options);

						for (var pIdx=0;pIdx<processed.length;pIdx++) {
							log.debug('Item loaded: '+processed[pIdx].itemId);
							cp._items[processed[pIdx].itemId] = processed[pIdx].item;
						}
					}
				}
			}
		}
		else if (err) {
			log.error('Could not read directory '+cp._directory);
			throw Error('Could not read directory '+cp._directory);
		}
	});
}

/**
 * Returns the item based on the itemId
 *
 * @function
 * @param  {String} itemId The id of the item to retrieve. If the item is not already loaded, it will load it
 * @return {Object} The item.  Null if no item is found
 */
AbstractProviderByAsyncDirectory.prototype.getItem = function(itemId) {
	var item = this._items[itemId];

	if (item === null && !this._itemNotFound[itemId]) { 
		// if I don't find it in the cache, look for it as this could still be loading and could be faster 
		// if there are a lot of files in the dircetory
		var file = path.join(this._directory, this._filenameFormatter.format(itemId));
		log.debug('Item '+itemId+ ' not yet loaded. Loading file: '+file);

		var processed = this.processItems(this._items, file, this._options);
		if (processed === null) {
			log.debug('Item not able to be loaded');
			this._itemNotFound[itemId] = true; 
		}
		else {
			for (var i=0;i<processed.length;i++) {
				log.debug('Item loaded: '+processed[i].itemId);
				this._items[processed[i].itemId] = processed[i].item;
			}
			item = this._items[itemId];
		}
	}
	return item;
};

/**
 * Returns all items that were loaded
 *
 * @function
 * @return {Map} Map of the items where the Key is the itemId and the Value is the item itself
 */
AbstractProviderByAsyncDirectory.prototype.getItems = function() {
	return this._items;
};

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @abstract
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
AbstractProviderByAsyncDirectory.prototype.processItem = function(itemId, file, options) {
	throw new Error('Must be implemented by subclass');
};

/**
 * Processes multiple items at once
 * 
 * @function
 * @abstract
 * @param {Array.String} items Array of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
AbstractProviderByAsyncDirectory.prototype.processItems = function(items, file, options) {
	throw new Error('Must be implemented by subclass');
};

module.exports = AbstractProviderByAsyncDirectory;
