var SkillVCFactory = require('../lib/skillVCFactory.js');

exports.handler = function(event, context) {
	SkillVCFactory.createfromDirectory().handler(event, context);
	// SkillVCFactory.createFromScan([
	// 	'../assets/filters/filter.js', 
	// 	'../assets/responses/card.json',
	// 	'../assets/intents/hello.js'
	// 	]).handler(event, context);
}