var SkillVCFactory = require('../../lib/skillVCFactory.js');

exports.handler = function(event, context) {
	SkillVCFactory.createfromDirectory().handler(event, context);
};