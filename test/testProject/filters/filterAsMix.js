function FilterAsMix() { }

FilterAsMix.prototype = {
	
	executePre : function(event, context, svContext) {
		/*eslint no-unused-vars: ["error", { "args": "none" }]*/
		console.log("Pre");
		//throw new Error("Error in Filtersssssss");
		svContext.filterChainCallback.success();
	}
};

module.exports = FilterAsMix;