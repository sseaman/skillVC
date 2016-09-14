var CardManagerFactory = require('./card/cardManagerFactory.js');
var FilterChainManager = require('./filter/filterChainManager.js');
var FilterManagerFactory = require('./filter/FilterManagerFactory.js');
var IntentHandlerFilter = require('./filter/intentHandlerFilter.js');
var SkillResponseFilter = require('./filter/skillResponseFilter.js');
var IntentHandlerManagerFactory = require('./intentHandler/intentHandlerManagerFactory.js');
var log = require('./skillVCLogger.js').getLogger('SkillVC');
var svUtil = require('./util.js');
var fs = require('fs');

// Here for future use
const defaultConfig = {
	applicationId	: null,
	cardManager	: null,
	filterManager : {
		pre	: null,
		post: null
	},
	intentHandlerManager : null
};

function SkillVC(config) {
	// main context object for the whole system
	this._skillVCContext = {};
	this._skillVCContext.appConfig = (config != null)
		? svUtil.merge(defaultConfig, config) // FIXME: Should be a deepExtend or it wont' get the pre / post
		: defaultConfig;

	this._initialized = false;
}

SkillVC.prototype.init = function(event, context, initCallback) {
	if (this.initialized) return;  // nothing to do, pop out

	log.verbose("Initializing...");

	// make things available to anyone
	this._skillVCContext.cardManager = this.registerCardManager(event, context);
	this._skillVCContext.filterChainManager = new FilterChainManager();

	context.skillVCContext = this._skillVCContext; // make the internal contect available to everything downstream

	var sv = this;
	// might be a way to do this with promises, but I'm not going to put the time into it yet
	log.verbose("Registering PreIntent Filters");
	sv.registerPreIntentFilters(event, context, {
		success : function(preIHandlers) {
			sv._skillVCContext.filterChainManager.addFilters(preIHandlers);

			log.verbose("Registering Intent Handlers");
			sv.registerIntentHandlers(event, context, {
				success : function(iHandlers) {
					sv._skillVCContext.filterChainManager.addFilters(iHandlers);

					log.verbose("Registering PostIntent Filters");
					sv.registerPostIntentFilters(event, context, {
						success : function(postIHandlers) {
							sv._skillVCContext.filterChainManager.addFilters(postIHandlers);
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

SkillVC.prototype.handler = function (event, context)  {
	log.verbose("Handler invoked");

    try {
    	if (this._skillVCContext.appId && (event.session.application.applicationId != this._skillVCContext.appId)) {
        	throw new Error("Invalid Application ID");
        }

        var sv = this;
    	sv.init(event, context, {
    		success : function() {
    			// the context for use in the filter
    			// TODO: Rethink this
    			context.skillVCContext = sv._skillVCContext; // make the internal contect available to everything downstream
    			 
    			var filterContext = {
					skillEvent : event,
					skillContext : context,
					filterSession : {},
					filterCallback : null
				}

				if (event.session.new) {
		        //	handlers.sessionStart(event);
		    	}

		        if (event.request.type === "LaunchRequest") {
		        //	handlers.launchRequest(event, context);
		        } else if (event.request.type === "IntentRequest") {
		        	sv._skillVCContext.filterChainManager.execute(filterContext);
		        } else if (event.request.type === "SessionEndedRequest") {
		        //   	handlers.sessionEnd(event, context);
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

SkillVC.prototype.registerCardManager = function(event, context) {
	return (this._skillVCContext.appConfig.cardManager != null)
		? this._skillVCContext.appConfig.cardManager 
		: CardManagerFactory.createHandlebarEnabledByDirectory('../assets/cards');
}

SkillVC.prototype.registerPreIntentFilters = function(event, context, callback) {
	var filters = (this._skillVCContext.appConfig.filterManager.pre != null)
			? this._skillVCContext.appConfig.filterManager.pre
			: FilterManagerFactory.create([]);
	callback.success( (filters == null || filters.length == 0) ? [] : filters);
}

SkillVC.prototype.registerIntentHandlers = function(event, context, callback) {
	callback.success( new IntentHandlerFilter(
		(this._skillVCContext.appConfig.intentHandlerManager != null)
			? this._skillVCContext.appConfig.intentHandlerManager
			: IntentHandlerManagerFactory.createByDirectory('../assets/intents')
		)
	);
}

SkillVC.prototype.registerPostIntentFilters = function(event, context, callback) {
	var filters = [];
	var newFilters = (this._skillVCContext.appConfig.filterManager.post != null)
			? this._skillVCContext.appConfig.filterManager.post
			: FilterManagerFactory.create([]);
	if (newFilters != null && newFilters.length > 0) filters.push(newFilters);

	// takes everything done by the filters and puts it in the lambda context for handling by Alexa
	filters.push(new SkillResponseFilter());

	callback.success(filters);
}

SkillVC.prototype.getContext = function() {
	return this._skillVCContext;
}

module.exports = SkillVC;