/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderManager = require('../provider/abstractProviderManager.js');

/**
 * Manager for managing SessionHandlers.
 *
 * Supports N number of providers or various types (directory, file, map, etc.) to allow for highly dynamic 
 * configuration
 *
 * @constructor
 * @implements {AbstractProviderManager}
 * @implements {SessionManager}
 * @see {@link AbstractProviderManager}
 * @param {Provider} providers Providers to manage / use.  Can be null and providers later added via register methods
 */
function DefaultSessionHandlerManager(providers) {
	this._providers = providers;
	this._items = {};
	this._notFound = {};

	AbstractProviderManager.apply(this, [providers]);
}

DefaultSessionHandlerManager.prototype = Object.create(AbstractProviderManager.prototype);
DefaultSessionHandlerManager.prototype.constructor = DefaultSessionHandlerManager;

/**
 * Returns the start SessionHandlers.  
 *
 * @function
 * @return {Array.SessionHandler} The start SessionHandlers in the order they should be executed
 */
DefaultSessionHandlerManager.prototype.getStartSessionHandlers = function() {
	var itemArray = this._items.start;
	var providers = this.getRegisteredProviders();

	if (!itemArray && !this._notFound.start) { // isn't in cache and was never looked for
		for (var i=0;i<providers.length;i++) {
			itemArray = providers[i].getStartSessionHandlers();

			if (itemArray) {
				this._items.start = itemArray; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (!itemArray) this._notFound.start = true; // never will find it, so record this fact so we don't ever look again
	}

	return itemArray;
};

/**
 * Returns the start SessionHandlers.  
 *
 * @function
 * @return {Array.SessionHandler} The end SessionHandlers in the order they should be executed
 */
DefaultSessionHandlerManager.prototype.getEndSessionHandlers = function() {
	var itemArray = this._items.end;
	var providers = this.getRegisteredProviders();

	if (!itemArray && !this._notFound.end) { // isn't in cache and was never looked for
		for (var i=0;i<providers.length;i++) {
			itemArray = providers[i].getEndSessionHandlers();

			if (itemArray) {
				this._items.end = itemArray; // found it. set it so I never have to look again
				break; // hop out if I find it
			}
		}
		if (!itemArray) this._notFound.end = true; // never will find it, so record this fact so we don't ever look again
	}

	return itemArray;
};

module.exports = DefaultSessionHandlerManager;