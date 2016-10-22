/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var DefaultResponseBuilder = require ('../../response/defaultResponseBuilder.js');
var fs = require('fs');

/**
 * Provides responses by a single file with multiple responses defined in the file
 * 
 * Responses are loaded asynchronously but if a response is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @constructor
 * @implements {Provider}
 * @implements {ItemProcessor}
 * @see {@link AbstractProviderByFile}
 * @see {@link DefaultResponseBuilder}
 * @param {String} file The file to read all responses from
 * @param {Object} options Options for the file loading
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a response is requested.  It is generally
 *         more efficient to load only when the response is requested.
 * @param {String} [options.fileEncoding=utf8] The encoding of the files
 * @param {ResponseBuilder} [options.responseBuilder=DefaultResponseBuilder] The ResponseBuilder to use when building responses
 */
function ResponseProviderByFile(file, options) {
	this._file = file;
	this._loaded = null;

	this._responseBuilder = (options && options.responseBuilder) 
		? options.responseBuilder
		: new DefaultResponseBuilder();

	AbstractProviderByFile.apply(this, [
		file, 
		options]);
}

ResponseProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
ResponseProviderByFile.prototype.constructor = ResponseProviderByFile;

/**
 * Processes the specific item and returns the result
 * 
 * @function
 * @abstract
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {ItemProcessor~processItemResult} The result of processing the item
 */
ResponseProviderByFile.prototype.processItem = function(itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	if (!this._loaded) this._loaded = fs.readFileSync(fileName, this._fileEncoding);

	if (this._loaded) {
		var json = JSON.parse(this._loaded);
		for (var key in json) {
			if (key === itemId) {
				return {'itemId' : itemId, 
					'item' : this._responseBuilder.withResponseId(key).withJSON(json[key]).build() };
			}
		}
		return null;
	}

	return null;
};

/**
 * Process a file that may have many responses in it.  Converts each json response to a {@link Response} and results
 * an array of the resulting responses
 *
 * @function
 * @param {Array.String} items Array of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 * @return {Array.ItemProcessor~processorResult} The result of processing the items
 */
ResponseProviderByFile.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	if (!this._loaded) this._loaded = fs.readFileSync(fileName, this._fileEncoding);

	if (this._loaded) {
		var json = JSON.parse(this._loaded);
		var processed = [];
		for (var key in json) {
			var response = this._responseBuilder.withResponseId(key).withJSON(json[key]).build();
			processed.push({'itemId' : key, 'item': response});
		}
		return (processed.length > 0) ? processed : null;
	}

	return null;
};

module.exports = ResponseProviderByFile;