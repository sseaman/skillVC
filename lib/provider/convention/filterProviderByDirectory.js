/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderBySyncDirectory = require('../abstractProviderBySyncDirectory.js');
var svUtil = require('../../util.js');
var providerUtil = require('../providerUtil.js');
var path = require('path');
var log = require('winston-simple').getLogger('FilterProviderByDirectory');
var alreadyLoaded = {};

/**
 * Provides filters by loading all of the files in a directory as filters
 * 
 * Filters are loaded synchronously as there is no way to determine when a filter is required asynchronously
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProvider}
 * @see {@link AbstractProviderBySyncDirectory}
 * @param {String} directory The directory to read from
 * @param {Object} [options] Options for the was the directory is process
 * @param {String} [options.fileEncoding=utf8] The encoding of the files.
 * @param {FileNameFormatter} [options.filenameFormatter=DefaultJSFilenameFormatter] The FilenameFormmatter to use to parse the 
 *     filenames to determine name as well as how to format the id to become a filename. This object will only 
 *     load files that match the formatters isValid() method
 */
function FilterProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._filters = { 'pre' : [], 'post' : [] };
	
	if (alreadyLoaded[directory]) {
		log.debug('Filters already loaded. Skipping');
		return;
	}

	this._populate = function(stage, filters, fileName, loaded) {
		var position = filters.length; // default to no getOrder
		if (svUtil.isFunction(loaded.getOrder)) {
			position = loaded.getOrder();
			filters[position] = loaded;
		}
		else {
			filters.push(loaded);
		}
		log.info('Loaded filter '+loaded.getName()+' into stage '+ stage + ', position '+ position);
	};

	AbstractProviderBySyncDirectory.apply(this, [
		directory, 
		options]);

	// function to compress array in case someone put one at 1 and the next at 99
	for (var key in this._filters) {
		this._filters[key] = svUtil.compressArray(this._filters[key]);
	}

	alreadyLoaded[directory] = true;
}

FilterProviderByDirectory.prototype = Object.create(AbstractProviderBySyncDirectory.prototype);
FilterProviderByDirectory.prototype.constructor = FilterProviderByDirectory;

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
FilterProviderByDirectory.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Does not support the processing of individual items');
};

/**
 * Processes multiple items at once
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
FilterProviderByDirectory.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/

	var loaded = svUtil.instantiate(fileName);

	providerUtil.addFunctions(loaded, { 'name' : path.parse(fileName).name });

	if (svUtil.isFunction(loaded.executePre)) {
		this._populate('pre', this._filters.pre, fileName, loaded);
		items['pre'] = this._filters.pre; // put into items so getItem() works
	}
	if (svUtil.isFunction(loaded.executePost)) {
		this._populate('post', this._filters.post, fileName, loaded);
		items['post'] = this._filters.post; // put into items so getItem() works
	}
};

/**
 * Returns all the pre filters (filters that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre filters
 */
FilterProviderByDirectory.prototype.getPreFilters = function() {
	return this._filters.pre;
};

/**
 * Returns all the post filters (filters that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post filters
 */
FilterProviderByDirectory.prototype.getPostFilters = function() {
	return this._filters.post;
};

module.exports = FilterProviderByDirectory;
