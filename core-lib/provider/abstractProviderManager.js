var log = require('../skillVCLogger.js').getLogger('abstractProviderManager');

/**
 * Abstract Manager for providers
 * 
 * @param {[Provider]} providers Providers to use.  Can be null and added later via registerProvider
 */
function AbstractProviderManager(providers) {
	this._providers = providers;
}

/**
 * Returns the list of registers  providers
 * @return {[Provider]} All of the registered providers
 */
AbstractProviderManager.prototype.getRegisteredProviders = function() {
	return this._providers;
}

/**
 * Adds providers
 * 
 * @param {[Provider]} provider  Providers to use.  Can be an individual provider or an array
 */
AbstractProviderManager.prototype.registerProvider = function(providers) {
	if (providers != null) {
		if (Array.isArray(providers)) {
			for (var i=0;i<providers.length;i++) {
				this._providers.push(providers[i]);
			}
		}
		else {
			this._providers.push(providers);
		}
	}
}

module.exports = AbstractProviderManager;