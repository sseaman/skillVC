var AbstractProviderByDirectory = require('../../provider/abstractProviderByDirectory.js');
var DefaultJSFilenameFormatter = require ('../../provider/defaultJSFilenameFormatter.js');
var log = require('../../skillVCLogger.js').getLogger('FilterProviderByDirectory');
var svUtil = require('../../util.js');
const path = require('path');
const fs = require('fs');
var filterProviderAlreadyLoaded = {};

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
function FilterProviderByDirectory2(directory, options) {
	if (!directory) throw Error('directory required');

	this._filters = { 'pre' : [], 'post' : [] };
	
	if (filterProviderAlreadyLoaded[directory]) {
		log.verbose('Filters already loaded. Skipping');
		return;
	}

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


	var populate = function(stage, filters, loaded) {
		var position = filters.length; // default to no getOrder
		if (svUtil.isFunction(loaded.getOrder)) {
			position = loaded.getOrder();
			filters[position] = loaded;
		}
		else {
			filters.push(loaded);
		}
		log.verbose('Loaded filter '+files[i]+' into stage '+ stage + ', position '+ position);
	}

	var files = fs.readdirSync(this._directory, this._fileEncoding);
	var loaded = null;
	for (var i=0;i<files.length;i++) {
		if (this._filenameFormatter.isValid(files[i])) {
			loaded = new (require(process.cwd()+path.sep+this._directory+files[i])); 

			log.verbose('Loading all filters at once...');
			if (svUtil.isFunction(loaded.executePre)) {
				populate('pre', this._filters.pre, loaded);
			}
			if (svUtil.isFunction(loaded.executePost)) {
				populate('post', this._filters.post, loaded);
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
	filterProviderAlreadyLoaded[directory] = true;
}

FilterProviderByDirectory2.prototype.getPreFilters = function() {
	return this._filters.pre;
}

FilterProviderByDirectory2.prototype.getPostFilters = function() {
	return this._filters.post;
}

module.exports = FilterProviderByDirectory2;
