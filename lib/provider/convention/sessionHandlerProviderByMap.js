/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../abstractProviderByMap.js');

/**
 * Uses the passed in map to provide SessionHandlers. 
 * 
 * The Map should contain two keys: 'pre' and 'post'.  The values of each should be
 * the an array of {@link Filter} objects.
 *
 * WARNING: At this time this object has not been tested in the SkillVC system and exists as a "ToDo"
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @see {@link AbstractProviderByMap}
 * @param {Map} map The object structure of the raw Filters to use.  
 * @param {Object.<String, Object>} options Options for processing.  See {@link AbstractProviderByMap}
 */
function SessionHandlerProviderByMap(map, options) {
	this._map = map;
	AbstractProviderByMap.apply(this, [
		map, 
		options]);
}

SessionHandlerProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
SessionHandlerProviderByMap.prototype.constructor = SessionHandlerProviderByMap;

/**
 * Since there is no processing required, it just returns the item that was passed in
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
SessionHandlerProviderByMap.prototype.processItem = function(items, itemId, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	items[itemId] = map[itemId];
};

/**
 * Since there is no processing required, it just returns the map that was passed in
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
SessionHandlerProviderByMap.prototype.processItems = function(items, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	for (var key in map) {
		items[key] = map[key];
	}
};

/**
 * Returns all the pre items (items that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre items
 */
SessionHandlerProviderByMap.prototype.getStartSessionHandlers = function() {
	return this._map['start'];
};

/**
 * Returns all the post items (items that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post items
 */
SessionHandlerProviderByMap.prototype.getEndSessionHandlers = function() {
	return this._map['end'];
};

module.exports = SessionHandlerProviderByMap;