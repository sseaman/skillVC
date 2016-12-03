/*
 The current version of SkillVC requires all javascript (filters, intents, and sessionHandlers)
 to be Objects that can be instantiated.
 This restriction will be removed in later versions
 */

/** @private */
var NumberFormatter = require('./numberFormatter.js');

/**
 * @constructor
 * @implements {IntentHandler}
 */
function RandomNumberIntent() {
	this.initialized = false;
}

/**
 * I want to name the file lowercase randomNameIntent but the intent is defined as RandomNumberIntent, so 
 * I specify the intents that this object can handle in this method
 *
 * @function
 * @return {[String]} The intents that this object can handle
 */
RandomNumberIntent.prototype.getIntentsList = function() {
	return ['RandomNumberIntent'];
};

/**
 * This will handle the random number intent and pass the value of the random number into the response.
 *
 * As this also registered a formatter, and the response uses 'numberFormat', the number will be formatted
 * as it is processed.
 *
 * JSON:
 * {
	 *	"outputSpeech": {
 *		"text": "Your random number is {{numberFormat randomNum}}!"
 *  }
 * }
 *
 * The numberFormat specifies the formatter to use
 * The randomNum is the variable placeholder that will be replaced but the number we pass in
 *
 * @function
 * @param {Object} event The event for the skill (from lambda)
 * @param {OBject} context The context for the skill (from lambda)
 * @param {SVContext} svContext The context of the execution
 */
RandomNumberIntent.prototype.handleIntent = function(event, context, svContext) {
	// to make it simple, we'll check things here to ensure we don't register it twice
	if (!this.initialized) {
		svContext.appConfig.responseManager.get('randomNumber').getFormatterManager().addFormatters(
			{'numberFormat' : new NumberFormatter()}
		);
		this.initialized = true;
	}

	// pass the randomNum into the response which will use Handlebars and the formatter specified to render the response
	context.succeed(svContext.appConfig.responseManager.render('randomNumber',
		{
			'randomNum' : (Math.random() * (10 - 1) + 1)
		}
	));
};

module.exports = RandomNumberIntent;