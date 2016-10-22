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
 * @param {Object.<String, Object>} Options for processing.  See {@link AbstractProviderByMap}
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
 * Since there is no processing required, it just returns the item that was passed in
 * 
 * @function
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
FilterProviderByMap.prototype.prcoessItem = function(itemId, map, options) {
	return map[itemId];
};

/**
 * Since there is no processing required, it just returns the map that was passed in
 * 
 * @function
 * @abstract
 * @param {Array.String} items Array of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
FilterProviderByMap.prototype.processItems = function(itemId, map, options) {
	return map;
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