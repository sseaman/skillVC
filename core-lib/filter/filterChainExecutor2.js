var log = require('../skillVCLogger.js').getLogger('FilterChainExecutor2');

function FilterChainExecutor2(preFilters, postFilters) {
	this._pre = preFilters;
	this._post = postFilters;
}

FilterChainExecutor2.prototype.execute = function(svContext) {
	var preIdx = 0;
	var postIdx = 0;

	var fcm = this;
	var filterChainCallback = {
		success : function() {
			if (preIdx < fcm._pre.length) {
				log.verbose("Executing Pre filter "+fcm._pre[preIdx].constructor.name);
				fcm._pre[preIdx++].executePre(svContext);
			}
			else if (postIdx < fcm._post.length) {
				log.verbose("Executing Post filter "+fcm._post[postIdx].constructor.name);
				fcm._post[postIdx++].executePost(svContext);
			}
		},
		failure : function() {
			if (preIdx < fcm._pre.length) {
				log.verbose("Executing Pre filter "+fcm._pre[preIdx].constructor.name);
				fcm._pre[preIdx++].executePreOnError(svContext);
			}
			else if (postIdx < fcm._post.length) {
				log.verbose("Executing Post filter "+fcm._post[postIdx].constructor.name);
				fcm._post[postIdx++].executePostOnError(svContext);
			}
		}
	}

	// Filterchains should use the dedicated filterChainCallback and not the main callback
	svContext.filterChainCallback = filterChainCallback;  // set the callback so the filter chain can continue if callback is called
	
	filterChainCallback.success(); //start things off
}

module.exports = FilterChainExecutor2;