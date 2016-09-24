var SkillVCFactory = require('./core-lib/skillVCFactory.js');

exports.handler = function(event, context) {
	//SkillVCFactory.createfromDirectory().handler(event, context);
	SkillVCFactory.createFromScan(["../assets/filters/filter.js", '../assets/cards/card.json']).handler(event, context);
}