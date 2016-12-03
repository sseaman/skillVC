/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */

/**
 * Represents a response
 *
 * @constructor
 * @param {String} id The Id of the response
 * @param {JSON} json The JSON of the response
 * @param {FormatterManager} [formatterManagaer] The formatterManager to use on the response
 *
 * @class
 * @constructor
 */
function Response(id, json, formatterManagaer) {
	this._id = id;
	this._json = json;
	this._formatterManager = formatterManagaer;
}

/**
 * Returns the Id of the response
 *
 * @function
 * @return {String} The Id of the response
 */
Response.prototype.getId = function() {
	return this._id;
};

/**
 * Returns the JSON of the response, with no formatting applied
 *
 * @function
 * @return {JSON} The JSON of the response
 */
Response.prototype.getRawJSON = function() {
	return this._json;
};

/**
 * Returns the FormatterManager used by this response.  Can be null
 *
 * @function
 * @return {FormatterManager} The FormatterManager
 */
Response.prototype.getFormatterManager = function() {
	return this._formatterManager;
};

/**
 * Renders a response
 * 
 * @function
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @returns {String} The rendered string
 */
Response.prototype.render = function(valuesMap) {
	return this._format(valuesMap);
};

/**
 * Format according to the values Map and the formatterManager that is registered with the response
 *    (which is registered during the Builder or Factory part)
 *
 * @function
 * @private
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @return {JSON} The response JSON with the formatting applied.  If not FormatterManager was provided, the unformatted JSON will be returned
 */ 
Response.prototype._format = function(valuesMap) {
	if (valuesMap && this._formatterManager) {
		return JSON.parse(this._formatterManager.format(JSON.stringify(this._json), valuesMap));
	}
	return this._json;
};

module.exports = Response;