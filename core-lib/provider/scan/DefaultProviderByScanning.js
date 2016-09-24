/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultJSFilenameFormatter = require ('../defaultJSFilenameFormatter.js');
var DefaultJSONFilenameFormatter = require ('../defaultJSONFilenameFormatter.js');
var DefaultCardBuilder = require ('../../card/defaultCardBuilder.js');
var log = require('../../skillVCLogger.js').getLogger('ProviderByScanning');
var svUtil = require('../../util.js');
const fs = require('fs');
const path = require('path');
const compressionList = ['filters', 'sessionHandlers'];
var alreadyLoaded = {};

/**
 * Loads filters, intentHandlers, sessionHandlers, and cards by scanning all of the passed in files
 * for the method signatures that define each of the types.  This model allows one object to
 * handle all types (except cards).  As cards are pure JSON, they cannot be detected by function
 * signatures and have to be detected by filename signature.
 * 
 * @constructor
 * @implements {Provider}
 * @see  {@link Filter}
 * @see  {@link IntentHandler}
 * @see  {@link SessionHandler}
 * @see  {@link Card}
 * @param {String} files The files to scan
 * @param {Object.<String, Object>} options
 * @param {FilenameFormatter} [options.cardFilenameFormatter=DefaultJSONFilenameFormatter] 
 *        	The filename formatter to use to detect cards 
 * @param {FilenameFormatter} [options.intentFilenameFormatter=DefaultJSFilenameFormatter] 
 *        	As intents are not required to have a getIntentsList, and instead can be derived from filename,
 *        	a @{link FilenameFormatter} is required to determine the intent name if no getIntentsList 
 *        	is found
 * @param {CardBuilder} [options.cardBuilder=DefaultCardBuilder] The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
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
		cards : {}
	};

	this._cardBuilder = (options && options.cardBuilder) 
		? options.cardBuilder
		: new DefaultCardBuilder();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._jsFilenameFormatter = (options && options.intentFilenameFormatter) 
		?options.intentFilenameFormatter
		: new DefaultJSFilenameFormatter();

	this._jsonFilenameFormatter = (options && options.cardFilenameFormatter) 
		? options.cardFilenameFormatter
		: new DefaultJSONFilenameFormatter();

	var loaded;
 	for (var fileIdx=0;fileIdx<files.length;fileIdx++) {
		if (!alreadyLoaded[files[fileIdx]]) {
			log.verbose("Processing file "+files[fileIdx]);
			loaded = require(process.cwd()+path.sep+files[fileIdx]); 
			
			// card...
			// TODO: See if I can detect this by just seeing if the file is nothing by JSON...
			// 			Would remove the need for the filenameFormatters
			if (this._jsonFilenameFormatter.isValid(files[fileIdx])) {
				loaded = require(process.cwd()+path.sep+files[fileIdx]); 

				log.verbose("XX:"+(loaded.constructor === {}.constructor));


				log.debug("Loading as card");
				var contents = fs.readFileSync(files[fileIdx], this._fileEncoding);
				if (contents != null) {
					var cardId = this._jsonFilenameFormatter.parse(files[fileIdx])[0];
					this._items.cards[cardId] = this._cardBuilder.withCardId(cardId).withString(contents).build();
				}
			}
			else {
				loaded = new (require(process.cwd()+path.sep+files[fileIdx])); 

				// intent
				if (svUtil.isFunction(loaded.handleIntent)) {
					log.debug("Loading as intentHandler");
					if (svUtil.isFunction(loaded.getIntentsList)) {
						var handledIntents = loaded.getIntentsList();
						for (var hIdx=0;hIdx<handledIntents.length;hIdx++) {
							this._items.intentHandlers[handledIntents[hIdx]] = loaded;
						}
					}
					else {
						this._items.intentHandlers[this._jsFilenameFormatter.parse(files[fileIdx])[0]] = loaded;
					}
				}
				// filter
				if (svUtil.isFunction(loaded.executePre) || svUtil.isFunction(loaded.executePreOnError)) {
					this._populate('filter', 'pre', this._items.filters.pre, loaded);
				}
				if (svUtil.isFunction(loaded.executePost) || svUtil.isFunction(loaded.executePostOnError)) {
					this._populate('filter', 'post', this._items.filters.post, loaded);
				}
				// session
				if (svUtil.isFunction(loaded.sessionStart)) {
					this._populate('session', 'start', this._items.sessionHandlers.start, loaded);
				}
				if (svUtil.isFunction(loaded.sessionEnd)) {
					this._populate('session', 'end', this._items.sessionHandlers.end, loaded);
				}
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
	log.verbose('Loaded '+type+' handler '+loaded.constructor.name+' for '+ stage + ', position '+ position);
}

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
}

module.exports = DefaultProviderByScanning;
