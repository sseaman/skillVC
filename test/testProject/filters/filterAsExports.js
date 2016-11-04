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

	executePost : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("Post");
		svContext.filterChainCallback.success();
	}

};