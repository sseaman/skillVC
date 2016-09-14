/**
 * Uses the passed in map to provide items. 
 *
 * This provider will still use the itemBuilder to build the item from the passed in JSON
 *
 * @param {Map} map The object structure of the raw items to use.  
 */
function AbstractProviderByMap(map, itemProcessor) {
	this._items = {};
	for (var key in map) {
		this._items[key] = itemProcessor(key, map[key]);
	}
}

/**
 * Returns the item based on the itemId
 * 
 * @param  {String} itemId The id of the item to retrieve. 
 * @return {item}  The item.  Null if no item is found
 */
AbstractProviderByMap.prototype.getItem = function(itemId) {
	return this._items[itemId];
}

module.exports = AbstractProviderByMap;