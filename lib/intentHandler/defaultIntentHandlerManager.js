/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderManager = require('../provider/abstractProviderManager.js');
var log = require('winston-simple').getLogger('DefaultIntentHandlerManager');

/**
 * Manages intent handlers.
 *
 * @constructor
 * @implements {IntentHandlerManager}
 * @param {Array.Provider} An array of providers that will provide the intent handlers
 */
function DefaultIntentHandlerManager(providers) {
	this._handlers = {};
	this._handlerNotFound = {};

	AbstractProviderManager.apply(this, [providers]);
}

DefaultIntentHandlerManager.prototype = Object.create(AbstractProviderManager.prototype);
DefaultIntentHandlerManager.prototype.constructor = DefaultIntentHandlerManager;

/**
 * Handle an intent that has occurred by calling all of the providers looking for an 
 * {@link IntentHandler} that is registered for the intent.  If the intent handler is not found this method will
 * favor performance and never look for it again.
 *
 * If the svContext.lambda.event.request.type is of type @link{http://tinyurl.com/jpdl5cc|LaunchRequest}, the code will
 * look for a handler registered under the intent name 'launch'
 *
 * @function
 * @see  {@link IntentHandler}
 * @param  {SVContext} svContext The context to execute with
 */
DefaultIntentHandlerManager.prototype.handleIntent = function(svContext) {
	var intentName = (svContext.lambda.event.request.type == 'LaunchRequest') 
		? 'launch'
		: svContext.lambda.event.request.intent.name;

	var providers = this.getRegisteredProviders();

	log.verbose("Handling intent "+intentName);

	var handler = this._handlers[intentName];
	if (handler === null && !this._handlerNotFound[intentName]) { // intent isn't in cache and was never looked for
		log.debug("Handler not loaded from providers. Attempting to load");

		for (var i=0;i<providers.length;i++) {
			// This could be expensive at is could cause all of the file loading to occur when looking for a intent
			handler = providers[i].getItem(intentName);
			if (handler !== null) {
				this._handlers[intentName] = handler; // found it. set it so I never have to look again
				log.debug("Handler loaded");
				break; // hop out if I find it
			}
		}
		if (handler === null) {
			this._handlerNotFound[intentName] = true; // never will find it, so record this fact so we don't ever look again
			log.verbose("Intent handler not found for intent: "+intentName);
		}
	}

	if (handler) {
		log.verbose("Executing handler");
		handler.handleIntent(svContext);
	}
	else {
		// need to fire the callback so that the chain continues
		svContext.callback.failure();
	}
};

module.exports = DefaultIntentHandlerManager;