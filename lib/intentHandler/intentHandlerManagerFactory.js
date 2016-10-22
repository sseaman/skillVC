/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultIntentHandlerManager = require('./defaultIntentHandlerManager.js');
var IntentHandlerProviderByDirectory = require('../provider/convention/intentHandlerProviderByDirectory.js');
var IntentHandlerProviderByFile = require('../provider/convention/intentHandlerProviderByFile.js');
var IntentHandlerProviderByMap = require('../provider/convention/intentHandlerProviderByMap.js');

/**
 * Static factor for creating IntentHandlerManagers. This should never need to be called and is here as a placeholder.
 *
 * @constructor
 * @see  {@link IntentHandlerManager}
 */
function IntentHandlerManagerFactory() {
	
}

/**
 * Creates a IntentHandlerManager that loads intents from a directory and 
 * uses the DefaultIntentHandlerManager and the IntentHandlerProviderByDirectory provider
 *
 * @function
 * @static
 * @see  {@link DefaultIntentHandlerManager}
 * @see  {@link IntentHandlerProviderByDirectory}
 * @param  {String} directory The directory to load intents from
 * @return {IntentHandlerManager} The IntentHanderManager that will manage the intents
 */
IntentHandlerManagerFactory.createByDirectory = function(directory) {
	return new DefaultIntentHandlerManager([new IntentHandlerProviderByDirectory(directory)]);
};

/**
 * Creates a IntentHandlerManager that loads an intent from a file and 
 * uses the DefaultIntentHandlerManager and the IntentHandlerProviderByFile provider
 *
 * @function
 * @static
 * @see  {@link DefaultIntentHandlerManager}
 * @see  {@link IntentHandlerProviderByFile}
 * @param  {String} file The file to load an intent from
 * @return {IntentHandlerManager} The IntentHanderManager that will manage the intents
 */
IntentHandlerManagerFactory.createByFile = function(file) {
	return new DefaultIntentHandlerManager([new IntentHandlerProviderByFile(file)]);
};

/**
 * Creates a IntentHandlerManager that loads intents from a map and 
 * uses the DefaultIntentHandlerManager and the IntentHandlerProviderByMap provider
 *
 * @function
 * @static
 * @see  {@link DefaultIntentHandlerManager}
 * @see  {@link IntentHandlerProviderByMap}
 * @param  {Map} map The map to load intents from
 * @return {IntentHandlerManager} The IntentHanderManager that will manage the intents
 */
IntentHandlerManagerFactory.createByMap = function(map) {
	return new DefaultIntentHandlerManager([new IntentHandlerProviderByMap(map)]);
};

module.exports = IntentHandlerManagerFactory;