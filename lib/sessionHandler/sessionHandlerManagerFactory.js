/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultSessionHandlerManager = require('./defaultSessionHandlerManager.js');
var SessionHandlerProviderByDirectory = require('../provider/convention/sessionHandlerProviderByDirectory.js');
var SessionHandlerProviderByFile = require('../provider/convention/sessionHandlerProviderByFile.js');
var SessionHandlerProviderByMap = require('../provider/convention/sessionHandlerProviderByMap.js');

/**
 * Creates an instance of SessionHandlerManager.  This should never need to be called and is here as a placeholder.
 *
 * @see  {@link SessionHandlerManager}
 * @constructor
 */
function SessionHandlerManagerFactory() {
	
}

/**
 * Creates a SessionHandlerManager using the single directory provided.
 * 
 * @see  {@link DefaultSessionHandlerManager}
 * @see {@link SessionHandlerProviderByDirectory}
 * @function
 * @param  {String} directory The directory to read the SessionHandlers from
 * @return {SessionHandlerManager} The SessionHandlerManager.
 */
SessionHandlerManagerFactory.createByDirectory = function(directory) {
	return new DefaultSessionHandlerManager([new SessionHandlerProviderByDirectory(directory)]);
};

/**
 * Creates a SessionHandlerManager using the single file or array of files provided.
 * 
 * @see  {@link DefaultSessionHandlerManager}
 * @see {@link FilterProviderByFile}
 * @function
 * @param  {String|Array.String} files The file or array of files to load as a SessionHandlers
 * @return {SessionHandlerManager} The SessionHandlerManager.
 */
SessionHandlerManagerFactory.createByFile = function(files) {
	if (Array.isArray(files)) {
		var providers = [];
		for (var i=0;i<files.length;i++) {
			providers.push(new SessionHandlerProviderByFile(files[i]));
		}
		return new DefaultSessionHandlerManager(providers);
	}
	else {
		return new DefaultSessionHandlerManager([new SessionHandlerProviderByFile(files)]);
	}
};

/**
 * Creates a SessionHandlerManager using the map provided.
 * 
 * @see  {@link DefaultSessionHandlerManager}
 * @see {@link SessionHandlerProviderByMap}
 * @function
 * @param  {String} map The map to load the filters from
 * @return {SessionHandlerManager} The SessionHandlerManager.
 */
SessionHandlerManagerFactory.createByMap = function(map) {
	return new DefaultSessionHandlerManager([new SessionHandlerProviderByMap(map)]);
};

module.exports = SessionHandlerManagerFactory;