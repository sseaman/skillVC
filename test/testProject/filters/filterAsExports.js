module.exports = {

	executePre : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("Pre");
		return new Promise(function(resolve, reject) {
			console.log("In Promise");
			setTimeout(function(){
				console.log('TImer out');
				resolve();
			}, 2000);      
		});
	},

	executePreOnError : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("PreOnError");
		svContext.filterChainCallback.failure();
	},

	executePost : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("Post");
		svContext.filterChainCallback.success();
	},

	executePostOnError : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("PostOnError");
		svContext.filterChainCallback.failure();
	}

};