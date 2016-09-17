var SkillVC = require('./skillVC.js');
var CardManagerFactory = require('./card/cardManagerFactory.js');
var FilterManagerFactory = require('./filter/FilterManagerFactory.js');
var IntentHandlerFilter = require('./filter/intentHandlerFilter.js');
var IntentHandlerManagerFactory = require('./intentHandler/intentHandlerManagerFactory.js');

function SkillVCFactory() {}

SkillVCFactory.createfromDirectory = function() {
	return new SkillVC({
		'cardManager' : CardManagerFactory.createHandlebarEnabledByDirectory('../assets/cards'),
		'filterManager'	: {
			'pre' 		: FilterManagerFactory.createByDirectory('../assets/filters').getPreFilters(),
			'post'		: FilterManagerFactory.createByDirectory('../assets/filters').getPostFilters()
		},
		'intentHandlerManager' : IntentHandlerManagerFactory.createByDirectory('../assets/intents'),
		'logLevels' 	: { 'all' : 'debug'}
	});
}

SkillVCFactory.createFromScan = function() {
	
}

module.exports = SkillVCFactory;