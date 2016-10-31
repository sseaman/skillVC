/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var log = require('winston-simple').getLogger('ContextWrapperFilter');

/**
 * Last item in the filter chain as it actually fires the lambda context succeed() or fail() methods
 *
 * @constructor
 * @implements {Filter}
 */
function ContextWrapperFilter() { }

/**
 * If the lambda context in SVContext.lambda.context is of type ```ContextWrapper```
 * it files the ```context.succeed()``` call
 * 
 * @function
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */
ContextWrapperFilter.prototype.executePost = function(event, context, svContext) {
	if (context.constructor && context.constructor.name === "ContextWrapper") {
		log.debug('Successful intent execution returned');
		context.fire();
	}
	svContext.filterChainCallback.success();
};

/**
 * If the lambda context in SVContext.lambda.context is of type ```ContextWrapper```
 * it files the ```context.fail()``` call
 * 
 * @function
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */
ContextWrapperFilter.prototype.executePostOnError = function(event, context, svContext) {
	if (context.constructor && context.constructor.name === "ContextWrapper") {
		log.debug("Unsuccessful intent execution returned");
		context.fire();
	}
	svContext.filterChainCallback.success();
};

/**
 * Returns the name of the filter.  If not set, SkillVC will attempt to determine one for you and add the function
 * to your object
 *
 * @function
 * @return {String} The name of the filter
 */
ContextWrapperFilter.prototype.getName = function() {
	return 'ContextWrapperFilter';
};

module.exports = ContextWrapperFilter;