var AbstractProviderManager = require('../provider/abstractProviderManager.js');
var log = require('../skillVCLogger.js').getLogger('DefaultFilterManager');

/**
 * Manager for Intercepting filter implementation
 * 
 * @param {Filter} filters Filters to use.  Can be null and filters later set via addFilter
 */
function DefaultFilterManager(providers) {
	this._providers = providers;
	this._filters = {};
	this._notFound = {};

	AbstractProviderManager.apply(this, [providers]);
}

DefaultFilterManager.prototype = AbstractProviderManager.prototype;
DefaultFilterManager.prototype.contructor = DefaultFilterManager;

DefaultFilterManager.prototype.getPreFilters = function() {
	var filters = this._filters.pre;
	var providers = this.getRegisteredProviders();

	if (filters == null && !this._notFound.pre) { // isn't in cache and was never looked for
		for (var i=0;i<providers.length;i++) {
			filters = providers[i].getPreFilters();

			if (filters != null) {
				this._filters.pre = filters; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (filters == null) this._notFound.pre == true; // never will find it, so record this fact so we don't ever look again
	}

	return filters;
}

DefaultFilterManager.prototype.getPostFilters = function() {
	var filters = this._filters.post;
	var providers = this.getRegisteredProviders();

	if (filters == null && !this._notFound.post) { // isn't in cache and was never looked for
		for (var i=0;i<providers.length;i++) {
			filters = providers[i].getPostFilters();

			if (filters != null) {
				this._filters.post = filters; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (filters == null) this._notFound.post == true; // never will find it, so record this fact so we don't ever look again
	}

	return filters;
}

module.exports = DefaultFilterManager;