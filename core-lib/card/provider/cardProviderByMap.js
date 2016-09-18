/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../../provider/abstractProviderByMap.js');

/**
 * Uses the passed in map to provide cards. 
 *
 * This provider will still use the CardBuilder to build the card from the passed in JSON
 *
 * @param {Map} map The object structure of the raw cards to use.  
 * @param {Object} options Options for the was the directory is process
 * @param {CardBuilder} [options.cardBuilder=DefaultCardBuilder] The CardBuilder to use when building cards
 *
 * @class 
 * @constructor
 * @implements {Provider}
 * @see {@link DefaultCardBuilder}
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

/**
 * Uses the CardBuilder to build a card.
 *
 * @protected
 * @function
 * @param  {String} cardId The Id of the card
 * @param  {JOSN} card     The JSON that defines the card
 * @return {Card}          The resulting card
 */
CardProviderByMap.prototype._processCard = function(cardId, card) {
	return this._cardBuilder.withCardId(cardId).withJSON(card).build();
}

module.exports = CardProviderByMap;