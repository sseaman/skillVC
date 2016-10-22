/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultFilterManager = require('./defaultFilterManager.js');
var FilterProviderByDirectory = require('../provider/convention/filterProviderByDirectory.js');
var FilterProviderByFile = require('../provider/convention/filterProviderByFile.js');
var FilterProviderByMap = require('../provider/convention/filterProviderByMap.js');

/**
 * Creates an instance of FilterManager.  This should never need to be called and is here as a placeholder.
 *
 * @see  {@link FilterManager}
 * @constructor
 */
function FilterManagerFactory() {
	
}

/**
 * Creates a FilterManager using the single directory provided.
 * 
 * @see  {@link DefaultFilterManager}
 * @see {@link FilterProviderByDirectory}
 * @function
 * @param  {String} directory The directory to read the filters from
 * @return {FilterManager} The FilterManager.
 */
FilterManagerFactory.createByDirectory = function(directory) {
	return new DefaultFilterManager([new FilterProviderByDirectory(directory)]);
};

/**
 * Creates a FilterManager using the single file or array of files provided.
 * 
 * @see  {@link DefaultFilterManager}
 * @see {@link FilterProviderByFile}
 * @function
 * @param  {String|Array.String} files The file or array of files to load as a filter
 * @return {FilterManager} The FilterManager.
 */
FilterManagerFactory.createByFile = function(files) {
	if (Array.isArray(files)) {
		var providers = [];
		for (var i=0;i<files.length;i++) {
			providers.push(new FilterProviderByFile(files[i]));
		}
		return new DefaultFilterManager(providers);
	}
	else {
		return new DefaultFilterManager([new FilterProviderByFile(files)]);
	}
};

/**
 * Creates a FilterManager using the map provided.
 * 
 * @see  {@link DefaultFilterManager}
 * @see {@link FilterProviderByMap}
 * @function
 * @param  {String} map The map to load the filters from
 * @return {FilterManager} The FilterManager.
 */
FilterManagerFactory.createByMap = function(map) {
	return new DefaultFilterManager([new FilterProviderByMap(map)]);
};

module.exports = FilterManagerFactory;