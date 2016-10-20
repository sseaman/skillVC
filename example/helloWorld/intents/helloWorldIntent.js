/*
 By naming this the same as the intent in the intent.json file, it is not required to define the intents
 handled in the code itself.

 The current version of SkillVC requires all javascript (filters, intents, and sessionHandlers)
 to be Objects that can be instantiated.
 This restriction will be removed in later versions
 */

/**
 * @constructor
 * @implements {IntentHandler}
 */
function helloWorldIntents() {}

/**
 * @function
 */
helloWorldIntents.prototype.handleIntent = function(svContext) {
	/*
	All intents must use the svContext.callback to return their response.  Either a success() or failure() 
	is required.

	This intent gets the helloWorld response (defined in helloWorld.js) and renders a tell() with it.  
	A tell() is a response to Alexa that does not have a followup question.
	 */
	svContext.callback.success(svContext.appConfig.responseManager.getResponse('helloWorld').renderTell());
}

module.exports = helloWorldIntents;