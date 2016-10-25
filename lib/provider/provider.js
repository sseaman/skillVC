/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for Providers of various resources
 *
 * @interface Provider
 */

/**
 * Returns the item stored under the itemId.  May be null
 * 
 * @function
 * @name Provider#getItem
 * @param {String} itemId The Id of the item to return
 * @return {Object} The item corresponding to the itemId
 */

/**
 * Returns all of the items stored.  May be null
 * 
 * @function
 * @name Provider#getItems
 * @return {Object} All the items being managed by they provider
 */