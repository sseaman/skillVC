/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */

/**
 * Provides items by single file with multiple items defined in the file
 * 
 * items are loaded asynchronously but if a item is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @abstract
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @param {String} file The file to read all items from
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the itemProcessor
 *        if the implementing class wants to pass information into the itemProcessor method
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a item is requested
 * @param {String} [options.fileEncoding=utf8] The file encoding to use when reading files and directories
 * @param {Object.<String, Object>} [options.itemMap] A map that may be passed in to prime the internal map with.
 */
function AbstractProviderByFile(file, options) {
	if (!file) throw Error('file required');

	this._file = file;
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
		var processed = this.processItems(this._items, file, this._options);
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
		this.processItem(this._items, itemId, this._file, this._options); // didn't find it and haven't looked for it
		this._fileLoaded = true;
		item = this._items[itemId];
	}
	return item;
};

/**
 * Returns all items that were loaded
 *
 * @function
 * @return {Map} Map of the items where the Key is the itemId and the Value is the item itself
 */
AbstractProviderByFile.prototype.getItems = function() {
	return this._items;
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
AbstractProviderByFile.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Must be implemented by subclass');
};

/**
 * Processes multiple items at once
 * 
 * @function
 * @abstract
 * @param {Map} items Map of the items being processeds
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
AbstractProviderByFile.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Must be implemented by subclass');
};

module.exports = AbstractProviderByFile;