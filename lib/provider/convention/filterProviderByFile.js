/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByFile = require('../abstractProviderByFile.js');
var log = require('winston-simple').getLogger('FilterProviderByFile');

/**
 * Provides an filter from a single file
 * 
 * Filter will be loaded synchronously as there is no way to determine when a filter is required asynchronously
 *
 * @constructor
 * @implements {Provider}
 * @see {@link AbstractProviderByFile}
 * @param {String} file The file that represnts an intent
 * @param {Object} [options] Options 
 * @param {Boolean} [options.preload=false] Should the file be preloaded or only loaded when a filter is requested
 */
function FilterProviderByFile(file, options) {
	this._file = file;

	AbstractProviderByFile.apply(this, [
		file, 
		this._processFile,
		options]);
}

FilterProviderByFile.prototype = Object.create(AbstractProviderByFile.prototype);
FilterProviderByFile.prototype.constructor = FilterProviderByFile;

/**
 * Uses node.js require to load the file and register it with the provider system
 * 
 * @function
 * @protected
 * @param  {String} file  the file to load
 * @return {Array.Provider~processorResult} An array of processor results (array length is always 1 as only one file is loaded)
 */
FilterProviderByFile.prototype._processFile = function(file) {
	try {
		return [{'itemId' : file , 'item' : new (require(process.cwd()+path.sep+file)) }];
	}
	catch (err) {
		log.error("Error loading filter "+file+". Error:"+err);
		return null;
	}
}

module.exports = FilterProviderByFile;