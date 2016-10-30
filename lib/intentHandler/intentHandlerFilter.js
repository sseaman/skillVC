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
 * ```ContextWrapper``` so that it can intercept the ```succeed()``` and ```fail()``` calls and then
 * proceed with the filter chain via {@link FilterChainExecutor~filterChainCallback}
 *
 * @function
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */
IntentHandlerFilter.prototype.executePre = function(event, context, svContext) {
	log.verbose("Passing off to IntentHandlerManager "+this._intentHandlerManager.constructor.name);

	svContext.lambda.context = new ContextWrapper(svContext.lambda.context, {
		success : function(response) {
			svContext.filterChainCallback.success(response); 
		},
		failure : function(error) {
			svContext.filterChainCallback.failure(error);
		}
	});

	this._intentHandlerManager.handleIntent(event, context, svContext);
};

module.exports = IntentHandlerFilter;