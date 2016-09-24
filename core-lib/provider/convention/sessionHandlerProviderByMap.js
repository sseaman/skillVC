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
 * NOTE: At this time this object has not been tested in the SkillVC system and exists as a "ToDo"
 *
 * @constructor
 * @implements {Provider}
 * @see {@link AbstractProviderByMap}
 * @param {Map} map The object structure of the raw Filters to use.  
 * @param {Object.<String, Object} Options for processing.  See {@link AbstractProviderByMap}
 */
function SessionHandlerProviderByMap(map, options) {
	AbstractProviderByMap.apply(this, [
		map, 
		this._processor,
		options]);
}

SessionHandlerProviderByMap.prototype = Object.create(AbstractProviderByMap.prototype);
SessionHandlerProviderByMap.prototype.constructor = SessionHandlerProviderByMap;

/**
 * Since there is no processing required for SessionHandlers, it just returns the item that was passed in
 * 
 * @protected
 * @function
 * @param  {String} itemId The key
 * @param  {Filter} item 
 * @return {Filter} The SessionHandler that was passed in as item
 */
SessionHandlerProviderByMap.prototype._processor = function(itemId, item) {
	return item;
}

module.exports = SessionHandlerProviderByMap;