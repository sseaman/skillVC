/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var deepExtend = require('deep-extend');

/**
 * @typedef {Object.<string:Object>} SkillTester~request
 * @property {Object} request Information on the request to the skill
 * @property {Object} request.intent 
 * @property {String} request.intent.name The name of the intent
 * @property {string} request.requestId The unique Id of the request. Defaults to 'fakeRequestId'
 * @property {string} request.type The type of the request. Defaults to 'IntentRequest'
 * @property {Object} session Information on the session for the skill
 * @property {string} session.application
 * @property {string} session.application.id The Id of the application (as checked in the skill). Defauls to "fakeApplicationId"
 * @property {string} session.sessionId The Id of the session. Defaults to 'fakeSessionId'
 * @property {Object} session.user
 * @property {string} session.user.userId The Id of the user. Defaults to 'fakeUserId'
 * @property {boolean} session.new Is this a new session. Defaults to true
 */
var request = {
	request : {
		intent		: {
			name	: ''
		},
		requestId 	: 'fakeRequestId',
		type		: 'IntentRequest',

	},
	session : {
		application : {
			applicationId	: 'fakeApplicationId'
		},
		sessionId 	: 'fakeSessionId',
		user		: {
			userId 		: 'fakeUserId'
		}, 
		new 		: true
	}
};

/**
 * SkillTester is a simple testing framework for a skill.  It will envoke a skill
 * with a mock request and return the results
 *
 * @example
 * // set where index.js is located
 * var skillTester = new SkillTester('../../index.js');
 * // test the 'hello' intent
 * skillTester.test('hello');
 *  
 * @param {String} index  Location of the index.js for the app
 * @param {Object} [config] Additional configuration options (not yet used)
 *
 * @class
 * @constructor
 */
function SkillTester (index, config) {
	this._index = index;
	this._config = config;
}

/**
 * Tests the specified intent for the skill.  
 *
 * If not requestOptions are specified it will use the default settings in {@link SkillTester~request}
 * 
 * @param  {String}   intent         	The name of the intent to to invoke in the skill
 * @param  {Map}      requestOptions 	A map of the key:values in the request that should be used.  These will override the default values
 * @param  {SkillTester~callback} callback  	The callback to pass the results of the skill execution to     
 * 
 * @see  {@link SkillTester~request}
 * @function
 */
SkillTester.prototype.test = function(intent, requestOptions, callback) {
	var testCallback = (callback) ? callback : this.logCallback();

	this._index.handler(this.buildRequest(intent, requestOptions), testCallback);
};

/**
 * @typedef {Object<string,function>} SkillTester~callback
 * @property {function} success 
 * @property {JSON} 	success.result The results of the successful skill execution
 * @property {function} fail 
 * @property {JSON}   	fail.error The result of an unsuccessful skill execution
 */

/**
 * A default callback that takes the JSON result, stringifies it, and sends it to the console
 *
 * @return {SkillTester~callback} A valid callback for handling skill results
 * 
 * @function
 */
SkillTester.prototype.logCallback = function() {
	return {
		succeed : function(result) {
			console.log("SUCCESS: "+JSON.stringify(result));
		},
		fail: function(error) {
			console.log("FAILURE: "+JSON.stringify(error));
		}
	};
};

/**
 * Builds a valid request JSON obejct for a skill
 *
 * If no options are set the defauls (outlined in the {@link SkillTester#test} function) are used
 *
 * @function
 * @see  {@link SkillTester#test} 
 * @param  {String}  intent 	The name of the intent to execute
 * @param  {Object} 	options  	The values of the request object that should override the default values
 * @return {JSON} The JSON representing the request		
 */
SkillTester.prototype.buildRequest = function(intent, options) {
	var req = deepExtend(request, options); 
	req.request.intent.name = intent;
	return req;
};

module.exports = SkillTester;