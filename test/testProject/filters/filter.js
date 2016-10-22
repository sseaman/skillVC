
function StartFilter() {}

StartFilter.prototype.getStages = function() {
	return ['pre', 'post'];
};

StartFilter.prototype.executePre = function(svContext) {
	console.log("PRE");
	svContext.filterChainCallback.success();
};

StartFilter.prototype.executePostOnError = function(svContext) {
	console.log("POSTERR");
	svContext.filterChainCallback.failure();
};

module.exports = StartFilter;