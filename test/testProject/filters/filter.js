
function StartFilter() {}

StartFilter.prototype.getStages = function() {
	return ['pre', 'post'];
};

StartFilter.prototype.executePre = function(event, context, svContext) {
	console.log("PRE");
	svContext.filterChainCallback.success();
};

StartFilter.prototype.executePostOnError = function(event, context, svContext) {
	console.log("POSTERR");
	svContext.filterChainCallback.failure();
};

module.exports = StartFilter;