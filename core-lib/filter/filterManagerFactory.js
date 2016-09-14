var DefaultFilterManager = require('./defaultFilterManager.js');
var FilterProviderByDirectory = require('./provider/FilterProviderByDirectory.js');
var FilterProviderByFile = require('./provider/FilterProviderByFile.js');
var FilterProviderByMap = require('./provider/FilterProviderByMap.js');

function FilterManagerFactory() {
	
}

FilterManagerFactory.createByDirectory = function(directory) {
	return null;
	//return new DefaultFilterManager([new FilterProviderByDirectory(directory)]);
}

FilterManagerFactory.createByFile = function(file) {
	return new DefaultFilterManager([new FilterProviderByFile(file)]);
}

FilterManagerFactory.createByMap = function(map) {
	return new DefaultFilterManager([new FilterProviderByMap(map)]);
}

module.exports = FilterManagerFactory;