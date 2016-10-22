/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

module.exports = {

	/**
	 * Builds a response that has no session information
	 *
	 * @function
	 * @static
	 * @param  {Response} response The Response to use
	 * @return {JSON} A response for the context to use in it's success / failure messaging
	 */
	tell : function(response) {
		return this.buildResponse({}, response);
	},

	/**
	 * Builds a response that has session information
	 *
	 * @function
	 * @static
	 * @param {Object} sessionAttributes Map of sessionAttributes
	 * @param  {Response} response The Response to use
	 * @return {JSON} A response for the context to use in it's success / failure messaging
	 */
	ask : function(sessionAttributes, response) {
		return this.buildResponse(sessionAttributes, response);
	},

	/**
	 * Builds a skill response 
	 *
	 * @function
	 * @static
	 * @param  {Object} sessionAttributes Map of sessionAttributes
	 * @param  {SpeechletResponse} speechletResponse The speechletResponse
	 * @return {JSON} A response for the context to use in it's success / failure messaging
	 */
	buildResponse : function(sessionAttributes, speechletResponse) {
		return {
			version: "1.0",
			sessionAttributes: sessionAttributes,
			response: (!speechletResponse) ? {} : speechletResponse
		};
	}
	
};