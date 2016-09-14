var AbstractProviderByMap = require('../../provider/abstractProviderByMap.js');
/**
 * Uses the passed in map to provide Filters. 
 *
 * @param {Map} map The object structure of the raw Filters to use.  
 */
function FilterProviderByMap(map) {
	AbstractProviderByMap.apply(this, [
		map, 
		this._processor]);
}

FilterProviderByMap.prototype = AbstractProviderByMap.prototype;
FilterProviderByMap.prototype.contructor = FilterProviderByMap;

FilterProviderByMap.prototype._processor = function(itemId, item) {
	return item;

module.exports = FilterProviderByMap;