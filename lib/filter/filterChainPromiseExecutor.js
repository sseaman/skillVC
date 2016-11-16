/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractPromiseExecutor = require('../executor/abstractPromiseExecutor.js');
var log = require('winston-simple').getLogger('FilterChainPromiseExecutor');

/**
 * The FilterChainExecutor is the 'engine' of SkillVC in that it controls the execution of
 * all the registered filters (including intent handling which is treated as a filter).
 *
 * This works by iterating over the list of registered filters and, when a `Promise` is discovered, waits
 * until the completion, and then continues over the loop
 * 
 * @constructor
 * @see  {@link Filter}
 * @param {Filter} [preFilters]  The pre filters to execute
 * @param {Filter} [postFilters] The post filters to execute
 */
function FilterChainPromiseExecutor(preFilters, postFilters) {
	this._pre = preFilters;
	this._post = postFilters;
}

FilterChainPromiseExecutor.prototype = Object.create(AbstractPromiseExecutor.prototype);
FilterChainPromiseExecutor.prototype.constructor = FilterChainPromiseExecutor;

/**
 * Start the execution
 * 
 * @function
 * @param  {SVContext} svContext The SVContext to use for execution
 * @returns {Promise} The `Promise` that can be used to wait until this completes
 */
FilterChainPromiseExecutor.prototype.execute = function(svContext) {
	var fcm = this; // to control scoping in the promises

	return new Promise(function(resolve, reject) {
		log.info("Starting Filter Chain Execution");
		fcm._doExecute('executePre', fcm._pre, svContext)
			.then(fcm._doExecute.bind(this, 'executePost', fcm._post, svContext)) // use bind so I don't have to wrap with function()
			.then(function() {
				log.info("Filter Chain Execution completed");
				resolve();
			})
			.catch(function(err) {
				log.error("Error in chain. "+err);
				reject();
			});
	});
};

module.exports = FilterChainPromiseExecutor;