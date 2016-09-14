const fs = require('fs');
const path = require('path');

/**
 * Provides an item by loading all of the files in a directory
 * 
 * Items are loaded asynchronously but if an item is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} directory The directory to read all items from
 * @param {Object} options Options for the was the directory is process
 * @param {String} options.fileEncoding The encoding of the files.  Defaults to utf8
 * @param {FileNameFormatter} options.filenameFormatter The FilenameFormmatter to use to parse the filenames to determine item file name as well
 *     as how to format the itemId to become a filename. This object will only load files that match the formatters isValid() method
 */
function AbstractProviderByDirectory(directory, fileNameFormatter, itemProcessor) {
	if (!directory) throw Error('directory required');
	if (!fileNameFormatter) throw Error('fileNameFormatter required');
	if (!itemProcessor) throw Error('itemProcessor required');

	this._directory = path.normalize(directory);
	this._directory += (this._directory.endsWith(path.delimiter))
		? ''
		: path.sep;

	this._filenameFormatter = fileNameFormatter;
	this._itemProcessor = itemProcessor;

	this._items = {};
	this._itemNotFound = {};

	var cp = this; // scope
	fs.readdir(directory, function(err, files) { // async read so we don't lock on construction
		if (files) {
			var itemId = null;
			var processed = null;
			for (var fileIdx=0;fileIdx<files.length;fileIdx++) {
				if (cp._filenameFormatter.isValid(files[fileIdx])) { // only process files that match the filenameFormatter support
					itemId = cp._filenameFormatter.parse(files[fileIdx])[0];

					if (!cp._items[itemId] && !cp._itemNotFound[itemId]) { // wasn't already retrieved
						processed = cp._itemProcessor(itemId, cp._directory + files[fileIdx]);

						for (var pIdx=0;pIdx<processed.length;pIdx++) {
							cp._items[processed[pIdx].itemId] = processed[pIdx].item;
						}
					}
				}
			}
		}
		else if (err) {
			throw Error('Could not read directory '+directory);
		}
	});
}

/**
 * Returns the item based on the itemId
 * 
 * @param  {String} itemId The id of the item to retrieve. If the item is not already loaded, it will load it
 * @return {Object}  The item.  Null if no item is found
 */
AbstractProviderByDirectory.prototype.getItem = function(itemId) {
	var item = this._items[itemId];

	if (item == null && !this._itemNotFound[itemId]) { 
		// if I don't find it in the cache, look for it as this could still be loading and could be faster 
		// if there are a lot of files in the dircetory
		var processed = this._itemProcessor(itemId, this._directory + this._filenameFormatter.format(itemId));
		if (processed == null) {
			this._itemNotFound[itemId] = true; 
		}
		else {
			for (var i=0;i<processed.length;i++) {
				this._items[processed[i].itemId] = processed[i].item;
			}
			item = this._items[itemId];
		}
	}
	return item;
}

/**
 * Returns all items that were loaded
 * 
 * @return {Map} Map of the items where the Key is the itemId and the Value is the item itself
 */
AbstractProviderByDirectory.prototype.getItems = function() {
	return this._items;
}

module.exports = AbstractProviderByDirectory;
