/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can build a response
 *
 * @interface ResponseBuilder
 */

/**
 * Sets the FormatterManager of the response
 *
 * @function
 * @name  ResponseBuilder#withFormatterManager
 * @param  {FormatterManager} formatterManager The FormatterManager for use with the response
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */

/**
 * Sets the id of the response
 *
 * @function
 * @name  ResponseBuilder#withResponseId
 * @param  {String} responseId The id of the response
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */

/**
 * The passed in JSON will be merged with a response definition 
 *
 * @function
 * @name  ResponseBuilder#withJSON
 * @param  {Object} json JSON that matches the parts of a response definition that is to be set
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */

/**
 * The passed in String will converted to JSON and merged with a response definition 
 *
 * @function
 * @name  ResponseBuilder#withString
 * @param  {String} string String that when converted to JSON matches the parts of a response definition that is to be set
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */

/**
 * Builds the final response based on all of the mergining
 *
 * @function
 * @name ResponseBuilder#build
 * @return {Object} JSON that represents the response
 */
