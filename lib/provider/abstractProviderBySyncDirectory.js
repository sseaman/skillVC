/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultJSFilenameFormatter = require ('./defaultJSFilenameFormatter.js');
var log = require('winston-simple').getLogger('FilterProviderByDirectory');
var svUtil = require('../util.js');
const path = require('path');
const fs = require('fs');
var alreadyLoaded = {};

/**
 * Provides an item by loading all of the files in a directory
 * 
 * Items are loaded synchronously.  This object should only be used to load files that must be processed immediately as it
 * will block execution until all the files in the directory have been processed.
 *
 * @constructor
 * @implements {Provider}
 * @param {String} directory The directory to read from
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the itemProcessor
 *        if the implementing class wants to pass information into the itemProcessor method
 * @param {FilenameFormatter} [options.filenameFormatter=DefaultJSFilenameFormatter] The FilenameFormmatter to use to 
 *     parse the filenames to determine item file name as well as how to format the itemId to become a filename. 
 *     This object will only load files that match the formatters isValid() method
 * @param {String} [options.fileEncoding=utf8] The file encoding to use when reading files and directories
 * @param {Object.<String, Object>} [options.itemMap] A map that may be passed in to prime the internal map with.
 */
function AbstractProviderBySyncDirectory(directory, itemProcessor, options) {
	if (!directory) throw Error('directory required');

	if (alreadyLoaded[directory]) {
		log.verbose('Filters already loaded. Skipping');
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
	var loaded = null;
	for (var i=0;i<files.length;i++) {
		if (this._filenameFormatter.isValid(files[i])) {
			loaded = new (require(process.cwd()+path.sep+this._directory+files[i])); 

			itemProcessor.apply(this, [loaded, options]);
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
}

module.exports = AbstractProviderBySyncDirectory;
