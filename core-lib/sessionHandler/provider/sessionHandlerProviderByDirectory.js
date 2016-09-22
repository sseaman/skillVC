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
var alreadyLoaded = {};

/**
 * Provides Session Handlers by loading all of the files in a directory as Session Handlers
 * 
 * items are loaded synchronously as there is no way to determine when a filter is required asynchronously
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
function SessionHandlerProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._items = { 'start' : [], 'end' : [] };
	
	if (alreadyLoaded[directory]) {
		log.verbose('SessionHandlers already loaded. Skipping');
		return;
	}

	this._populate = function(stage, items, loaded) {
		var position = items.length; // default to no getOrder
		if (svUtil.isFunction(loaded.getOrder)) {
			position = loaded.getOrder();
			items[position] = loaded;
		}
		else {
			items.push(loaded);
		}
		log.verbose('Loaded session handler '+loaded.constructor.name+' for '+ stage + ', position '+ position);
	}

	AbstractProviderBySyncDirectory.apply(this, [
		directory, 
		this._process]);

	// function to compress array in case someone put one at 1 and the next at 99
	for (var key in this._items) {
		this._items[key] = svUtil.compressArray(this._items[key]);
	}

	alreadyLoaded[directory] = true;
}

SessionHandlerProviderByDirectory.prototype = Object.create(AbstractProviderBySyncDirectory.prototype);
SessionHandlerProviderByDirectory.prototype.constructor = SessionHandlerProviderByDirectory;


SessionHandlerProviderByDirectory.prototype._process = function(loaded, options) {
	log.verbose('Loading all items at once...');
	if (svUtil.isFunction(loaded.sessionStart)) {
		this._populate('start', this._items.start, loaded);
	}
	if (svUtil.isFunction(loaded.sessionEnd)) {
		this._populate('end', this._items.end, loaded);
	}
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
