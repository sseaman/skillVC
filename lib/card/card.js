/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
const responseUtil = require('../responseUtil.js');

/**
 * Represents a card
 *
 * @constructor
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
 * Renders a response with a session enabled and a followup prompt
 * 
 * @function
 * @param  {Object.<String,Object>} session The session to use in the response
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @return {JSON} The JSON that represents the final response
 */
Card.prototype.renderAsk = function(session, valuesMap) {
	return responseUtil.ask(session, this._format(valuesMap));

}

/**
 * Renders a response with no session and no follow up prompt
 * 
 * @function
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @return {JSON} The JSON that represents the final response
 */
Card.prototype.renderTell = function(valuesMap) {
	return responseUtil.tell(this._format(valuesMap));
}

/**
 * Format according to the values Map and the formatterManager that is registered with the response
 *    (which is registered during the Builder or Factory part)
 *
 * @function
 * @private
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @return {JSON} The response JSON with the formatting applied.  If not FormatterManager was provided, the unformatted JSON will be returned
 */ 
Card.prototype._format = function(valuesMap) {
	if (valuesMap && this._formatterManager) {
		return this._formatterManager.format(valuesMap);
	}
	return this._json;
}

module.exports = Card;