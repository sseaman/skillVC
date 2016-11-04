function StartFilter() {}

StartFilter.prototype.executePre = function(event, context, svContext) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	console.log("Pre");
	svContext.filterChainCallback.success();
};

module.exports = StartFilter;