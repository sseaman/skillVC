/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderManager = require('../provider/abstractProviderManager.js');
var log = require('../skillVCLogger.js').getLogger('DefaultFilterManager');

/**
 * Manager for managing filters.
 *
 * Supports N number of providers or various types (directory, file, map, etc.) to allow for highly dynamic 
 * configuration
 *
 * @constructor
 * @implements {AbstractProviderManager}
 * @implements {FilterManager}
 * @see {@link AbstractProviderManager}
 * @param {Provider} Providers to manage / use.  Can be null and providers later added via register methods
 */
function DefaultFilterManager(providers) {
	this._providers = providers;
	this._filters = {};
	this._notFound = {};

	AbstractProviderManager.apply(this, [providers]);
}

DefaultFilterManager.prototype = AbstractProviderManager.prototype;
DefaultFilterManager.prototype.contructor = DefaultFilterManager;

/**
 * Returns the pre filters.  
 *
 * @function
 * @return {Array.Filter} The pre filters in the order they should be executed
 */
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

/**
 * Returns the post filters.  
 *
 * @function
 * @return {Array.Filter} The post filters in the order they should be executed
 */
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