/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../abstractProviderByMap.js');
var DefaultResponseBuilder = require('../../response/defaultResponseBuilder.js');

/**
 * Uses the passed in map to provide responses. This provider will still use the ResponseBuilder to 
 * build the response from the passed in JSON.
 *
 * This allows the most control of SkillVC's loading of responses however it requires the
 * most knowledge of how the system works.  This should only be used if you know what you
 * are doing and want the utmost control.
 *
 * @example
 * {
 * 	 'responseName' : { json for response },
 * 	 'anotherResponseName' : { json for response },
 * 	 etc...
 * }
 * 
 * @constructor
 * @implements {Provider}
 * @implements {ItemProvider}
 * @see {@link DefaultResponseBuilder}
 * @param {Map} map The object structure of the raw responses to use.  
 * @param {Object.<String, Object>} options Options for processing.  See {@link AbstractProviderByMap}
 * @param {ResponseBuilder} [options.responseBuilder=DefaultResponseBuilder] The ResponseBuilder to use when building responses
 */
function ResponseProviderByMap(map, options) {
	this._map = map;

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	AbstractProviderByMap.apply(this, [
		map, 
		options]);
}

ResponseProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
ResponseProviderByMap.prototype.constructor = ResponseProviderByMap;

/**
 * Since there is no processing required, it just returns the item that was passed in
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
ResponseProviderByMap.prototype.processItem = function(items, itemId, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	items[itemId] = map[itemId];
};

/**
 * Since there is no processing required, it just returns the map that was passed in
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {Object} map The map being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
ResponseProviderByMap.prototype.processItems = function(items, map, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	for (var key in map) {
		items[key] = map[key];
	}
};

module.exports = ResponseProviderByMap;