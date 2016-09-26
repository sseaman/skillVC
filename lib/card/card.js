/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Represents a card
 *
 * @param {String} id The Id of the card
 * @param {JSON} json The JSON of the card
 * @param {FormatterManager} [formatterManagaer] The formatterManager to use on the card
 *
 * @class
 * @constructor
 */
function Card(id, json, formatterManagaer) {
	this._id = id;
	this._json = json;
	this._formatterManager = formatterManagaer;
}

/**
 * Returns the Id of the card
 *
 * @function
 * @return {String} The Id of the card
 */
Card.prototype.getId = function() {
	return this._id;
}

/**
 * Returns the JSON of the card, with no formatting applied
 *
 * @function
 * @return {JSON} The JSON of the card
 */
Card.prototype.getRawJSON = function() {
	return this._json;
}

/**
 * Returns the FormatterManager used by this card.  Can be null
 *
 * @function
 * @return {FormatterManager} The FormatterManager
 */
Card.prototype.getFormatterManager = function() {
	return this._formatterManager;
}

/**
 * Scan the entire card and format according to the values Map and the formatterManager that is registered with the card
 *    (which is registered during the Builder or Factory part)
 *
 * @function
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the card
 * @return {JSON} The card JSON with the formatting applied.  If not FormatterManager was provided, the unformatted JSON will be returned
 */
Card.prototype.render = function(valuesMap) {
	if (valuesMap && this._formatterManager) {
		return this._formatterManager.format(valuesMap);
	}
	return this._json;
}

module.exports = Card;