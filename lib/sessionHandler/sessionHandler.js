/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can handle can act as a session handler
 *
 * @interface SessionHandler
 */

/**
 * Returns the name of the SessionHandler.  If not set, SkillVC will attempt to determine one for you and add the function
 * to your object
 *
 * @function
 * @name  SessionHandler.getName
 * @return {String} The name of the SessionHandler
 */

/**
 * Returns the order location in which the session handlers should be called.
 *
 * If not defined, the order will be assumed to be the order in which it was loaded
 *
 * @function
 * @name  SessionHandler#getOrder
 * @return {Number} The place in execution order (index) of the session handler.
 */

/**
 * Called when a session is started. 
 *
 * A SessionHandler should implement either sessionStart or sessionEnd, it does not need to implement both.
 * If the SessionHandler has any async operations a `Promise` should be returned to SkillVC so that it will wait until 
 * execution of the async operation has completed
 * 
 * @function
 * @name  SessionHandler#sessionStart
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 * @returns {Promise} The optional `Promise` that can be used to wait until this completes
 */

/**
 * Called when a session has ended
 *
 * A essionHandler should implement either sessionStart or sessionEnd, it does not need to implement both.
 * If the SessionHandler has any async operations a `Promise` should be returned to SkillVC so that it will wait until 
 * execution of the async operation has completed
 * 
 * @function
 * @name  SessionHandler#sessionEnd
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 * @returns {Promise} The optional `Promise` that can be used to wait until this completes
 */
