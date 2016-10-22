/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */

/**
 * Abstract Manager for providers.  Keeps an array of the providers for use by extending objects
 *
 * @abstract
 * @constructor
 * @param {Array.Provider} providers Providers to use.  Can be null and added later via registerProvider
 */
function AbstractProviderManager(providers) {
	this._providers = providers;
}

/**
 * Returns the list of registers  providers
 *
 * @function
 * @return {Array.Provider} All of the registered providers
 */
AbstractProviderManager.prototype.getRegisteredProviders = function() {
	return this._providers;
};

/**
 * Adds providers
 *
 * @function
 * @param {Array.Provider|Provider} providers Providers to register.  Can be an individual provider or an array
 */
AbstractProviderManager.prototype.registerProvider = function(providers) {
	if (providers) {
		if (Array.isArray(providers)) {
			for (var i=0;i<providers.length;i++) {
				this._providers.push(providers[i]);
			}
		}
		else {
			this._providers.push(providers);
		}
	}
};

module.exports = AbstractProviderManager;