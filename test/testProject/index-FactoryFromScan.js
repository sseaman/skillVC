var SkillVCFactory = require('../../lib/skillVCFactory.js');

exports.handler = function(event, context) {
	SkillVCFactory.createFromScan([
		'./testProject/filters/filter.js', 
		'./testProject/responses/card.json',
		'./testProject/intents/hello.js'
		]).handler(event, context);
};