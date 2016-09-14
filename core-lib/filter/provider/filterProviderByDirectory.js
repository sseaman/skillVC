var AbstractProviderByDirectory = require('../../provider/abstractProviderByDirectory.js');
var DefaultJSFilenameFormatter = require ('../../provider/defaultJSFilenameFormatter.js');
var log = require('../../skillVCLogger.js').getLogger('FilterProviderByDirectory');
var svUtil = require('../../util.js');
const path = require('path');
const fs = require('fs');

/**
 * Provides cards by loading all of the files in a directory as cards
 * 
 * Cards are loaded asynchronously but if a card is requested before being loaded 
 * it will be immediately loaded and then skipped by the asychronous processing.
 *
 * @param {String} directory The directory to read all cards from
 * @param {Object} options Options for the was the directory is process
 * @param {String} options.fileEncoding The encoding of the files.  Defaults to utf8
 * @param {FileNameFormatter} options.filenameFormatter The FilenameFormmatter to use to parse the filenames to determine card name as well
 *     as how to format the cardId to become a filename. This object will only load files that match the formatters isValid() method
 *     Defaults to DefaultCardFilenameFormatter
 * @param {CardBuilder} options.cardBuilder The CardBuilder to use when building cards. Defaults to DefaultCardBuilder
 */
function FilterProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	this._directory = path.normalize(directory);
	this._directory += (this._directory.endsWith(path.sep))
		? ''
		: path.sep;

	this._filenameFormatter = (options && options.filenameFormatter)
		? options.filenameParser
		: new DefaultJSFilenameFormatter();

	this._fileEncoding = (options && options.fileEncoding)
		? options.fileEncoding
		: 'utf8';

	this._filters = { 'pre' : [], 'post' : []};

	var files = fs.readdirSync(this._directory, this._fileEncoding);
	for (var i=0;i<files.length;i++) {
		if (this._filenameFormatter.isValid(files[i])) {
			var loaded = new (require(process.cwd()+path.sep+this._directory+files[i])); 

			var filterStages = ['pre'];
			if (svUtil.isFunction(loaded.getStages)) { // use the user defined stages
				var stages = loaded.getStages();
				filterStages = (Array.isArray(stages)) 
					? stages
					: [stages];
			}

			for (var fsIdx=0;fsIdx<filterStages.length;fsIdx++) {
				var msg = 'Loaded filter '+files[i]+' into stage '+filterStages[fsIdx];

				// if they specified the order of filter executon
				if (svUtil.isFunction(loaded.getOrder)) {
					this._filters[filterStages[fsIdx]][loaded.getOrder()] = loaded;
					log.verbose(msg + ', position '+loaded.getOrder());
				}
				else {  // no order specified, put it at the end
					this._filters[filterStages[fsIdx]].push(loaded); 
					log.verbose(msg + ', position '+(this._filters[filterStages[fsIdx]].length-1));
				}
			}

			// function to compress array in case someone put one at 1 and the next at 99
			for (var key in this._filters) {
				var stages = this._filters[key];
				var newArray = [];
				for (var n = 0; n < stages.length; n++) {
				    if (stages[n]) {
				      newArray.push(stages[n]);
				    }
				}
				this._filters[key] = newArray;
			}
		}
	}

}

FilterProviderByDirectory.prototype.getPreFilters = function() {
	return this._filters.pre;
}

FilterProviderByDirectory.prototype.getPostFilters = function() {
	return this._filters.post;
}

module.exports = FilterProviderByDirectory;
