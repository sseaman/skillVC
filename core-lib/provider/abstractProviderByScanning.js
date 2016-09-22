/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var log = require('../skillVCLogger.js').getLogger('ProviderByScanning');
const fs = require('fs');
var svUtil = require('../util.js');
var alreadyLoaded = {};
const compressionList = ['filters', 'sessionHandlers'];

/**
 * 
 * @constructor
 * @implements {Provider}
 * @param  {[type]} files [description]
 * @return {[type]}       [description]
 */
function DefaultProviderByScanning(files, options) {
	// need to bring in the optsion for filenameformatters and card builders

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

	this._jsFilenameFormatter = new DefaultJSFilenameFormatter();
	this._jsonFilenameFormatter = new DefaultJSONFilenameFormatter();

	var loaded;
	for (var fileIdx=0;fileIdx<files.length;fileIdx++) {
		if (!alreadyLoaded[files[i]]) {
			// card...
			if (this._jsonFilenameFormatter.isValid(files[fileIdx])) {
				var contents = fs.readFileSync(file, this._fileEncoding);
				if (contents != null) {
					this._items.cards[this._jsonFilenameFormatter.parse(files[fileIdx])[0]] = 
						this._cardBuilder.withCardId(cardId).withString(contents).build();
			}
			else {
				loaded = new (require(process.cwd()+path.sep+files[fileIdx])); 

				// intent
				if (svUtil.isFunction(loaded.handleIntent)) {
					if (svUtil.isFunction(loaded.getIntentsList)) {
						var handledIntents = loaded.getIntentsList();
						for (var i=0;i<handledIntents.length;i++) {
							this._items.intentHandlers[handledIntents[i]] = loaded;
						}
					}
					else {
						this._items.intentHandlers[this._jsFilenameFormatter.parse(files[fileIdx])[0]] = loaded;
					}
				}
				// filter
				else if (svUtil.isFunction(loaded.executePre)) {
					this._populate('filter', 'pre', this._items.filters.pre, loaded);
				}
				else if (svUtil.isFunction(loaded.executePost)) {
					this._populate('filter', 'post', this._items.filters.post, loaded);
				}
				// session
				else if (svUtil.isFunction(loaded.sessionStart)) {
					this._populate('session', 'start', this._items.sessionHandlers.start, loaded);
				}
				else if (svUtil.isFunction(loaded.sessionEnd)) {
					this._populate('session', 'end', this._items.sessionHandlers.end, loaded);
				}
			}

			alreadyLoaded[files[i]] = true;
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

module.exports = AbstractProviderByScanning;
