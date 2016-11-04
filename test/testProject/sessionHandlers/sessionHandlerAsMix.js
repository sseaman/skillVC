function MixSessionHandler() {}

MixSessionHandler.prototype = {
	
	sessionStart : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("Start");
		return new Promise(function(resolve, reject) {
			console.log("In Promise");
			setTimeout(function(){
				console.log('Timer out - Session');
				resolve();
			}, 2000);      
		});
	}
};

module.exports = MixSessionHandler;