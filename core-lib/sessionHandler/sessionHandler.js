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
 * A SessionHandler should implement either sessionStart or sessionEnd, it does not need to implement both
 * 
 * @function
 * @name  SessionHandler#sessionStart
 * @param  {SVContext} svContext The execution context
 */

/**
 * Called when a session has ended
 *
 * A essionHandler should implement either sessionStart or sessionEnd, it does not need to implement both
 * 
 * @function
 * @name  SessionHandler#sessionEnd
 * @param  {SVContext} svContext The execution context
 */