/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var log = require('winston-simple').getLogger('ResponseRendererFilter');

/**
 * Last item in every filter chian as it converts the intent and filter executions
 * into something Lmabda understands
 *
 * @constructor
 * @implements {Filter}
 */
function ResponseRendererFilter() { }

/**
 * Takes the successful response from svContext.session.response and places call
 * svContext.lambda.context.succeed with the response
 * 
 * @function
 * @param  {SVContext} svContext The SVContext to execute with
 */
ResponseRendererFilter.prototype.executePost = function(svContext) {
	log.debug('Successful intent execution returned');
	if (svContext.session.response) {
		log.debug("Response: "+JSON.stringify(svContext.session.response));
		svContext.lambda.context.succeed(svContext.session.response);
	}
	else {
		log.warn('Intent execution (successful) returned null response');
	}
}

/**
 * Takes the unsuccessful response from svContext.session.response and places call
 * svContext.lambda.context.fail with the response
 * 
 * @function
 * @param  {SVContext} svContext The SVContext to execute with
 */
ResponseRendererFilter.prototype.executePostOnError = function(svContext) {
	log.debug("Unsuccessful intent execution returned");
	if (svContext.session.response) {
		log.debug("Response: "+JSON.stringify(svContext.session.response));
		svContext.lambda.context.fail(svContext.session.response);
	}
	else {
		log.warn('Intent execution (unsuccessful) returned null response');
	}
}

module.exports = ResponseRendererFilter;