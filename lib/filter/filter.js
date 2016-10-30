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
 * Returns the order location in which the filter should be called.
 *
 * If not defined, the order will be assumed to be the order in which it was loaded
 *
 * @function
 * @name  Filter#getOrder
 * @return {Number} The place in execution order (index) of the filter.
 */

/**
 * Called to execute any functionality that needs to occur before an intent executes.  To continue the 
 * filter chain the filter should call svContext.filterChainCallback.success() or 
 * svContext.filterChainCallback.failure() depending on if the filter was successful or not.
 *
 * A filter should implement either executePre or executePost, it does not need to implement both
 * 
 * @function
 * @name  Filter#executePre
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */

/**
 * Called to execute any functionality that needs to occur after an intent executes.  To continue the 
 * filter chain the filter should call svContext.filterChainCallback.success() or 
 * svContext.filterChainCallback.failure() depending on if the filter was successful or not.
 *
 * A filter should implement either executePre or executePost, it does not need to implement both
 * 
 * @function
 * @name  Filter#executePost
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */

/**
 * If a filter returns an unsucessfull callback, the path of all filter executions diverts to the 'onError' path and
 * all subsiquent filters will have their 'onError' methods executed.  To continue the 
 * filter chain the filter should call svContext.filterChainCallback.failure() to continue down the error path (unless the
 * filter somehow corrected the error).
 *
 * A filter does not need to impement this method if it does not want to handle this issue
 * 
 * @function
 * @name  Filter#executePreOnError
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */

/**
 * If a filter returns an unsucessfull callback, the path of all filter executions diverts to the 'onError' path and
 * all subsiquent filters will have their 'onError' methods executed.  To continue the 
 * filter chain the filter should call svContext.filterChainCallback.failure() to continue down the error path (unless the
 * filter somehow corrected the error).
 *
 * A filter does not need to impement this method if it does not want to handle this issue
 * 
 * @function
 * @name  Filter#executePostOnError
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */