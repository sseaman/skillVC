/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can manage cards
 *
 * @interface CardManager
 */

/**
 * Returns the specificed card by looking through the defined providers.
 *
 * Optimized to only look once and if not found, will never look through the provider again.  This prevents
 * adding cards to the provider at a later time, but improves repeated lookup performance
 *
 * @function
 * @name  CardManager#getCard
 * @param  {String} cardId The id of the card
 * @return {Card} The card.  If not found, returns null
 */

/**
 * Returns the list of registers  providers
 * 
 * @function
 * @name  CardManager#getRegisteredProviders
 * @return {Array.Provider} All of the registered providers
 */


/**
 * Adds providers
 *
 * @function
 * @name  CardManager#registerProvider
 * @param {Array.Provider} provider  Providers to use.  Can be an individual provider or an array
 */