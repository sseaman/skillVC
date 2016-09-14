var log = require('../skillVCLogger.js').getLogger('FilterChainExecutor');

//FIXME: Change to DefaultFilterChainManager and should take a provider, not the list of filters


/**
 * Manager for Intercepting filter implementation
 * 
 * @param {Filter} filters Filters to use.  Can be null and filters later set via addFilter
 */
function FilterChainExecutor(filters) {
	this._filters = (filters) ? filters : [];
}

/**
 * Adds filters to the chain
 * 
 * @param {Filter} filters The filters to add to the chain
 */
FilterChainExecutor.prototype.addFilters = function(filters) {
	if (filters != null) {
		if (Array.isArray(filters)) {
			for (var i=0;i<filters.length;i++) {
				this._filters.push(filters[i]);
			}
		}
		else {
			this._filters.push(filters);
		}
	}
}

/**
 * Filter chain that handles async processing by using callbacks to go to the next filter in the chain
 * 
 * @param  {[type]} filterContext [description]
 * @return {[type]}               [description]
 */
FilterChainExecutor.prototype.execute = function(svContext) {
	var fcm = this._filters; // take care of scope
	var i = 0;

	var filterChainCallback = {
		success : function() {
			if (i < fcm.length) {
				log.verbose("Executing filter "+fcm[i].constructor.name);
				fcm[i++].execute(svContext);
			}
		},
		failure : function() {
			if (i < fcm.length) {
				log.verbose("Executing filter "+fcm[i].constructor.name);
				fcm[i++].executeOnError(svrContext);
			}
		}
	}

	// Filterchains should use the dedicated filterChainCallback and not the main callback
	svContext.filterChainCallback = filterChainCallback;  // set the callback so the filter chain can continue if callback is called
	
	filterChainCallback.success(); //start things off
}

module.exports = FilterChainExecutor;