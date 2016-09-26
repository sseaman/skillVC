/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can manage intents
 *
 * @interface IntentHandlerManager
 */

/**
 * Called when an intent should be invoked.  The Manager (depending on its implementation) should
 * process the request by finding the correct object that is registered to handle the intent and then execute the
 * {@link IntentHander@handleIntent} function of that object
 *
 * @function
 * @name  IntentHandlerManager#handleIntent
 * @param {SVContext} svContext The context of the execution
 */