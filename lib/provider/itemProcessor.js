/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for Item Processor used by providers
 *
 * @interface ItemProcessor
 */

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @name ItemProcessor#processItem
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String|Object} source The source being processed (can be a map or file depending on implementation)
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */

/**
 * Processes multiple items at once
 * 
 * @function
 * @name ItemProcessor#processItems
 * @param {Map} items Map of the items being processed
 * @param {String|Object} source The source being processed (can be a map or file depending on implementation)
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */

/**
 * @typedef {Object} ItemProcessor~processorResult
 *
 * @property {Object.<string, string>} itemId : item 
 * @property {Object.<string, Object>} item : The item that was loaded
 */