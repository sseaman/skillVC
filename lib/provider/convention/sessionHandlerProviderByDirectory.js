/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderBySyncDirectory = require('../abstractProviderBySyncDirectory.js');
var DefaultJSFilenameFormatter = require ('../defaultJSFilenameFormatter.js');
var log = require('winston-simple').getLogger('FilterProviderByDirectory');
var svUtil = require('../../util.js');
const path = require('path');
const fs = require('fs');
var alreadyLoaded = {};

/**
 * Provides Session Handlers by loading all of the files in a directory as Session Handlers
 * 
 * items are loaded synchronously as there is no way to determine when a filter is required asynchronously
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
function SessionHandlerProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._items = { 'start' : [], 'end' : [] };
	
	if (alreadyLoaded[directory]) {
		log.verbose('SessionHandlers already loaded. Skipping');
		return;
	}

	this._populate = function(stage, items, fileName) {
		var loaded = new (require(fileName));
		var position = items.length; // default to no getOrder
		if (svUtil.isFunction(loaded.getOrder)) {
			position = loaded.getOrder();
			items[position] = loaded;
		}
		else {
			items.push(loaded);
		}
		log.verbose('Loaded session handler '+path.parse(fileName).base+' for '+ stage + ', position '+ position);
	}

	AbstractProviderBySyncDirectory.apply(this, [
		directory, 
		options]);

	// function to compress array in case someone put one at 1 and the next at 99
	for (var key in this._items) {
		this._items[key] = svUtil.compressArray(this._items[key]);
	}

	alreadyLoaded[directory] = true;
}

SessionHandlerProviderByDirectory.prototype = Object.create(AbstractProviderBySyncDirectory.prototype);
SessionHandlerProviderByDirectory.prototype.constructor = SessionHandlerProviderByDirectory;

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
SessionHandlerProviderByDirectory.prototype.processItem = function(itemId, fileName, options) {
	log.verbose('Loading all items at once...');
	if (svUtil.isFunction(loaded.sessionStart)) {
		this._populate('start', this._items.start, fileName);
	}
	if (svUtil.isFunction(loaded.sessionEnd)) {
		this._populate('end', this._items.end, fileName);
	}
}

/**
 * Processes multiple items at once
 * 
 * @function
 * @param {Array.String} items Array of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
SessionHandlerProviderByDirectory.prototype.processItems = function(itemId, fileName, options) {
	this.processItem(null, fileName, options);
}

/**
 * Returns all the pre items (items that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre items
 */
SessionHandlerProviderByDirectory.prototype.getStartSessionHandlers = function() {
	return this._items.start;
}

/**
 * Returns all the post items (items that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post items
 */
SessionHandlerProviderByDirectory.prototype.getEndSessionHandlers = function() {
	return this._items.end;
}

module.exports = SessionHandlerProviderByDirectory;
