
function StartFilter() {}

StartFilter.prototype.getStages = function() {
	return ['pre', 'post'];
}

StartFilter.prototype.execute = function(svContext) {
	svContext.filterChainCallback.success();
}


StartFilter.prototype.executePre = function(svContext) {
	svContext.filterChainCallback.success();
}

StartFilter.prototype.executePost = function(svContext) {
	svContext.filterChainCallback.success();
}

module.exports = StartFilter;