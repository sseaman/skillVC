/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
module.exports = {

	/**
	 * Executed after all intents complete and adds any session attributes to the actual response sessionAttributes value
	 *
	 * Note: Only works on the ContextWrapper object (the wrapped context object SkillVC provides to all objects)
	 *
	 * To use in code create a filter and import the helper
	 * ```
	 * var sessionAttributesHelper = require ('./skillvc/lib/helper/sessionAttiributesFilter.js');
	 * ```
	 *
	 * Next, in the filters `executePost` add
	 * ```
	 * sessionAttributesHelper.setSessionAttributes(event, context);
	 *
	 * @function
	 * @param {Object} event The event for the skill (from lambda)
	 * @param {OBject} context The context for the skill (from lambda)
	 */
	setSessionAttributes : function(event, context) {
		if (event.session.attributes && context.constructor && context.constructor.name === "ContextWrapper") {
			context.getResponse().sessionAttributes = event.session.attributes;
		}
	}

};