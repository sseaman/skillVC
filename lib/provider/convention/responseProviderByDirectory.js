/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByAsyncDirectory = require('../abstractProviderByAsyncDirectory.js');
var DefaultResponseBuilder = require ('../../response/defaultResponseBuilder.js');
var fs = require('fs');
var path = require('path');
var log = require('winston-simple').getLogger('ResponseProviderByDirectory');

/**
 * Provides responses by loading all of the files in a directory as responses
 * 
 * Responses are loaded asynchronously but if a response is requested before being loaded 
 * it will be immediately loaded and then skipped by the asynchronous processing.
 *
 * @param {String} directory The directory to read all responses from
 * @param {Object} options Options for the was the directory is process
 * @param {String} [options.fileEncoding=utf8] The encoding of the files.
 * @param {FileNameFormatter} [options.filenameFormatter=DefaultJSONFilenameFormatter] The FilenameFormmatter to use to parse the 
 *     filenames to determine response name as well as how to format the responseId to become a filename. This object will only 
 *     load files that match the formatters isValid() method
 * @param {ResponseBuilder} [options.responseBuilder=DefaultResponseBuilder] The ResponseBuilder to use when building responses. Defaults to DefaultResponseBuilder
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @see {@link DefaultResponseBuilder}
 * @see {@link DefaultJSONFilenameFormatter}
 */
function ResponseProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	AbstractProviderByAsyncDirectory.apply(this, [
		directory, 
		options]);
}

ResponseProviderByDirectory.prototype = Object.create(AbstractProviderByAsyncDirectory.prototype);
ResponseProviderByDirectory.prototype.constructor = ResponseProviderByDirectory;

/**
 *
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
ResponseProviderByDirectory.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	this.processItems(items, fileName, options);
};

/**
 * Synchronously reads a file and, using the ResponseBuilder from the constructor, builds a response for the
 * use in {@link AbstractProviderByDictionary}
 * 
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
ResponseProviderByDirectory.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	var contents = fs.readFileSync(fileName, this._fileEncoding);
	if (contents) {
		var parsedFileName = path.parse(fileName);
		var itemId = parsedFileName.name;
		items[itemId] = this._responseBuilder.withResponseId(itemId).withString(contents).build();
		log.info('Loaded response '+parsedFileName.base+' as id '+parsedFileName.name);
	}
};

module.exports = ResponseProviderByDirectory;
