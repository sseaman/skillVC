/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByAsyncDirectory = require('../abstractProviderByAsyncDirectory.js');
var DefaultJSONFilenameFormatter = require ('../defaultJSONFilenameFormatter.js');
var DefaultResponseBuilder = require ('../../response/defaultResponseBuilder.js');
const fs = require('fs');
const path = require('path');
var svUtil = require('../../util.js');

/**
 * Provides responses by loading all of the files in a directory as responses
 * 
 * Responses are loaded asynchronously but if a response is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
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
 * @see {@link DefaultResponseBuilder}
 * @see {@link DefaultJSONFilenameFormatter}
 */
function ResponseProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	var locOptions = svUtil.deepClone(options);
	locOptions.filenameFormatter = (options && options.filenameFormatter)
		? options._filenameFormatter
		: new DefaultJSONFilenameFormatter();

	AbstractProviderByAsyncDirectory.apply(this, [
		directory, 
		this._process,
		locOptions]);
}

ResponseProviderByDirectory.prototype = Object.create(AbstractProviderByAsyncDirectory.prototype);
ResponseProviderByDirectory.prototype.constructor = ResponseProviderByDirectory;

/**
 * Syncronously reads a file and, using the ResponseBuilder from the constructor, builds a response for the
 * use in {@link AbstractProviderByDictionary}
 *
 * @protected
 * @function
 * @param  {String} responseId The Id of the response to process
 * @param  {String} file   The file to process
 * @return {Provider~processorResult}  The loaded response information
 */
ResponseProviderByDirectory.prototype._process = function(itemId, file, options) {
	var contents = fs.readFileSync(file, this._fileEncoding);
	return (contents != null) 
		? [{ 'itemId' : itemId, 'item' : this._responseBuilder.withResponseId(itemId).withString(contents).build() }]
		: null;
}

module.exports = ResponseProviderByDirectory;
