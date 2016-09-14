var AbstractProviderByMap = require('../../provider/abstractProviderByMap.js');
/**
 * Uses the passed in map to provide cards. 
 *
 * This provider will still use the CardBuilder to build the card from the passed in JSON
 *
 * @param {Map} map The object structure of the raw cards to use.  
 * @param {Object} options Options for the was the directory is process
 * @param {CardBuilder} options.cardBuilder The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
 */
function CardProviderByMap(map, options) {
	this._cardBuilder = (options && options.cardBuilder) 
		? options.cardBuilder
		: new DefaultCardBuilder();

	AbstractProviderByMap.apply(this, [
		map, 
		this._processCard]);
}

CardProviderByMap.prototype = AbstractProviderByMap.prototype;
CardProviderByMap.prototype.contructor = CardProviderByMap;

CardProviderByMap.prototype._processCard = function(cardId, card) {
	return this._cardBuilder.withCardId(cardId).withJSON(card).build();
}

module.exports = CardProviderByMap;