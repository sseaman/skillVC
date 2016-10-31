function StartFilter() {}

StartFilter.prototype.executePre = function(event, context, svContext) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	console.log("Pre");
	svContext.filterChainCallback.success();
};

StartFilter.prototype.executePreOnError = function(event, context, svContext) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	console.log("PreOnError");
	svContext.filterChainCallback.failure();
};

module.exports = StartFilter;