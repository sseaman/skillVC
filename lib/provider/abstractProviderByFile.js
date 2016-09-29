/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
const fs = require('fs');

/**
 * Provides items by single file with multiple items defined in the file
 * 
 * items are loaded asynchronously but if a item is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @abstract
 * @constructor
 * @param {String} file The file to read all items from
 * @param {Method} itemProcessor  The method to call to process an item that is read from the file
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the itemProcessor
 *        if the implementing class wants to pass information into the itemProcessor method
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a item is requested
 * @param {String} [options.fileEncoding=utf8] The file encoding to use when reading files and directories
 * @param {Object.<String, Object>} [options.itemMap] A map that may be passed in to prime the internal map with.
 */
function AbstractProviderByFile(file, itemProcessor, options) {
	if (!file) throw Error('file required');
	if (!itemProcessor) throw Error('itemProcessor required');

	this._file = file;
	this._itemProcessor = itemProcessor;
	this._options = options;

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._preload = (options && options.preload) 
		? options.preload
		: false;

	this._items = (options && options.itemMap) 
		? options.itemMap
		: {};

	this._fileLoaded = false;

	if (this._preload) { // this is a blocking call as it is sync
		var processed = cp._itemProcessor(file, this_items, this._options);
		for (var i=0;i<processed.length;i++) {
			this._items[processed[i].itemId] = processed[i].item;
		}
		this._fileLoaded = true;
	}
}

/**
 * Returns the item based on the itemId
 *
 * @function
 * @param  {String} itemId The id of the item to retrieve. If the file is not already loaded, it will load it to look for the item
 * @return {item}  The item.  Null if no item is found
 */
AbstractProviderByFile.prototype.getItem = function(itemId) {
	var item = this._items[itemId];
	if (!item && !this._fileLoaded) {
		var processed = this._itemProcessor(this._file, this._items, this._options); // didn't find it and haven't looked for it
		for (var i=0;i<processed.length;i++) {
			this._items[processed[i].itemId] = processed[i].item;
		}
		this._fileLoaded = true;
		item = this._items[itemId];
	}
	return item;
}

/**
 * Returns all items that were loaded
 *
 * @function
 * @return {Map} Map of the items where the Key is the itemId and the Value is the item itself
 */
AbstractProviderByFile.prototype.getItems = function() {
	return this._items;
}

module.exports = AbstractProviderByFile;