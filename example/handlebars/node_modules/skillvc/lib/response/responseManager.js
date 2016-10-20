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
 * Returns the specificed response by looking through the defined providers.
 *
 * Optimized to only look once and if not found, will never look through the provider again.  This prevents
 * adding responses to the provider at a later time, but improves repeated lookup performance
 *
 * @function
 * @name  ResponseManager#getResponse
 * @param  {String} responseId The id of the response
 * @return {Response} The response.  If not found, returns null
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