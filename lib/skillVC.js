/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 *  Global TODO/FIXME LIST (things that are global and not specific to one object)
 *  TODO: I coded parts thinking for some stupid reason that JS was pass by ref, not by value.
 *  	As such, I'm most likely doing a TON of deepCopy and clones that don't need to happen and could improve perf.
 *  	Not sure what I was thinking
 *  FIXME: Responses is messed up.  They build the correct part for the root part of the response, but they don't wrap
 *  	it correctly for the context.success() / context.fail().  Need to figure out where this is best served.
 *  	How the f* did I miss that?
 */

/** @private */
var ResponseManagerFactory = require('./response/responseManagerFactory.js');
var FilterChainExecutor = require('./filter/filterChainExecutor.js');
var FilterManagerFactory = require('./filter/filterManagerFactory.js');
var IntentHandlerFilter = require('./filter/intentHandlerFilter.js');
var ResponseRendererFilter = require('./filter/responseRendererFilter.js');
var IntentHandlerManagerFactory = require('./intentHandler/intentHandlerManagerFactory.js');
var Logger = require('./skillVCLogger.js');
var log = Logger.getLogger('SkillVC');
var svUtil = require('./util.js');
var fs = require('fs');

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
	Logger.setLevels(this._skillVCContext.appConfig.logLevels);

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
 */
SkillVC.prototype.init = function(event, context, initCallback) {
	if (this._initialized) initCallback.success();  // nothing to do, pop out

	log.verbose("Initializing...");

	// reset the context session
	this._skillVCContext.appSession = {};

	// make things available to anyone
	this._skillVCContext.lambda = { 
		'context' : context,
		'event' : event
	};
	this._skillVCContext.appConfig.filterChainExecutor = null;

	log.verbose("Registering ResponseManager");
	this._skillVCContext.appConfig.responseManager = this.registerResponseManager(this._skillVCContext);

	log.verbose("Registering SessionHandlerManager");
	this._skillVCContext.appConfig.sessionHandlerManager = this.registerSessionHandlerManager(this._skillVCContext);

	var sv = this;
	// might be a way to do this with promises, but I'm not going to put the time into it yet
	log.verbose("Registering Filters");
	sv.registerFilterManager(sv._skillVCContext, {
		success : function(filterManager) {

			log.verbose("Registering Intent Handlers");
			sv.registerIntentHandlerManager(sv._skillVCContext, {
				success : function(iHandlerManager) {
					
					// need to do this to get the intents to be handled as part of the chain
					log.debug("Injecting IntentHandlerFilter as pre filter");
					var preFilters = filterManager.getPreFilters();
					preFilters.push(new IntentHandlerFilter(iHandlerManager));

					// need to do this to convert the intent results to something lambda understands
					log.debug("Adding SkillReponseFilter as last post filter");
					var postFilters = filterManager.getPostFilters();
					postFilters.push(new ResponseRendererFilter());

					sv._skillVCContext.appConfig.filterChainExecutor = new FilterChainExecutor(
						preFilters, 
						postFilters
						);
					sv._initialized = true;
					log.verbose("Initialization complete");
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
}

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
	log.verbose("Handler invoked");

    try {
    	if (this._skillVCContext.appId && (event.session.application.applicationId != this._skillVCContext.appId)) {
        	throw new Error("Invalid Application ID");
        }

        var sv = this;
    	sv.init(event, context, {
    		success : function() {
    			// re-setting just in case
    			sv._skillVCContext.lambda.context = context;
    			sv._skillVCContext.lambda.event = event;

    			// all intents should use this to call back to 
    			sv._skillVCContext.callback = null;

    			// give a session for people to use
    			sv._skillVCContext.session = {};

				if (event.session.new && sv._skillVCContext.appConfig.sessionHandlerManager) {
					sv._skillVCContext.appConfig.sessionHandlerManager.executeStart(sv._skillVCContext);
		    	}

		        if (event.request.type === "IntentRequest" || event.request.type === "LaunchRequest") {
		        	sv._skillVCContext.appConfig.filterChainExecutor.execute(sv._skillVCContext);
		        } 
		        else if (event.request.type === "SessionEndedRequest" &&
		        	sv._skillVCContext.appConfig.sessionHandlerManager) 
		        {
		       		sv._skillVCContext.appConfig.sessionHandlerManager.executeEnd(sv._skillVCContext);
		        }
    		},
    		failure : function(err) {
    			throw new Error("Error initializing "+err);
    		}
    	})
    } catch (e) {
    	log.error("Exception handling skill request:"+e+"\n"+e.stack);
        context.fail("Exception handling skill request: " + e);
    }
}

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
}

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
	return svContext.appConfig.sessionHanlerManager;
}

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
}

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
}

/**
 * Returns the current SkillVC context instance
 * 
 * @fuction
 * @return {SVContext} The SVContext of this instance of SkillVC
 */
SkillVC.prototype.getContext = function() {
	return this._skillVCContext;
}

/**
 * @typedef {Object<string,function>} SkillVC~callback
 * @property {function} success 
 * @property {JSON} 	success.result The results of the successful registration
 * @property {function} failure
 * @property {JSON}   	failure.error The result of an unsuccessful registration
 */


module.exports = SkillVC;