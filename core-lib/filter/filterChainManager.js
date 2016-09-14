var log = require('../skillVCLogger.js').getLogger('FilterChainManager');
/**
 * Manager for Intercepting filter implementation
 * 
 * @param {Filter} filters Filters to use.  Can be null and filters later set via addFilter
 */
function FilterChainManager(filters) {
	this._filters = (filters) ? filters : [];
}

/**
 * Adds a filter to the chain
 * 
 * @param {Filter} filter The filter to add to the chain
 */
FilterChainManager.prototype.addFilter = function(filter) {
	if (filter != null) this._filters.push(filter);
}

/**
 * Adds filters to the chain
 * 
 * @param {Filter} filters The filters to add to the chain
 */
FilterChainManager.prototype.addFilters = function(filters) {
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
FilterChainManager.prototype.execute = function(filterContext) {
	var fcm = this._filters; // take care of scope
	var i = 0;

	var filterChainCallback = {
		success : function() {
			if (i < fcm.length) {
				log.verbose("Executing filter "+fcm[i].constructor.name);
				fcm[i++].execute(filterContext);
			}
		},
		failure : function() {
			if (i < fcm.length) {
				log.verbose("Executing filter "+fcm[i].constructor.name);
				fcm[i++].executeOnError(filterContext);
			}
		}
	}
	filterContext.filterCallback = filterChainCallback;  // set the callback so the filter chain can continue if callback is called
	filterChainCallback.success(); //start thigns off
}

module.exports = FilterChainManager;