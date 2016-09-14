var DefaultIntentHandlerManager = require('./defaultIntentHandlerManager.js');
var IntentHandlerProviderByDirectory = require('./provider/intentHandlerProviderByDirectory.js');
var IntentHandlerProviderByFile = require('./provider/intentHandlerProviderByFile.js');
var IntentHandlerProviderByMap = require('./provider/intentHandlerProviderByMap.js');

function IntentHandlerManagerFactory() {
	
}

IntentHandlerManagerFactory.createByDirectory = function(directory) {
	return new DefaultIntentHandlerManager([new IntentHandlerProviderByDirectory(directory)]);
}

IntentHandlerManagerFactory.createByFile = function(file) {
	return new DefaultIntentHandlerManager([new IntentHandlerProviderByFile(file)]);
}

IntentHandlerManagerFactory.createByMap = function(map) {
	return new DefaultIntentHandlerManager([new IntentHandlerProviderByMap(map)]);
}

module.exports = IntentHandlerManagerFactory;