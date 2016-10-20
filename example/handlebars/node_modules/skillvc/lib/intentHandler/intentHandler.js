/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can handle an intent
 *
 * @interface IntentHandler
 */

/**
 * Called when an intent that maps to the implementing object is invoked.  An intent that is executed should 
 * use the {@link SVContext#callback} functions to tell SkillVC if the execution of the intent was successful or not
 *
 * @function
 * @name  IntentHandler#handleIntent
 * @param {SVContext} svContext The context of the execution
 */

/**
 * Return the list of intents that the implementing object can handle
 *
 * The default IntentHandlerManager in SkillVC suports specifiying an intent name of 'launch' which will be invoked on a 
 * @link{http://tinyurl.com/jpdl5cc|LaunchRequest}
 * 
 * @function
 * @name  IntentHandler#getIntentsList
 * @return {Array.String} An array of the intent names that the implementing object can handle
 */

/**
 * @typedef {Object<string,function>} IntentHandler~callback
 * @property {function} success 
 * @property {JSON} 	success.result The results of the successful intent execution
 * @property {function} failure
 * @property {JSON}   	failure.error The result of an unsuccessful intent execution
 */

