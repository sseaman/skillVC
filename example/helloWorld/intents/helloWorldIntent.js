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
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */
helloWorldIntents.prototype.handleIntent = function(event, context, svContext) {
	/*
	This intent gets the helloWorld response (defined in helloWorld.js) and renders a tell() with it.  
	A tell() is a response to Alexa that does not have a followup question.
	 */
	context.succeed(svContext.appConfig.responseManager.render('helloWorld'));
};

module.exports = helloWorldIntents;