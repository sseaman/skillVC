
function StartFilter() {}

StartFilter.prototype.getStages = function() {
	return ['pre', 'post'];
}

StartFilter.prototype.execute = function(svContext) {
	svContext.filterChainCallback.success();
}

module.exports = StartFilter;