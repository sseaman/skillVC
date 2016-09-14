var AbstractProviderManager = require('../provider/abstractProviderManager.js');
var log = require('../skillVCLogger.js').getLogger('DefaultFilterManager');

//FIXME: Change to DefaultFilterManager and should take a provider, not the list of filters


/**
 * Manager for Intercepting filter implementation
 * 
 * @param {Filter} filters Filters to use.  Can be null and filters later set via addFilter
 */
function DefaultFilterManager(providers) {
	this._providers = providers;

	AbstractProviderManager.apply(this, [providers]);
}

DefaultFilterManager.prototype = AbstractProviderManager.prototype;
DefaultFilterManager.prototype.contructor = DefaultFilterManager;

/**
 * Filter  that handles async processing by using callbacks to go to the next filter in the 
 * 
 * @param  {[type]} filterContext [description]
 * @return {[type]}               [description]
 */
DefaultFilterManager.prototype.execute = function(svContext) {
	var fcm = this._filters; // take care of scope
	var i = 0;

	var filterCallback = {
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

	// Filters should use the dedicated filterCallback and not the main callback
	svContext.filterCallback = filterCallback;  // set the callback so the filter  can continue if callback is called
	
	filterCallback.success(); //start things off
}

module.exports = DefaultFilterManager;