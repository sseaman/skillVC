/**
 * Represents a card
 * 
 * @param {JSON} json The JSON of the card
 * @param {FormatterManager} formatterManagaer The formatterManager to use on the card
 */
function Card(id, json, formatterManagaer) {
	this._id = id;
	this._json = json;
	this._formatterManager = formatterManagaer;
}

/**
 * Returns the Id of the card
 * 
 * @return {String} The Id of the card
 */
Card.prototype.getId = function() {
	return this._id;
}

/**
 * Returns the JSON of the card, with no formatting applied
 * 
 * @return {JSON} The JSON of the card
 */
Card.prototype.getRawJSON = function() {
	return this._json;
}

/**
 * Returns the FormatterManager used by this card.  Can be null
 * @return {FormatterManager} The FormatterManager
 */
Card.prototype.getFormatterManager = function() {
	return this._formatterManager;
}

/**
 * Scan the entire care and format according to the values Map and the formatterManager that is registered with the card
 *    (which is registered during the Builder or Factory part)
 * @param  {[type]} valuesMap 
 * @return {[type]}           [description]
 */
Card.prototype.render = function(valuesMap) {
	if (valuesMap && this._formatterManager) {
		return this._formatterManager.format(valuesMap);
	}
	return this._json;
}

module.exports = Card;