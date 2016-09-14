var AbstractProviderManager = require('../provider/abstractProviderManager.js');

/**
 * Manages cards
 *
 * @param {[CardProvider]} cardProviders An array of card providers that will supply cards
 */
function DefaultCardManager(providers) {
	this._cards = {};
	this._cardNotFound = {};
	
	AbstractProviderManager.apply(this, [providers]);
}

DefaultCardManager.prototype = AbstractProviderManager.prototype;
DefaultCardManager.prototype.contructor = DefaultCardManager;

/**
 * Returns the specificed card by looking through the defined providers.
 *
 * Optimized to only look once and if not found, will never look through the provider again.  This prevents
 * adding cards to the provider at a later time, but improves repeated lookup performance
 * 
 * @param  {String} cardId The id of the card
 * @return {Card} The card.  If not found, returns null
 */
DefaultCardManager.prototype.getCard = function(cardId) {
	var card = this._cards[cardId];
	var providers = this.getRegisteredProviders();

	if (card == null && !this._cardNotFound[cardId]) { // card isn't in cache and was never looked for
		for (var i=0;i<providers.length;i++) {
			// This could be expensive at is could cause all of the file loading to occur when looking for a card
			card = providers[i].getItem(cardId);

			if (card != null) {
				this._cards[cardId] = card; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (card == null) this._cardNotFound[cardId] == true; // never will find it, so record this fact so we don't ever look again
	}

	return card;
}

module.exports = DefaultCardManager;