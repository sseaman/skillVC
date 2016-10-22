/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var Response = require('./response.js');
var deepExtend = require('deep-extend');

var responseFormat = {
    outputSpeech: {
        type: 'PlainText',
        text: ''
    },
    card: {
        type: 'Simple',
        title: '',
        content: ''
    },
    reprompt: {
        outputSpeech: {
            type: 'PlainText',
            text: ''
        }
    },
    shouldEndSession: true
};

/**
 * Builder to build a response 
 *
 * Allows only the sections of the response that you care about to be set and provides defaults for everything else
 *
 * @constructor
 * @implements {ResponseBuilder}
 */
function DefaultResponseBuilder() {
    this._responseJSON = '';
    this._responseFormatterManager = null;
    this._responseId = null;
}

/**
 * Sets the FormatterManager of the response
 *
 * @function
 * @param  {FormatterManager} formatterManager The FormatterManager for use with the response
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */
DefaultResponseBuilder.prototype.withFormatterManager = function(formatterManager) {
    this._responseFormatterManager = formatterManager;
    return this;
};

/**
 * Sets the id of the response
 *
 * @function
 * @param  {String} responseId The id of the response
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */
DefaultResponseBuilder.prototype.withResponseId = function(responseId) {
    this._responseId = responseId;
    return this;
};

/**
 * The passed in JSON will be merged with a response definition 
 *
 * @function
 * @param  {JSON} json JSON that matches the parts of a response definition that is to be set
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */
DefaultResponseBuilder.prototype.withJSON = function(json) {
	this._responseJSON = deepExtend(responseFormat, json);
	return this;
};

/**
 * The passed in String will converted to JSON and merged with a response definition 
 *
 * @function
 * @param  {String} string String that when converted to JSON matches the parts of a response definition that is to be set
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */
DefaultResponseBuilder.prototype.withString = function(string) {
	this._responseJSON = deepExtend(responseFormat, JSON.parse(string));
	return this;
};

/**
 * Builds the final response based on all of the mergining
 *
 * @function
 * @return {Response} The response
 */
DefaultResponseBuilder.prototype.build = function() {
	return new Response(this._responseId, this._responseJSON, this._responseFormatterManager);
};

module.exports = DefaultResponseBuilder;