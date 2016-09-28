/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var DefaultResponseBuilder = require ('../../response/defaultResponseBuilder.js');
const fs = require('fs');

/**
 * Provides responses by a single file with multiple responses defined in the file
 * 
 * Responses are loaded asynchronously but if a response is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @constructor
 * @implements {Provider}
 * @see {@link AbstractProviderByFile}
 * @see {@link DefaultResponseBuilder}
 * @param {String} file The file to read all responses from
 * @param {Object} options Options for the file loading
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a response is requested.  It is generally
 *         more efficient to load only when the response is requested.
 * @param {String} [options.fileEncoding =utf8] The encoding of the files
 * @param {ResponseBuilder} [options.responseBuilder=DefaultResponseBuilder] The ResponseBuilder to use when building responses
 */
function ResponseProviderByFile(file, options) {
	this._file = file;

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	AbstractProviderByFile.apply(this, [
		file, 
		this._processFile,
		options]);
}

AbstractProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
AbstractProviderByFile.prototype.constructor = ResponseProviderByFile;

/**
 * Process a file tha may have many responses in it.  Converts each json response to a {@link Response} and results
 * an array of the resulting responses
 *
 * @protected
 * @function
 * @param  {String} file  The file to process
 * @return {Array.Provider~processorResult} The results of the processing
 */
ResponseProviderByFile.prototype._processFile = function(file) {
	var contents = fs.readFileSync(file, this._fileEncoding);
	if (contents) {
		var json = JSON.parse(contents);
		var processed = [];
		for (var key in json) {
			var response = this._responseBuilder.withResponseId(key).withJSON(json[key]).build();
			processed.push({'itemId' : key, 'item': response});
		}
		return (processed.length > 0) ? processed : null;
	}

	return null;
}

module.exports = ResponseProviderByFile;