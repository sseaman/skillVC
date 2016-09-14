/**
 * Manages cards
 *
 * @param {[CardProvider]} cardProviders An array of card providers that will supply cards
 */
function DefaultCardManager(cardProviders) {
	// if I really want to be overly nice.. but I want to keep things performant, so commented our for now
	// for (var i=0;i<cardProviders.length;i++) {
	// 	if (!typeof(cardProviders[i].getItem) == "function") {
	// 		throw Error ("CardProvider specified in array does not implement .getItem(String)");
	// 	}
	// }

	this._cardProviders = cardProviders;
	this._cards = {};
	this._cardNotFound = {};
}

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

	if (card == null && !this._cardNotFound[cardId]) { // card isn't in cache and was never looked for
		for (var i=0;i<this._cardProviders.length;i++) {
			// This could be expensive at is could cause all of the file loading to occur when looking for a card
			card = this._cardProviders[i].getItem(cardId);
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