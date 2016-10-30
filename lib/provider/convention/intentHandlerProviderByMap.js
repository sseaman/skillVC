/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../abstractProviderByMap.js');

/**
 * Uses the passed in map to provide intentHandlers. 
 *
 * This allows the most control of SkillVC's loading of intents however it requires the
 * most knowledge of how the system works.  This should only be used if you know what you
 * are doing and want the utmost control.
 *
 * @example
 * {
 * 	 'intentName' : new ClassThatImplementsIntentHandler(),
 * 	 'anotherIntentName' : new ClassThatImplementsIntentHandler(),
 * 	 etc...
 * }
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @param {Map} map The object structure of the raw intents to use.  
 * @param {Object.<String, Object>} options Options for processing.  See {@link AbstractProviderByMap}
 */ 
function IntentHandlerProviderByMap(map, options) {
	AbstractProviderByMap.apply(this, [
		map, 
		options]);
}

IntentHandlerProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
IntentHandlerProviderByMap.prototype.constructor = IntentHandlerProviderByMap;

/**
 * Since there is no processing required, it just returns the item that was passed in
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
IntentHandlerProviderByMap.prototype.processItem = function(items, itemId, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	items[itemId] = map[itemId];
};

/**
 * Since there is no processing required, it just returns the map that was passed in
 * 
 * @function
 * @abstract
 * @param {Map} items Map of the items being processed
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
IntentHandlerProviderByMap.prototype.processItems = function(items, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	for (var key in map) {
		items[key] = map[key];
	}
};

module.exports = IntentHandlerProviderByMap;