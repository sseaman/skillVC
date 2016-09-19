/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var InternHandlerManager = require('../intentHandler/defaultIntentHandlerManager.js');
var log = require('../skillVCLogger.js').getLogger('IntentHandlerFilter');

/**
 * Wrapper for IntentHandlerManager that works as a Filter as everything in SkillVC is 
 * treated as a filter in terms of registed execution (at a high level).
 *
 * The use of a wrapper (and existance of a separate IntentHandlerManager) allows for
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
 * Executes the intentHandlerManager with the passed in svContext and takes the results,
 * places them in the svContext.session.response, and calls the approriate
 * {@link FilterChainExecutor~filterChainCallback} depending on the if the intent was sucessful or not.
 *
 * @function
 * @param  {SVContext} svContext The SVContext to execute with
 */
IntentHandlerFilter.prototype.executePre = function(svContext) {
	log.verbose("Passing off to IntentHandlerManager "+this._intentHandlerManager.constructor.name);

	svContext.callback = {
		success : function(response) {
			svContext.session.response = response;
			svContext.filterChainCallback.success(); 
		},
		failure : function(error) {
			svContext.session.response = error;
			svContext.filterChainCallback.failure();
		}
	};

	this._intentHandlerManager.handleIntent(svContext);
}

module.exports = IntentHandlerFilter;