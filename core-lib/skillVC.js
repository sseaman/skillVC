/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var CardManagerFactory = require('./card/cardManagerFactory.js');
var FilterChainExecutor = require('./filter/filterChainExecutor.js');
var FilterManagerFactory = require('./filter/FilterManagerFactory.js');
var IntentHandlerFilter = require('./filter/intentHandlerFilter.js');
var SkillResponseFilter = require('./filter/skillResponseFilter.js');
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
 * * Register the @{link CardManager}
 * * Register the @{link Filter|Pre IntentFilters}
 * * Register the @{link IntentHandlerManager}
 * * Register the @{link Filter|Post IntentFilters}
 * * Record that init completed (so it doesn't fire ever again)
 * * Call the initCallback.success function
 *
 * @function
 * @param  {Object} event        The Lambda event
 * @param  {Object} context      The Lambda context
 * @param  {SkillVC~callback} initCallback The callback used when initialization completes
 */
SkillVC.prototype.init = function(event, context, initCallback) {
	if (this.initialized) return;  // nothing to do, pop out

	log.verbose("Initializing...");

	// reset the context session
	this._skillVCContext.appSession = {};

	// make things available to anyone
	this._skillVCContext.lambda = { 
		'context' : context,
		'event' : event
	};
	this._skillVCContext.appConfig.filterChainExecutor = null;

	log.verbose("Registering CardManager");
	this._skillVCContext.appConfig.cardManager = this.registerCardManager(this._skillVCContext);

	log.verbose("Registering SessionHandlerManager");
	this._skillVCContext.appConfig.sessionHanlerManager = this.registerSessionHandlerManager(this._skillVCContext);

	var sv = this;
	// might be a way to do this with promises, but I'm not going to put the time into it yet
	log.verbose("Registering PreIntent Filters");
	sv.registerPreIntentFilters(sv._skillVCContext, {
		success : function(preIHandlers) {

			log.verbose("Registering Intent Handlers");
			sv.registerIntentHandlers(sv._skillVCContext, {
				success : function(iHandlers) {

					log.verbose("Registering PostIntent Filters");
					sv.registerPostIntentFilters(sv._skillVCContext, {
						success : function(postIHandlers) {
							
							preIHandlers.push(iHandlers);
							sv._skillVCContext.appConfig.filterChainExecutor = new FilterChainExecutor(
								preIHandlers, postIHandlers
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

		        if (event.request.type === "LaunchRequest") {
		        //	handlers.launchRequest(event, context);
		        } 
		        else if (event.request.type === "IntentRequest") {
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
 * Called when SkillVC is looking to register/load the CardManager.  By default this method uses the
 * CardManager specified by svContext.appConfig.cardManager.
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach
 * 
 * @function
 * @param  {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @return {CardManager}         	The CardManager to use
 */
SkillVC.prototype.registerCardManager = function(svContext) {
	return svContext.appConfig.cardManager;
}

/**
 * Called when SkillVC is looking to register/load the Pre Filters.  By default this method uses the
 * {@link Filter|Filters} specified by svContext.appConfig.filterManager.pre
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach
 * 
 * @function
 * @param {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @param {SkillVC~callback} callback	The callback to use when registration has completed
 */
SkillVC.prototype.registerPreIntentFilters = function(svContext, callback) {
	var filters = svContext.appConfig.filterManager.pre;
	callback.success( (filters == null || filters.length == 0) ? [] : filters);
}

/**
 * Called when SkillVC is looking to register/load the IntentHandlerManager. By default this method uses
 * the {@link IntentHandlerManager} specified by svContext.appConfig.intentHandlerManager.  To have the 
 * IntentHandlerManager by part of the execution cycle the passed in IntentHandlerManager is wrapped
 * by a {@link IntentHandlerFilter}.
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach but will need
 * to take into consideration that SkillVC requires a {@link IntentHandlerFilter} to actually execute
 * 
 * @function
 * @param  {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @param {SkillVC~callback} callback	The callback to use when registration has completed
 */
SkillVC.prototype.registerIntentHandlers = function(svContext, callback) {
	callback.success( new IntentHandlerFilter(svContext.appConfig.intentHandlerManager) );
}

/**
 * Called when SkillVC is looking to register/load the Post Filters.  By default this method uses the
 * @link Filter|Filters} specified by svContext.appConfig.filterManager.post.
 *
 * A new {@link SkillResponseFilter} is added to the end of the chain so that responses from the intents
 * can be transformed into what Lambda will want as a return object
 * 
 * Extending SkillVC and overriding this method will allow for a more customized approach but will need
 * to take into consideration the JSON structure Lambda wants.
 * 
 * @function
 * @param  {SVContext} svContext   	The svContext. As this is called during initialization, not all objects 
 *                                  may be available in the context
 * @param {SkillVC~callback} callback	The callback to use when registration has completed
 */
SkillVC.prototype.registerPostIntentFilters = function(svContext, callback) {
	var filters = [];
	var newFilters = svContext.appConfig.filterManager.post;
	if (newFilters != null && newFilters.length > 0) filters.concat(newFilters);

	// takes everything done by the filters and puts it in the lambda context for handling by Alexa
	filters.push(new SkillResponseFilter());

	callback.success(filters);
}

/**
 * Called when SkillVC is looking to register/load SessionHandlers.  By default this method uses the
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