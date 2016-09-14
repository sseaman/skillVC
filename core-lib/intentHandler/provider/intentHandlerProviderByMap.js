var AbstractProviderByMap = require('../../provider/abstractProviderByMap.js');
/**
 * Uses the passed in map to provide intentHandlers. 
 *
 * @param {Map} map The object structure of the raw intentHandlers to use.  
 */
function IntentHandlerProviderByMap(map) {
	AbstractProviderByMap.apply(this, [
		map, 
		this._processCard]);
}

IntentHandlerProviderByMap.prototype = AbstractProviderByMap.prototype;
IntentHandlerProviderByMap.prototype.contructor = IntentHandlerProviderByMap;

IntentHandlerProviderByMap.prototype._processCard = function(cardId, card) {
	return card;
}

module.exports = IntentHandlerProviderByMap;