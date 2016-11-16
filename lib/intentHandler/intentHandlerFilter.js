/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var ContextWrapper = require('../context/contextWrapper.js');
var log = require('winston-simple').getLogger('IntentHandlerFilter');

/**
 * Wrapper for IntentHandlerManager that works as a Filter and Provider as everything in SkillVC is 
 * treated as a filter in terms of registered execution (at a high level).
 *
 * The use of a wrapper (and existence of a separate IntentHandlerManager) allows for
 * the use of SkillVC as a piecemail system where on parts of the overall architecture could
 * be used by a skill
 *
 * @constructor
 * @implements {Filter}
 * @see  {@link IntentHanderManager}
 * @param {IntentHandlerManager} intentHandlerManager The IntentHandlerManager to wrap
 */
function IntentHandlerFilter(intentHandlerManager) {
	this._intentHandlerManager = intentHandlerManager;
}

/**
 * Executes the intentHandlerManager with the passed in svContext, wraps the lambda context with a 
 * `ContextWrapper` so that it can intercept the `succeed()` and `fail()` calls and then
 * proceed with the filter chain via {@link FilterChainExecutor~filterChainCallback}
 *
 * @function
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 * @returns {Promise} The `Promise` that can be used to wait until this completes
 */
IntentHandlerFilter.prototype.executePre = function(event, context, svContext) {
	log.debug("Passing off to IntentHandlerManager "+this._intentHandlerManager.constructor.name);

	var ihf = this;
	return new Promise(function(resolve, reject) {
		var contextWrapper = new ContextWrapper(context, resolve, reject);
		// var contextWrapper = new ContextWrapper(context, {
		// 	success : function(response) {
		// 		resolve(response);
		// 	},
		// 	failure : function(error) {
		// 		reject(error);
		// 	}
		// });

		// I want everything to apply globally, so I can't use context (which is passed by value at this point)
		// However, svContext is an object, so it's pass by reference so I can store it in it's context and any changes
		// made to it will be global
		// For more info: http://www.htmlgoodies.com/html5/javascript/passing-javascript-function-arguments-by-reference.html#fbid=GyDmE-L2e0t
		svContext.lambda.context = contextWrapper;

		ihf._intentHandlerManager.handleIntent(event, contextWrapper, svContext);
	});
};

/**
 * Returns the name of the filter.  If not set, SkillVC will attempt to determine one for you and add the function
 * to your object
 *
 * @function
 * @return {String} The name of the filter
 */
IntentHandlerFilter.prototype.getName = function() {
	return 'IntentHandlerFilter';
};

module.exports = IntentHandlerFilter;