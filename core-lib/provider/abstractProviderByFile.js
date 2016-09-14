const fs = require('fs');

/**
 * Provides items by a single file with multiple items defined in the file
 * 
 * items are loaded asynchronously but if a item is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} file The file to read all items from
 * @param {Object} options Options for the was the directory is process
 * @param {Boolean} options.preload Should the file be preloaded or only loaded when a item is requested (defaults to false)
 * @param {String} options.fileEncoding The encoding of the files.  Defaults to utf8
 * @param {itemBuilder} options.itemBuilder The itemBuilder to use when building items. Defaults to DefaultitemBuilder
 */
function AbstractProviderByFile(file, preload, itemProcessor) {
	if (!file) throw Error('file required');
	if (!preload) throw Error('preload required');
	if (!itemProcessor) throw Error('itemProcessor required');

	this._file = file;
	this._preload = _preload;
	this._itemProcessor = itemProcessor;

	this._items = {};
	this._fileLoaded = false;

	if (this._preload) { // this is a blocking call as it is sync
		var processed = cp._itemProcessor(file, this_items);
		for (var i=0;i<processed.length;i++) {
			this._items[processed[i].itemId] = processed[i].item;
		}
		this._fileLoaded = true;
	}
}

/**
 * Returns the item based on the itemId
 * 
 * @param  {String} itemId The id of the item to retrieve. If the file is not already loaded, it will load it to look for the item
 * @return {item}  The item.  Null if no item is found
 */
AbstractProviderByFile.prototype.getItem = function(itemId) {
	var item = this._items[itemId];
	if (!item && !this._fileLoaded) {
		var processed = this._itemProcessor(this._file, this._items); // didn't find it and haven't looked for it
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
 * @return {Map} Map of the items where the Key is the itemId and the Value is the item itself
 */
AbstractProviderByFile.prototype.getItems = function() {
	return this._items;
}

module.exports = AbstractProviderByFile;