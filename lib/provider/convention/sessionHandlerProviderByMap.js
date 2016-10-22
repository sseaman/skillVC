/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../abstractProviderByMap.js');

/**
 * Uses the passed in map to provide SessionHandlers. 
 * 
 * The Map should contain two keys: 'pre' and 'post'.  The values of each should be
 * the an array of {@link Filter} objects.
 *
 * WARNING: At this time this object has not been tested in the SkillVC system and exists as a "ToDo"
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @see {@link AbstractProviderByMap}
 * @param {Map} map The object structure of the raw Filters to use.  
 * @param {Object.<String, Object>} options Options for processing.  See {@link AbstractProviderByMap}
 */
function SessionHandlerProviderByMap(map, options) {
	AbstractProviderByMap.apply(this, [
		map, 
		options]);
}

SessionHandlerProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
SessionHandlerProviderByMap.prototype.constructor = SessionHandlerProviderByMap;

/**
 * Since there is no processing required, it just returns the item that was passed in
 * 
 * @function
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
SessionHandlerProviderByMap.prototype.prcoessItem = function(itemId, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	return map[itemId];
};

/**
 * Since there is no processing required, it just returns the map that was passed in
 * 
 * @function
 * @abstract
 * @param {Array.String} items Array of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
SessionHandlerProviderByMap.prototype.processItems = function(items, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	return map;
};

module.exports = SessionHandlerProviderByMap;