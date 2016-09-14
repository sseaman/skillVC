var DefaultFilterManager = require('./defaultFilterChainManager.js');
var FilterProviderByDirectory = require('./provider/FilterProviderByDirectory.js');
var FilterProviderByFile = require('./provider/FilterProviderByFile.js');
var FilterProviderByMap = require('./provider/FilterProviderByMap.js');

function FilterManagerFactory() {
	
}

FilterManagerFactory.createByDirectory = function(directory) {
	return new DefaultFilterChainManager([new FilterProviderByDirectory(directory)]);
}

FilterManagerFactory.createByFile = function(file) {
	return new DefaultFilterChainManager([new FilterProviderByFile(file)]);
}

FilterManagerFactory.createByMap = function(map) {
	return new DefaultFilterChainManager([new FilterProviderByMap(map)]);
}

module.exports = FilterManagerFactory;