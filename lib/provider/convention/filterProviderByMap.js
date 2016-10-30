/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../abstractProviderByMap.js');

/**
 * Uses the passed in map to provide Filters. 
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
function FilterProviderByMap(map, options) {
	this._map = map;
	AbstractProviderByMap.apply(this, [
		this._map, 
		options]);
}

FilterProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
FilterProviderByMap.prototype.constructor = FilterProviderByMap;

/**
 * 
 * 
 * @function
 * @param {Map} items Mapof the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
FilterProviderByMap.prototype.processItem = function(items, itemId, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	items[itemId] = map[itemId];
};

/**
 * 
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)\
 */
FilterProviderByMap.prototype.processItems = function(items, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	for (var key in map) {
		items[key] = map[key];
	}
};

/**
 * Returns all the pre filters (filters that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre filters
 */
FilterProviderByMap.prototype.getPreFilters = function() {
	return this._map.pre;
};

/**
 * Returns all the post filters (filters that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post filters
 */
FilterProviderByMap.prototype.getPostFilters = function() {
	return this._map.post;
};

module.exports = FilterProviderByMap;