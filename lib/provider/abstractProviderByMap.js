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
 * @implements {Processor}
 * @implements {ItemProcessor}
 * @param {Map} map The object structure of the raw items to use.  
 * @param {Object.<String, Object>} options Options for configuration. This can also be used as a map to pass to the itemProcessor
 *        if the implementing class wants to pass information into the itemProcessor method
 */
function AbstractProviderByMap(map, options) {
	this._items = (options && options.itemMap) 
		? options.itemMap
		: {};
		
	this._options = options;

	for (var key in map) {
		this._items[key] = this.processItem(key, map, options);
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
};

/**
 * Returns all of the items stored.  May be null
 *
 * @function
 * @return {Object} All the items being managed by they provider
 */
AbstractProviderByMap.prototype.getItems = function() {
	return this._items;
};

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @abstract
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
AbstractProviderByMap.prototype.processItem = function(itemId, map, options) {
	throw new Error('Must be implemented by subclass');
};

/**
 * Processes multiple items at once
 * 
 * @function
 * @abstract
 * @param {Array.String} items Array of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
AbstractProviderByMap.prototype.processItems = function(itemId, map, options) {
	throw new Error('Must be implemented by subclass');
};

module.exports = AbstractProviderByMap;