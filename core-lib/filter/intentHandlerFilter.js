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
 * Places the response of the invoked intent into the svContext.filterSession.response 
 *
 * Filterchains should use the dedicated filterChainCallback and not the main callback
 * 
 * @param  {[type]} svContext [description]
 * @return {[type]}               [description]
 */
IntentHandlerFilter.prototype.execute = function(svContext) {
	log.verbose("Passing off to IntentHandlerManager "+this._intentHandlerManager.constructor.name);

	svContext.callback = {
		success : function(response) {
			svContext.session.response = response;
			svContext.filterChainCallback.success(); 
		},
		failure : function(error) {
			svContext.session.response = error;
			svContext.filterChainCallback.failure();
		}
	};

	this._intentHandlerManager.handleIntent(svContext);
}

IntentHandlerFilter.prototype.executeOnError = function(svContext) {
	svContext.filterChainCallback.failure();
}

module.exports = IntentHandlerFilter;