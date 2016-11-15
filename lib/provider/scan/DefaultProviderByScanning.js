/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultJSFilenameFormatter = require ('../defaultJSFilenameFormatter.js');
var DefaultJSONFilenameFormatter = require ('../defaultJSONFilenameFormatter.js');
var DefaultResponseBuilder = require ('../../response/defaultResponseBuilder.js');
var svUtil = require('../../util.js');
var providerUtil = require('../providerUtil.js');
var path = require('path');
var log = require('winston-simple').getLogger('ProviderByScanning');

var compressionList = ['filters', 'sessionHandlers'];
var alreadyLoaded = {};

/**
 * Loads filters, intentHandlers, sessionHandlers, and responses by scanning all of the passed in files
 * for the method signatures that define each of the types.  This model allows one object to
 * handle all types (except responses).  As responses are pure JSON, they cannot be detected by function
 * signatures and have to be detected by filename signature.
 *
 * The internal data structure that is made available via getItem() is:
 * @example
 * {
 *		sessionHandlers : {
 *			start : [],
 *			end : []
 *		},
 *		filters : {
 *			pre : [],
 *			post : []
 *		},
 *		intentHandlers : {},
 *		responses : {}
 * };
 * 
 * 
 * @constructor
 * @implements {Provider}
 * @see  {@link Filter}
 * @see  {@link IntentHandler}
 * @see  {@link SessionHandler}
 * @see  {@link Response}
 * @param {String} files The files to scan
 * @param {Object.<String, Object>} options Options for scanning 
 * @param {FilenameFormatter} [options.responseFilenameFormatter=DefaultFilenameFormatter] 
 *        	The filename formatter to use to detect responses names from the file name
 * @param {FilenameFormatter} [options.intentFilenameFormatter=DefaultFilenameFormatter] 
 *        	As intents are not required to have a getIntentsList, and instead can be derived from filename,
 *        	a @{link FilenameFormatter} is required to determine the intent name from the file name
 * @param {ResponseBuilder} [options.responseBuilder=DefaultResponseBuilder] The ResponseBuilder to use when building responses. Defaults to DefaultResponseBuilder
 * @param {String} [options.fileEncoding=utf8] The file encoding to use when reading files
 */
function DefaultProviderByScanning(files, options) {
	// map for the types
	this._items = {
		sessionHandlers : {
			start : [],
			end : []
		},
		filters : {
			pre : [],
			post : []
		},
		intentHandlers : {},
		responses : {}
	};

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._intentFilenameFormatter = (options && options.intentFilenameFormatter) 
		?options.intentFilenameFormatter
		: new DefaultJSFilenameFormatter();

	this._responseFilenameFormatter = (options && options.responseFilenameFormatter) 
		? options.responseFilenameFormatter
		: new DefaultJSONFilenameFormatter();

	var loaded;
	var isResponse = true;
	for (var fileIdx=0;fileIdx<files.length;fileIdx++) {
		if (!alreadyLoaded[files[fileIdx]]) {
			log.info("Processing file "+files[fileIdx]);

			// load so we can see what it is
			loaded = svUtil.instantiate(path.resolve(process.cwd(),files[fileIdx])); 

			providerUtil.addFunctions(loaded, { 'name' : path.parse(files[fileIdx]).name });

			// reset for next pass
			isResponse = true;

			// intent
			if (svUtil.isFunction(loaded.handleIntent)) {
				isResponse = false;
				if (svUtil.isFunction(loaded.getIntentsList)) {
					var handledIntents = loaded.getIntentsList();
					for (var hIdx=0;hIdx<handledIntents.length;hIdx++) {
						this._items.intentHandlers[handledIntents[hIdx]] = loaded;
						log.info('Loaded intent handler '+loaded.getName()+ ' for intent '+handledIntents[hIdx]);
					}
				}
				else {
					var intentName = this._intentFilenameFormatter.parse(files[fileIdx])[0];
					this._items.intentHandlers[intentName] = loaded;
					log.info('Loaded intent handler '+loaded.getName()+ ' for intent '+intentName);
				}
			}
			// filter
			if (svUtil.isFunction(loaded.executePre)) {
				isResponse = false;
				this._populate('filter', 'pre', this._items.filters.pre, loaded);
			}
			if (svUtil.isFunction(loaded.executePost)) {
				isResponse = false;
				this._populate('filter', 'post', this._items.filters.post, loaded);
			}
			// session
			if (svUtil.isFunction(loaded.sessionStart)) {
				isResponse = false;
				this._populate('session', 'start', this._items.sessionHandlers.start, loaded);
			}
			if (svUtil.isFunction(loaded.sessionEnd)) {
				isResponse = false;
				this._populate('session', 'end', this._items.sessionHandlers.end, loaded);
			}
			// response
			if (isResponse) {
				var responseId = this._responseFilenameFormatter.parse(files[fileIdx])[0];
				var parsedFileName = path.parse(files[fileIdx]);
				log.debug('Loaded response '+parsedFileName.base+' as id '+responseId);
				this._items.responses[responseId] = this._responseBuilder.withResponseId(responseId).withJSON(loaded).build();
			}

			alreadyLoaded[files[fileIdx]] = true;
		}
	}

	// Compress arrays in case someone put one at 1 and the next at 99
	for (var i=0;i<compressionList.length;i++) {
		for (var key in this._items[compressionList[i]]) {
			this._items[compressionList[i]][key] = svUtil.compressArray(this._items[compressionList[i]][key]);
		}
	}
}

DefaultProviderByScanning.prototype._populate = function(type, stage, items, loaded) {
	var position = items.length; // default to no getOrder
	if (svUtil.isFunction(loaded.getOrder)) {
		position = loaded.getOrder();
		items[position] = loaded;
	}
	else {
		items.push(loaded);
	}
	log.info('Loaded '+type+' handler '+loaded.getName()+' for '+ stage + ', position '+ position);
};

/**
 * Returns the item stored under the itemId.  May be null
 * 
 * @function
 * @name Provider#getItem
 * @param {String} itemId The Id of the item to return
 * @return {Object} The item corresponding to the itemId
 */
DefaultProviderByScanning.prototype.getItem = function(itemId) {
	return this._items[itemId];
};

/**
 * Returns all of the items stored.  May be null
 * 
 * @function
 * @name Provider#getItems
 * @return {Object} All the items being managed by they provider
 */
DefaultProviderByScanning.prototype.getItems = function() {
	return this._items;
};

module.exports = DefaultProviderByScanning;