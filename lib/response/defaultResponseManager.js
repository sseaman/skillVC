/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderManager = require('../provider/abstractProviderManager.js');
var DefaultResponseBuilder = require('./DefaultResponseBuilder.js');
var HandlebarsFormatterManager = require('./formatter/HandlebarsFormatterManager.js');

/**
 * Manages responses
 *
 * @constructor
 * @implements {ResponseManager}
 * @param {Array.Provider} [providers] An array of response providers that will supply responses
 */
function DefaultResponseManager(providers) {
	this._responses = {};
	this._notFound = {};

	this._askResponse = new DefaultResponseBuilder()
		.withFormatterManager(new HandlebarsFormatterManager())
		.withJSON(
			{ 
				"custom" : {
					"response" : {
						"outputSpeech" : {
							"text": "{{msg}}"
						}
					},
					"reprompt" : {
						"outputSpeech" : {
							"text" : "{{reprompt}}"
						}
					},
				}
			}
		)
		.build();

	this._tellResponse = new DefaultResponseBuilder()
		.withFormatterManager(new HandlebarsFormatterManager())
		.withJSON(
			{ 
				"custom" : {
					"response" : {
						"outputSpeech" : {
							"text": "{{msg}}"
						} 
					}
				}
			}
		)
		.build();
	
	AbstractProviderManager.apply(this, [providers]);
}

DefaultResponseManager.prototype = Object.create(AbstractProviderManager.prototype);
DefaultResponseManager.prototype.constructor = DefaultResponseManager;

/**
 * Returns the specified response by looking through the defined providers.
 *
 * Optimized to only look once and if not found, will never look through the provider again.  This prevents
 * adding responses to the provider at a later time, but improves repeated lookup performance
 *
 * @function
 * @param  {String} responseId The id of the response
 * @return {Response} The response.  If not found, returns null
 */
DefaultResponseManager.prototype.get = function(responseId) {
	var response = this._responses[responseId];

	if (!response && !this._notFound[responseId]) { // response isn't in cache and was never looked for
		var providers = this.getRegisteredProviders();

		for (var i=0;i<providers.length;i++) {
			// This could be expensive at is could cause all of the file loading to occur when looking for a response
			response = providers[i].getItem(responseId);

			if (response) {
				this._responses[responseId] = response; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (response === null) this._notFound[responseId] = true; // never will find it, so record this fact so we don't ever look again
	}

	return response;
};

/**
 * Helper method that retrieves and renders a response all in one call
 * 
 * @param  {String} responseId The id of the response
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @return {String} The rendered string to send back to Alexa
 */
DefaultResponseManager.prototype.render = function(responseId, valuesMap) {
	var response = this.get(responseId);
	if (!response) {
		throw new Error('Could not find response with id '+responseId);
	}
	return response.render(valuesMap);
};

/**
 * Helper method to do an ask similar to the alexa api
 * @param  {String} msg      The message to ask to the user
 * @param  {String} reprompt THe reprompt message
 * @return {String} The rendered string to send back to Alexa
 */
DefaultResponseManager.prototype.ask = function(msg, reprompt) {
	return this._askResponse.render(
		{
			'msg' : msg,
			'reprompt' : reprompt
		}
	);
};

/**
 * Helper method to do an ask similar to the alexa api
 * @param  {String} msg      The message to tell to the user
 * @return {String} The rendered string to send back to Alexa
 */
DefaultResponseManager.prototype.tell = function(msg) {
	return this._tellResponse.render(
		{'msg' : msg}
	);
};

module.exports = DefaultResponseManager;