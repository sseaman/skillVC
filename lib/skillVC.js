/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var FilterChainExecutor = require('./filter/filterChainPromiseExecutor.js');
var SessionHandlerExecutor = require('./sessionHandler/sessionHandlerExecutor.js');
var IntentHandlerFilter = require('./intentHandler/intentHandlerFilter.js');
var ContextWrapperFilter = require('./context/contextWrapperFilter.js');
var log = require('winston-simple').getLogger('SkillVC');

/**
 * Creates an instance of SkillVC.
 *
 * Most uses of SkillVC are better instantiated by using one of the methods in {@link SkillVCFactory}.
 * However, if none of those functions provide the functionality required, or if more customization of SkillVC
 * is required, this constructor should be used.
 *
 * SkillVC, by default, requires the objects defined in {@link SVContext#appConfig} be set.  However, if
 * any of the SkillVC functions have been overridden, the functionality and required configuration would change.
 * 
 * @constructor
 * @param {SVContext.appConfig} config The configuration to initialized SkillVC with.  As this configuration
 * is made available throughout the execution of SkillVC it can also be used as a means to inject objects into
 * SkillVC to be used by objects downstream.
 */
function SkillVC(config) {
	// main context object for the whole system
	this._skillVCContext = {};
	this._skillVCContext.appConfig = config;

	this._initialized = false;
}

/**
 * Initializes SkillVC.  This is only called once (unless SkillVC is dumped from memory and recreated).
 *
 * The execution series of SkillVC is as follows:
 *
 * * Clear the appSession
 * * Place the lambda information (event, context) into the {@link SVContext}
 * * Register the @{link ResponseManager}
 * * Register the @{link SessionHandlerManager}
 * * Register the @{link FilterManager}
 * * Register the @{link IntentHandlerManager}
 * * Record that init completed (so it doesn't fire ever again)
 * * Call the initCallback.success function
 *
 * @function
 * @param  {Object} event        The Lambda event
 * @param  {Object} context      The Lambda context
 * @param  {SkillVC~callback} initCallback The callback used when initialization completes
 * @return {SkillVC} This instance of SkillVC for use in builder style calling
 */
SkillVC.prototype.init = function(event, context, initCallback) {
	if (this._initialized) {
		initCallback.success();  // nothing to do, pop out
		return;
	}

	log.info("Initializing...");

	// reset the context session
	this._skillVCContext.appSession = {};

	// make things available to anyone
	this._skillVCContext.lambda = { 
		'context' : context,
		'event' : event
	};
	this._skillVCContext.appConfig.filterChainExecutor = null;
	this._skillVCContext.appConfig.sessionHandlerExecutor = null;

	log.info("Registering ResponseManager");
	this._skillVCContext.appConfig.responseManager = this.registerResponseManager(this._skillVCContext);

	log.info("Registering SessionHandlerManager");
	this._skillVCContext.appConfig.sessionHandlerManager = this.registerSessionHandlerManager(this._skillVCContext);

	var sv = this;
	// might be a way to do this with promises, but I'm not going to put the time into it yet
	log.info("Registering Filters");
	sv.registerFilterManager(sv._skillVCContext, {
		success : function(filterManager) {

			log.info("Registering Intent Handlers");
			sv.registerIntentHandlerManager(sv._skillVCContext, {
				success : function(iHandlerManager) {
					
					// need to do this to get the intents to be handled as part of the chain
					log.debug("Injecting IntentHandlerFilter as pre filter");
					var preFilters = filterManager.getPreFilters();
					preFilters.push(new IntentHandlerFilter(iHandlerManager));

					// need to do this to convert the intent results to something lambda understands
					log.debug("Adding ContextWrapperFilter as last post filter");
					var postFilters = filterManager.getPostFilters();
					postFilters.push(new ContextWrapperFilter());

					sv._skillVCContext.appConfig.filterChainExecutor = new FilterChainExecutor(
						preFilters, 
						postFilters
						);

					sv._skillVCContext.appConfig.sessionHandlerExecutor = new SessionHandlerExecutor(
						sv._skillVCContext.appConfig.sessionHandlerManager.getStartSessionHandlers(),
						sv._skillVCContext.appConfig.sessionHandlerManager.getEndSessionHandlers()
						);

					sv._initialized = true;
					log.info("Initialization complete");
					initCallback.success(); // registration completed
				},
				failure : function(err) {
					initCallback.failure(err);
				}
			});
		},
		failure : function(err) {
			initCallback.failure(err);
		}
	});

	return this;
};

/**
 * The handler() function should be invoked by the index.js of the skill to transfer control of the
 * skill execution into SkillVC.
 *
 * Upon execution the {@link SVContext.session} and {@link SVContext.callback} will be reset to provide a
 * clean execution state.  The configured {@link FilterChainExecutor~execute} will be invoked 
 * 
 * @function
 * @param  {Object} event        The Lambda event
 * @param  {Object} context      The Lambda context
 */
