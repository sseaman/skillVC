var SkillVCFactory = require('../../lib/skillVCFactory.js');
var path = require('path');

exports.handler = function(event, context) {
	SkillVCFactory.createfromDirectory().handler(event, context);
};