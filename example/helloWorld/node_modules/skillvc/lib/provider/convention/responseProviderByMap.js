/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../abstractProviderByMap.js');

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
 * @see {@link DefaultResponseBuilder}
 * @param {Map} map The object structure of the raw responses to use.  
 * @param {Object.<String, Object>} Options for processing.  See {@link AbstractProviderByMap}
 * @param {ResponseBuilder} [options.responseBuilder=DefaultResponseBuilder] The ResponseBuilder to use when building responses
 */
function ResponseProviderByMap(map, options) {
	this._map = map;

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	AbstractProviderByMap.apply(this, [
		map, 
		this._processResponse,
		options]);
}

ResponseProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
ResponseProviderByMap.prototype.constructor = ResponseProviderByMap;

/**
 * Uses the ResponseBuilder to build a response.
 *
 * @protected
 * @function
 * @param  {String} responseId The Id of the response
 * @param  {JOSN} response     The JSON that defines the response
 * @return {Response}          The resulting response
 */
ResponseProviderByMap.prototype._processResponse = function(responseId, response) {
	return response;
}

module.exports = ResponseProviderByMap;