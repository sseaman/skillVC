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
 * @see {@link AbstractProviderByMap}
 * @param {Map} map The object structure of the raw Filters to use.  
 * @param {Object.<String, Object>} Options for processing.  See {@link AbstractProviderByMap}
 */
function FilterProviderByMap(map, options) {
	this._map = map;
	AbstractProviderByMap.apply(this, [
		this._map, 
		this._processor,
		options]);
}

FilterProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
FilterProviderByMap.prototype.constructor = FilterProviderByMap;

/**
 * Since there is no processing required for filters, it just returns the item that was passed in
 * 
 * @protected
 * @function
 * @param  {String} itemId The key
 * @param  {Filter} item 
 * @return {Filter} The filter that was passed in as item
 */
FilterProviderByMap.prototype._processor = function(itemId, item) {
	return item;
}

/**
 * Returns all the pre filters (filters that implement executePre())
 * 
 * @return {Array.Filter} Array of all the loaded pre filters
 */
FilterProviderByMap.prototype.getPreFilters = function() {
	return this._map.pre;
}

/**
 * Returns all the post filters (filters that implement executePost())
 * 
 * @return {Array.Filter} Array of all the loaded post filters
 */
FilterProviderByMap.prototype.getPostFilters = function() {
	return this._map.post;
}

module.exports = FilterProviderByMap;