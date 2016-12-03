/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can manage responses
 *
 * @interface ResponseManager
 */

/**
 * Returns the specified response by looking through the defined providers.
 *
 * Optimized to only look once and if not found, will never look through the provider again.  This prevents
 * adding responses to the provider at a later time, but improves repeated lookup performance
 *
 * @function
 * @name  ResponseManager#get
 * @param  {String} responseId The id of the response
 * @return {Response} The response.  If not found, returns null
 */

/**
 * Helper method that retrieves and renders a response all in one call
 * 
 * @param  {String} responseId The id of the response
 * @param  {Object.<String,Object>} valuesMap The values to use when formatting the response
 * @return {String} The rendered string to send back to Alexa
 */

/**
 * Helper method to do an ask similar to the alexa api
 *
 * @function
 * @name  ResponseManager#ask
 * @param  {String} msg      The message to ask to the user
 * @param  {String} reprompt THe reprompt message
 * @return {String} The rendered string to send back to Alexa
 */

/**
 * Helper method to do an ask similar to the alexa api
 *
 * @function
 * @name  ResponseManager#tell
 * @param  {String} msg      The message to tell to the user
 * @return {String} The rendered string to send back to Alexa
 */

/**
 * Returns the list of registers  providers
 * 
 * @function
 * @name  ResponseManager#getRegisteredProviders
 * @return {Array.Provider} All of the registered providers
 */

/**
 * Adds providers
 *
 * @function
 * @name  ResponseManager#registerProvider
 * @param {Array.Provider} provider  Providers to use.  Can be an individual provider or an array
 */