/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderManager = require('../provider/abstractProviderManager.js');

/**
 * Manages responses
 *
 * @param {Array.ResponseProvider} [responseProviders] An array of response providers that will supply responses
 *
 * @class 
 * @constructor
 * @implements {ResponseManager}
 */
function DefaultResponseManager(providers) {
	this._responses = {};
	this._notFound = {};
	
	AbstractProviderManager.apply(this, [providers]);
}

DefaultResponseManager.prototype = Object.create(AbstractProviderManager.prototype);
DefaultResponseManager.prototype.constructor = DefaultResponseManager;

/**
 * Returns the specificed response by looking through the defined providers.
 *
 * Optimized to only look once and if not found, will never look through the provider again.  This prevents
 * adding responses to the provider at a later time, but improves repeated lookup performance
 *
 * @function
 * @param  {String} responseId The id of the response
 * @return {Response} The response.  If not found, returns null
 */
DefaultResponseManager.prototype.getResponse = function(responseId) {
	var response = this._responses[responseId];
	var providers = this.getRegisteredProviders();

	if (response == null && !this._notFound[responseId]) { // response isn't in cache and was never looked for
		for (var i=0;i<providers.length;i++) {
			// This could be expensive at is could cause all of the file loading to occur when looking for a response
			response = providers[i].getItem(responseId);

			if (response != null) {
				this._responses[responseId] = response; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (response == null) this._notFound[responseId] == true; // never will find it, so record this fact so we don't ever look again
	}

	return response;
}

module.exports = DefaultResponseManager;