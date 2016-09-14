var AbstractProviderByFile = require('../../provider/abstractProviderByFile.js');
var log = require('../skillVCLogger.js').getLogger('FilterProviderByFile');

/**
 * Provides an intent from a single file
 * 
 * Intent is loaded asynchronously but if a intent is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} file The file that represnts an intent
 * @param {Object} options Options 
 * @param {Boolean} options.preload Should the file be preloaded or only loaded when a card is requested (defaults to false)
 */
function FilterProviderByFile(file, options) {
	this._file = file;

	this._preload = (options && options.preload) 
		? options.preload
		: false;

	AbstractProviderByFile.apply(this, [
		file, 
		this._preload, 
		this._processFile]);
}

FilterProviderByFile.prototype = AbstractProviderByFile.prototype;
FilterProviderByFile.prototype.contructor = FilterProviderByFile;

FilterProviderByFile.prototype._processFile = function(file, cards) {
	try {
		return [{'itemId' : itemId : 'item' : new (require(process.cwd()+path.sep+file)) }];
	}
	catch (err) {
		log.error("Error loading filter "+itemId+". Error:"+err);
		return null;
	}
}

module.exports = FilterProviderByFile;