SkillVC.prototype.handler = function (event, context)  {
	log.info("Handler invoked");

    try {
		if (this._skillVCContext.appId && (event.session.application.applicationId !== this._skillVCContext.appId)) {
			throw new Error("Invalid Application ID");
		}

        var sv = this;
		sv.init(event, context, {
			success : function() {
				// re-setting just in case
				sv._skillVCContext.lambda.context = context;
				sv._skillVCContext.lambda.event = event;

				// give a session for people to use
				sv._skillVCContext.session = {};

				var handleRequest = function(eventType, svContext) {
					if (eventType === "IntentRequest" || eventType === "LaunchRequest") {
						svContext.appConfig.filterChainExecutor.execute(svContext);
					} 
					else if (eventType === "SessionEndedRequest" 
						&& svContext.appConfig.sessionHandlerExecutor) 
					{
						svContext.appConfig.sessionHandlerExecutor.executeEnd(svContext);
					}
					else {
						context.fail("Nothing to do");
					}
				};

				if (event.session && event.session.new && sv._skillVCContext.appConfig.sessionHandlerExecutor) {
					// since session starts can be async, we have to handle the promise
					// have to use bind because you don't want to call the function now, you want the call to `then` to do it
					sv._skillVCContext.appConfig.sessionHandlerExecutor.executeStart(sv._skillVCContext)
						.then(handleRequest.bind(this, event.request.type, sv._skillVCContext));
				}
				else {
					// if we don't have to wait for session start, just run like normal
					handleRequest(event.request.type, sv._skillVCContext);
				}
			},
			failure : function(err) {
				log.error("Error Initializing. "+err);
				throw new Error("Error initializing. "+err);
			}
		});
    } catch (e) {
		log.error("Exception handling skill request:"+e.stack);
		context.fail("Exception handling skill request: " + e);
	}
};

/**
 * Called when SkillVC is looking to register/load the ResponseManager.  By default this method uses the
 * ResponseManager specified by svContext.appConfig.responseManager.
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach
 * 
 * @function
 * @param  {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @return {ResponseManager}         	The ResponseManager to use
 */
SkillVC.prototype.registerResponseManager = function(svContext) {
	return svContext.appConfig.responseManager;
};

/**
 * Called when SkillVC is looking to register/load the SessionHandlerManager.  By default this method uses the
 * SessionHandlerManager specified by svContext.appConfig.sessionHanlerManager.
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach
 * 
 * @function
 * @param  {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @return {SessionHandlerManager}  The SessionHandlerManager to use
 */
SkillVC.prototype.registerSessionHandlerManager = function(svContext) {
	return svContext.appConfig.sessionHandlerManager;
};

/**
 * Called when SkillVC is looking to register/load the IntentHandlerManager. By default this method uses
 * the {@link IntentHandlerManager} specified by svContext.appConfig.intentHandlerManager.  To have the 
 * IntentHandlerManager by part of the execution cycle the passed in IntentHandlerManager is wrapped
 * by a {@link IntentHandlerFilter}.
 *
 * When creating an IntentHandler, if you specifiying an intent name of 'launch' 
 * it will cause the IntentHandler to be invoked on a @link{http://tinyurl.com/jpdl5cc|LaunchRequest}
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach but will need
 * to take into consideration that SkillVC requires a {@link IntentHandlerFilter} to actually execute
 * 
 * @function
 * @param  {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @param {SkillVC~callback} callback	The callback to use when registration has completed
 */
SkillVC.prototype.registerIntentHandlerManager = function(svContext, callback) {
	callback.success(svContext.appConfig.intentHandlerManager);
};

/**
 * Called when SkillVC is looking to register/load the FilterManager.  By default this method uses the
 * {@link Filter|FilterManager} specified by svContext.appConfig.filterManager
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach
 * 
 * @function
 * @param {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @param {SkillVC~callback} callback	The callback to use when registration has completed
 */
SkillVC.prototype.registerFilterManager = function(svContext, callback) {
	callback.success(svContext.appConfig.filterManager);
};

/**
 * Returns the current SkillVC context instance
 * 
 * @fuction
 * @return {SVContext} The SVContext of this instance of SkillVC
 */
SkillVC.prototype.getContext = function() {
	return this._skillVCContext;
};

/**
 * @typedef {Object<string,function>} SkillVC~callback
 * @property {function} success 
 * @property {JSON} 	success.result The results of the successful registration
 * @property {function} failure
 * @property {JSON}   	failure.error The result of an unsuccessful registration
 */


module.exports = SkillVC;