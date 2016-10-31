function MixSessionHandler() {}

MixSessionHandler.prototype = {
	
	sessionStart : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log('Start');
	}
};

module.exports = MixSessionHandler;