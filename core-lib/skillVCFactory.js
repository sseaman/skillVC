/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var SkillVC = require('./skillVC.js');
var CardManagerFactory = require('./card/cardManagerFactory.js');
var FilterManagerFactory = require('./filter/FilterManagerFactory.js');
var IntentHandlerFilter = require('./filter/intentHandlerFilter.js');
var IntentHandlerManagerFactory = require('./intentHandler/intentHandlerManagerFactory.js');
var SessionHandlerManagerFactory = require('./sessionHandler/sessionHandlerManagerFactory.js');
var DefaultProviderByScanning = require('./provider/scan/DefaultProviderByScanning.js');
var Logger = require('./skillVCLogger.js');

/**
 * SkillVCFactory makes it simple to have a fully functional VC (view / controller) system by simply making a one line
 * index.js for your skill.
 *
 * @example <caption>Example usage of SkillVCFactory</caption>
 * 
 * var SkillVCFactory = require('./core-lib/skillVCFactory.js');
 * 
 * exports.handler = function(event, context) {
 *	  SkillVCFactory.createfromDirectory().handler(event, context);
 * }
 * 
 * @constructor
 */
function SkillVCFactory() {}

/**
 * Creates and instance of SkillVC using Convention-over-Configuration.  Assest (cards, filters, and intent handlers)
 * are placed in their respective directories and processed when required.  It uses the Handlebars card formatter to allow
 * the most dynamic modification of cards.
 *
 * This method of configuration is the most straightforward and allows for a clear separation of concerns.  For most simple
 * applications that do not require the quickest execution, this is the best choice.
 *
 * The directories it will search are:
 * 
 * - {app_root}/cards
 * - {app_root}/filters
 * - {app_root}/intents
 *
 * where {app_root} is the detected root of the application
 *
 * @todo This is currently coded to use ../assets which is specific to my test implemenation
 * @function
 * @see  {@link CardManagerFactory#createHandlebarEnabledByDirectory}
 * @see  {@link FilterManagerFactory#createByDirectory}
 * @see  {@link IntentHandlerManagerFactory"createByDirectory}
 * @return {SkillVC} An instance of SkillVC configured based on the passed in configuration
 */
SkillVCFactory.createfromDirectory = function() {
	Logger.setLevels({'all' : 'debug'});  // fix thie later

	//FIXME:  FilterManger should be passing filterManagers, not filters themselves...
	return new SkillVC({
		'cardManager' 	: CardManagerFactory.createHandlebarEnabledByDirectory('../assets/cards'),
		'filterManager'	: {
			'pre' 		: FilterManagerFactory.createByDirectory('../assets/filters').getPreFilters(),
			'post'		: FilterManagerFactory.createByDirectory('../assets/filters').getPostFilters()
		},
		'intentHandlerManager' : IntentHandlerManagerFactory.createByDirectory('../assets/intents'),
		'sessionHandlerManager': SessionHandlerManagerFactory.createByDirectory('../assets/sessionHandlers'),
		'logLevels' 	: {'all' : 'debug'}
	});
}

/**
 * Creates an instance of SkillVC by scanning the passed in files.  This is the slowest method of starting
 * SkillVC as it requires the synchronous loading and parsing of every specified file prior to actual skill handling.
 *
 * This method of configuration has the advantage of supporting javascript objects that can be both filters, intent handlers,
 * and session handlers as the scan will look for everything in each file.  Cards, as they are pure JSON, they
 * are detected by the name of the file (.json)
 *
 * @todo Implement this
 * @function
 * @param  {Array.String} files The files to scan
 * @return {SkillVC} An instance of SkillVC configured based on the passed in configuration
 */
SkillVCFactory.createFromScan = function(files) {
	Logger.setLevels({'all' : 'debug'});  // fix thie later
	
	var scanner = new DefaultProviderByScanning(files);

	return new SkillVC({
		'cardManager' 	: CardManagerFactory.createHandlebarEnabledByMap(scanner.getItem('cards')),
		'filterManager' : {
			'pre'		: FilterManagerFactory.createByMap(scanner.getItem('filters')).getPreFilters(),
			'post'		: FilterManagerFactory.createByMap(scanner.getItem('filters')).getPostFilters()
		},
		'intentHandlerManager' : IntentHandlerManagerFactory.createByMap(scanner.getItem('intentHandlers')),
		'sessionHandlerManager': SessionHandlerManagerFactory.createByMap(scanner.getItem('sessionHandlers')),
		'logLevels'		: {'all' : 'debug'}
	});
	
}

/**
 * Creates an instance of SkillVC that uses a JSON configuration to determine where the various objects are
 * and how they map to intents.
 *
 * This is the most efficient way to run SkilLVC as it does not have to scan files to determine what to load,
 * however it requires the creation and maintenance of a JSON file
 * 
 * @todo Implement this
 * @function
 * @param  {JSON} config The configuration of the filters, intent handlers, and other code points
 * @return {SkillVC} An instance of SkillVC configured based on the passed in configuration
 */
SkillVCFactory.createFromConfig = function(config) {

}

module.exports = SkillVCFactory;