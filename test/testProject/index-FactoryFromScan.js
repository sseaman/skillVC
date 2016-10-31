var SkillVCFactory = require('../../lib/skillVCFactory.js');

exports.handler = function(event, context) {
	SkillVCFactory.createFromScan([
		'./filters/filterAsExports.js', 
		'./sessionHandlers/sessionHandlerAsMix.js',
		'./responses/card.json',
		'./intents/intentHandlerAsExportNoList.js',
		'./filters/filterAsObject.js',
		'./intents/intentHandlerAsMix.js',
		'./responses/card copy.json',
		'./sessionHandlers/sessionHandlerAsObject.js'
		]).handler(event, context);
};