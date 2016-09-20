/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderBySyncDirectory = require('../../provider/abstractProviderBySyncDirectory.js');
var DefaultJSFilenameFormatter = require ('../../provider/defaultJSFilenameFormatter.js');
var log = require('../../skillVCLogger.js').getLogger('FilterProviderByDirectory');
var svUtil = require('../../util.js');
const path = require('path');
const fs = require('fs');
var filterProviderAlreadyLoaded = {};

/**
 * Provides filters by loading all of the files in a directory as filters
 * 
 * Filters are loaded synchronously as there is no way to determine when a filter is required asynchronously
 *
 * @constructor
 * @implements {Provider}
 * @see {@link AbstractProviderBySyncDirectory}
 * @param {String} directory The directory to read all cards from
 * @param {Object} [options] Options for the was the directory is process
 * @param {String} [options.fileEncoding=utf8] The encoding of the files.
 * @param {FileNameFormatter} [options.filenameFormatter=DefaultJSFilenameFormatter] The FilenameFormmatter to use to parse the 
 *     filenames to determine card name as well as how to format the cardId to become a filename. This object will only 
 *     load files that match the formatters isValid() method
 */
function FilterProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._filters = { 'pre' : [], 'post' : [] };
	
	if (filterProviderAlreadyLoaded[directory]) {
		log.verbose('Filters already loaded. Skipping');
		return;
	}

	this._populate = function(stage, filters, loaded) {
		var position = filters.length; // default to no getOrder
		if (svUtil.isFunction(loaded.getOrder)) {
			position = loaded.getOrder();
			filters[position] = loaded;
		}
		else {
			filters.push(loaded);
		}
		log.verbose('Loaded filter '+loaded.constructor.name+' into stage '+ stage + ', position '+ position);
	}

	AbstractProviderBySyncDirectory.apply(this, [
		directory, 
		this._process]);

	// function to compress array in case someone put one at 1 and the next at 99
	for (var key in this._filters) {
		var stages = this._filters[key];
		var newArray = [];
		for (var n = 0; n < stages.length; n++) {
		    if (stages[n]) {
		      newArray.push(stages[n]);
		    }
		}
		this._filters[key] = newArray;
	}

	filterProviderAlreadyLoaded[directory] = true;
}

FilterProviderByDirectory.prototype = Object.create(AbstractProviderBySyncDirectory.prototype);
FilterProviderByDirectory.prototype.constructor = FilterProviderByDirectory;


FilterProviderByDirectory.prototype._process = function(loaded, options) {
	log.verbose('Loading all filters at once...');
	if (svUtil.isFunction(loaded.executePre) || svUtil.isFunction(loaded.executePreOnError)) {
		this._populate('pre', this._filters.pre, loaded);
	}
	if (svUtil.isFunction(loaded.executePost)|| svUtil.isFunction(loaded.executePostOnError)) {
		this._populate('post', this._filters.post, loaded);
	}
}

/**
 * Returns all the pre filters (filters that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre filters
 */
FilterProviderByDirectory.prototype.getPreFilters = function() {
	return this._filters.pre;
}

/**
 * Returns all the post filters (filters that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post filters
 */
FilterProviderByDirectory.prototype.getPostFilters = function() {
	return this._filters.post;
}

module.exports = FilterProviderByDirectory;
