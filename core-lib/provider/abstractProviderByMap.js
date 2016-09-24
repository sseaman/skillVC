/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Uses the passed in map to provide items. This allows the most felxability as the map
 * can be anything the itemProcessor can handle, but it requires the most knowledge of the SkillVC system
 * to ensure everything is configured correctly in the Map
 *
 * This provider will still use the itemBuilder to build the item from the passed in JSON
 *
 * @abstract
 * @constructor
 * @param {Map} map The object structure of the raw items to use.  
 * @param {Method} itemProcessor  The method to call to process an item in the map (done at constuction of this object)
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the itemProcessor
 *        if the implementing class wants to pass information into the itemProcessor method
 */
function AbstractProviderByMap(map, itemProcessor, options) {
	this._items = (options && options.itemMap) 
		? options.itemMap
		: {};
		
	this._options = options;

	for (var key in map) {
		this._items[key] = itemProcessor(key, map[key], options);
	}
}

/**
 * Returns the item based on the itemId
 *
 * @function
 * @param  {String} itemId The id of the item to retrieve. 
 * @return {Object}  The item.  Null if no item is found
 */
AbstractProviderByMap.prototype.getItem = function(itemId) {
	return this._items[itemId];
}

module.exports = AbstractProviderByMap;