var AbstractProviderManager = require('../provider/abstractProviderManager.js');
var log = require('../skillVCLogger.js').getLogger('DefaultIntentHandlerManager');
/**
 * Manages intents
 * 
 * @param {[IntentHandlers]} intentHandlers Array of intent handlers
 */
function DefaultIntentHandlerManager(providers) {
	this._handlers = {};
	this._handlerNotFound = {};

	AbstractProviderManager.apply(this, [providers]);
}

DefaultIntentHandlerManager.prototype = AbstractProviderManager.prototype;
DefaultIntentHandlerManager.prototype.contructor = DefaultIntentHandlerManager;

/**
 * Handle an intent that has occurred
 * 
 * @param  {[type]}   event    [description]
 * @param  {[type]}   context  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
DefaultIntentHandlerManager.prototype.handleIntent = function(svContext) {
	var intentName = svContext.lambda.event.request.intent.name;
	var providers = this.getRegisteredProviders();

	log.verbose("Handling intent "+intentName);

	var handler = this._handlers[intentName];
	if (handler == null && !this._handlerNotFound[intentName]) { // intent isn't in cache and was never looked for
		log.debug("Handler not loaded. Attempting to load");

		for (var i=0;i<providers.length;i++) {
			// This could be expensive at is could cause all of the file loading to occur when looking for a intent
			handler = providers[i].getItem(intentName);
			if (handler != null) {
				this._handlers[intentName] = handler; // found it. set it so I never have to look again
				log.debug("Handler loaded");
				break; // hop out if I find it
			}
		}
		if (handler == null) {
			this._handlerNotFound[intentName] == true; // never will find it, so record this fact so we don't ever look again
			log.verbose("Intent handler not found for intent: "+intentName);
		}
	}

	if (handler) {
		log.verbose("Executing handler");
		handler.handleIntent(svContext);
	}
}

module.exports = DefaultIntentHandlerManager;