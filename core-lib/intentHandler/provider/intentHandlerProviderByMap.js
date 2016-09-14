var AbstractProviderByMap = require('../../provider/abstractProviderByMap.js');
/**
 * Uses the passed in map to provide intentHandlers. 
 *
 * @param {Map} map The object structure of the raw intentHandlers to use.  
 */
function IntentHandlerProviderByMap(map) {
	AbstractProviderByMap.apply(this, [
		map, 
		this._processor]);
}

IntentHandlerProviderByMap.prototype = AbstractProviderByMap.prototype;
IntentHandlerProviderByMap.prototype.contructor = IntentHandlerProviderByMap;

IntentHandlerProviderByMap.prototype._processor = function(itemId, item) {
	return item;
}

module.exports = IntentHandlerProviderByMap;