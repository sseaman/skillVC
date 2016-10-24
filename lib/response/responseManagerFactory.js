/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var ResponseProviderByDirectory = require ('../provider/convention/responseProviderByDirectory.js');
var ResponseProviderByFile = require ('../provider/convention/responseProviderByFile.js');
var ResponseProviderByMap = require ('../provider/convention/responseProviderByMap.js');
var DefaultJSONFilenameFormatter = require ('../provider/defaultJSONFilenameFormatter.js');
var HandlebarsFormatterManager = require('./formatter/handlebarsFormatterManager.js');
var DefaultResponseBuilder = require('./defaultResponseBuilder.js');
var DefaultResponseManager = require('./defaultResponseManager.js');

/**
 * Static factory that can create ResponseManagers depending on the specific needs of the skill.  
 * This should never need to be called and is here as a placeholder.
 *
 * @constructor
 * @see  {@link ResponseManager}
 */
function ResponseManagerFactory() {
	
}

/**
 * Creates a ResponseManager that loads responses from a directory and 
 * uses the DefaultResponseManager and the HandlebarsFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultResponseManager}
 * @see  {@link ResponseProviderByDirectory}
 * @see  {@link HandlebarsFormatterManager}
 * @param  {String} directory The directory to read the responses from
 * @return {ResponseManager} The ResponseManager that will manage the responses
 */
ResponseManagerFactory.createHandlebarEnabledByDirectory = function(directory) {
	var responseProvider = new ResponseProviderByDirectory(directory,
		{ 
			responseBuilder : new DefaultResponseBuilder()
				.withFormatterManager(new HandlebarsFormatterManager()),
			filenameFormatter : new DefaultJSONFilenameFormatter()
		}
	);
	return new DefaultResponseManager([responseProvider]);
};

/**
 * Creates a ResponseManager that loads responses from a file and 
 * uses the DefaultResponseManager and the HandlebarsFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultResponseManager}
 * @see  {@link ResponseProviderByFile}
 * @see  {@link HandlebarsFormatterManager}
 * @param  {String} file The file to read the responses from
 * @return {ResponseManager} The ResponseManager that will manage the responses
 */
ResponseManagerFactory.createHandlebarEnabledByFile = function(file) {
	var responseProvider = new ResponseProviderByFile(file,
		{ 
			responseBuilder : new DefaultResponseBuilder()
				.withFormatterManager(new HandlebarsFormatterManager()),
			filenameFormatter : new DefaultJSONFilenameFormatter()
		}
	);
	return new DefaultResponseManager([responseProvider]);
};

/**
 * Creates a ResponseManager that loads responses from a map and 
 * uses the DefaultResponseManager and the HandlebarsFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultResponseManager}
 * @see  {@link ResponseProviderByMap}
 * @see  {@link HandlebarsFormatterManager}
 * @param  {String} map The map to use
 * @return {ResponseManager} The ResponseManager that will manage the responses
 */
ResponseManagerFactory.createHandlebarEnabledByMap= function(map) {
	var responseProvider = new ResponseProviderByMap(map,
		{ 
			responseBuilder : new DefaultResponseBuilder()
				.withFormatterManager(new HandlebarsFormatterManager()),
			filenameFormatter : new DefaultJSONFilenameFormatter()
		}
	);
	return new DefaultResponseManager([responseProvider]);
};

/**
 * Creates a ResponseManager that loads responses from a directory and 
 * uses the DefaultResponseManager and the BasicFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultResponseManager}
 * @see  {@link ResponseProviderByDirectory}
 * @see  {@link BasicFormatterManager}
 * @param  {String} directory The directory to read the responses from
 * @return {ResponseManager} The ResponseManager that will manage the responses
 */
ResponseManagerFactory.createByDirectory = function(directory) {
	return new DefaultResponseManager([new ResponseProviderByDirectory(directory)]);
};

/**
 * Creates a ResponseManager that loads responses from a file and 
 * uses the DefaultResponseManager and the BasicFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultResponseManager}
 * @see  {@link ResponseProviderByFile}
 * @see  {@link BasicFormatterManager}
 * @param  {String} file The file to read the responses from
 * @return {ResponseManager} The ResponseManager that will manage the responses
 */
ResponseManagerFactory.createByFile = function(file) {
	return new DefaultResponseManager([new ResponseProviderByFile(file)]);
};

/**
 * Creates a ResponseManager that loads responses from a map and 
 * uses the DefaultResponseManager and the BasicFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultResponseManager}
 * @see  {@link ResponseProviderByMap}
 * @see  {@link BasicFormatterManager}
 * @param  {String} map The map to use
 * @return {ResponseManager} The ResponseManager that will manage the responses
 */
ResponseManagerFactory.createByMap = function(map) {
	return new DefaultResponseManager([new ResponseProviderByMap(map)]);
};

module.exports = ResponseManagerFactory;