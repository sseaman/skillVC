var InternHandlerManager = require('../intentHandler/defaultIntentHandlerManager.js');
var log = require('../skillVCLogger.js').getLogger('IntentHandlerFilter');

/**
 * Wrapper for IntentHandlerManager that works as a Filter
 * 
 * @param {[type]} intentHandlers [description]
 */
function IntentHandlerFilter(intentHandlerManager) {
	this._intentHandlerManager = intentHandlerManager;
}

/**
 * Places the response of the invoked intent into the filterContext.filterSession.response 
 * 
 * @param  {[type]} filterContext [description]
 * @return {[type]}               [description]
 */
IntentHandlerFilter.prototype.execute = function(filterContext) {
	log.verbose("Passing off to IntentHandlerManager "+this._intentHandlerManager.constructor.name);

	this._intentHandlerManager.handleIntent(filterContext.skillEvent, filterContext.skillContext, {
		success : function(response) {
			filterContext.filterSession.response = response;
			filterContext.filterCallback.success();
		},
		failure : function(error) {
			filterContext.filterSession.response = error;
			filterContext.filterCallback.failure();
		}
	});
}

IntentHandlerFilter.prototype.executeOnError = function(filterContext) {
	filterContext.filterCallback.failure();
}

module.exports = IntentHandlerFilter;