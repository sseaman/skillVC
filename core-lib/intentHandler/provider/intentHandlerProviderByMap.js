/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByMap = require('../../provider/abstractProviderByMap.js');

/**
 * Uses the passed in map to provide intentHandlers. 
 *
 * This allows the most control of SkillVC's loading of cards however it requires the
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
 * @param {Map} map The object structure of the raw intents to use.  
 */ 
function IntentHandlerProviderByMap(map) {
	AbstractProviderByMap.apply(this, [
		map, 
		this._processor]);
}

IntentHandlerProviderByMap.prototype = AbstractProviderByMap.prototype;
IntentHandlerProviderByMap.prototype.contructor = IntentHandlerProviderByMap;

/**
 * As the map is already primed and loaded, this method does nothing but return the item that is passed in
 * 
 * @protected
 * @param  {String} itemId Key for the intent
 * @param  {Intent} item   The intent
 * @return {Intent}        The same item (Intent) that was passed in
 */
IntentHandlerProviderByMap.prototype._processor = function(itemId, item) {
	return item;
}

module.exports = IntentHandlerProviderByMap;