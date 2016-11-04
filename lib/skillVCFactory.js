/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var log = require("winston-simple").getLogger('SkillVCFactory');

var SkillVC = require('./skillVC.js');
var ResponseManagerFactory = require('./response/responseManagerFactory.js');
var FilterManagerFactory = require('./filter/filterManagerFactory.js');
var IntentHandlerManagerFactory = require('./intentHandler/intentHandlerManagerFactory.js');
var SessionHandlerManagerFactory = require('./sessionHandler/sessionHandlerManagerFactory.js');
var DefaultProviderByScanning = require('./provider/scan/DefaultProviderByScanning.js');
var path = require('path');

/**
 * SkillVCFactory makes it simple to have a fully functional VC (view / controller) system by simply making a one line
 * index.js for your skill.
 *
 * @example <caption>Example usage of SkillVCFactory</caption>
 * 
 * var SkillVCFactory = require('./lib/skillVCFactory.js');
 * 
 * exports.handler = function(event, context) {
 *	  SkillVCFactory.createfromDirectory().handler(event, context);
 * }
 * 
 * @constructor
 */
function SkillVCFactory() {}

/**
 * Creates and instance of SkillVC using Convention-over-Configuration.  Assest (responses, filters, and intent handlers)
 * are placed in their respective directories and processed when required.  It uses the Handlebars response formatter to allow
 * the most dynamic modification of responses.
 *
 * This method of configuration is the most straightforward and allows for a clear separation of concerns.  For most simple
 * applications that do not require the quickest execution, this is the best choice.
 *
 * The directories it will search are:
 * 
 * - {app_root}/responses
 * - {app_root}/filters
 * - {app_root}/intents
 *
 * where {app_root} is the detected root of the application
 *
 * @todo This is currently coded to use ../assets which is specific to my test implemenation
 * @function
 * @see  {@link ResponseManagerFactory#createHandlebarEnabledByDirectory}
 * @see  {@link FilterManagerFactory#createByDirectory}
 * @see  {@link IntentHandlerManagerFactory"createByDirectory}
 * @param {Sring} dir The root directory to use.  Defaults to '.'
 * @return {SkillVC} An instance of SkillVC configured based on the passed in configuration
 */
SkillVCFactory.createfromDirectory = function(dir) {
	log.info('Initializing using Convention-over-Configuration');

	var rootDir = (dir) ? dir : '.';
	log.info('Using root directory: '+rootDir);

	return new SkillVC({
		'responseManager' 	: ResponseManagerFactory.createHandlebarEnabledByDirectory(path.resolve(rootDir,'responses')),
		'filterManager'	: FilterManagerFactory.createByDirectory(path.resolve(rootDir,'filters')),
		'intentHandlerManager' : IntentHandlerManagerFactory.createByDirectory(path.resolve(rootDir,'intents')),
		'sessionHandlerManager': SessionHandlerManagerFactory.createByDirectory(path.resolve(rootDir,'sessionHandlers'))
	});
};

/**
 * Creates an instance of SkillVC by scanning the passed in files.  This is the slowest method of starting
 * SkillVC as it requires the synchronous loading and parsing of every specified file prior to actual skill handling.
 *
 * This method of configuration has the advantage of supporting javascript objects that can be both filters, intent handlers,
 * and session handlers as the scan will look for everything in each file.  Responses, as they are pure JSON, they
 * are detected by the name of the file (.json)
 *
 * @todo Implement this
 * @function
 * @param  {Array.String} files The files to scan
 * @return {SkillVC} An instance of SkillVC configured based on the passed in configuration
 */
SkillVCFactory.createFromScan = function(files) {
	log.info('Initializing using Scanning');
	
	var scanner = new DefaultProviderByScanning(files);

	return new SkillVC({
		'responseManager' 	: ResponseManagerFactory.createHandlebarEnabledByMap(scanner.getItem('responses')),
		'filterManager' : FilterManagerFactory.createByMap(scanner.getItem('filters')),
		'intentHandlerManager' : IntentHandlerManagerFactory.createByMap(scanner.getItem('intentHandlers')),
		'sessionHandlerManager': SessionHandlerManagerFactory.createByMap(scanner.getItem('sessionHandlers'))
	});
};

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
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	log.error('Not implemented yet');
	return this;
};

module.exports = SkillVCFactory;