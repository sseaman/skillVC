module.exports = {

	executePre : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("Pre");
		svContext.filterChainCallback.success();
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