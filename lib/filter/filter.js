/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can handle can act as a filter
 *
 * @interface Filter
 */

/**
 * Returns the name of the filter.  If not set, SkillVC will attempt to determine one for you and add the function
 * to your object
 *
 * @function
 * @name  Filter.getName
 * @return {String} The name of the filter
 */

/**
 * Returns the order location in which the filter should be called.
 *
 * If not defined, the order will be assumed to be the order in which it was loaded
 *
 * @function
 * @name  Filter#getOrder
 * @return {Number} The place in execution order (index) of the filter.
 */

/**
 * Called to execute any functionality that needs to occur before an intent executes.  If the filter
 * has any async operations a `Promise` should be returned to SkillVC so that it will wait until 
 * execution of the async operation has completed
 *
 * A filter should implement either executePre or executePost, it does not need to implement both
 * 
 * @function
 * @name  Filter#executePre
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 * @returns {Promise} The optional `Promise` that can be used to wait until this completes
 */

/**
 * Called to execute any functionality that needs to occur after an intent executes.  If the filter
 * has any async operations a `Promise` should be returned to SkillVC so that it will wait until 
 * execution of the async operation has completed
 *
 * A filter should implement either executePre or executePost, it does not need to implement both
 * 
 * @function
 * @name  Filter#executePost
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 * @returns {Promise} The optional `Promise` that can be used to wait until this completes
 */