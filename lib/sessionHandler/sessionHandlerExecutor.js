/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractPromiseExecutor = require('../executor/abstractPromiseExecutor.js');
var log = require('winston-simple').getLogger('SessionHandlerExecutor');

/**
 * The SessionHandlerExecutor manages the execution of the registered SessionHandlers.  
 *
 * This works by iterating over the list of registered SessionHandlers and, when a `Promise` is discovered, waits
 * until the completion, and then continues over the loop
 * 
 * @constructor
 * @see  {@link SessionHandlerManager}
 * @param {SessionHandler} [startHandlers]  The start SessionHandlers to execute
 * @param {SessionHandler} [endHandlers] The end SessionHandlers to execute
 */
function SessionHandlerExecutor(startHandlers, endHandlers) {
	this._start = startHandlers;
	this._end = endHandlers;
}

SessionHandlerExecutor.prototype = Object.create(AbstractPromiseExecutor.prototype);
SessionHandlerExecutor.prototype.constructor = SessionHandlerExecutor;

/**
 * Executes the start SessionHandlers.  
 *
 * @function
 * @param  {SVContext} svContext The context to execute with
 * @returns {Promise} The `Promise` that can be used to wait until this completes
 */
SessionHandlerExecutor.prototype.executeStart = function(svContext) {
	var she = this; // to control scoping in the promises

	return new Promise(function (resolve, reject) {
		log.info("Starting SessionHandler Execution");
		she._doExecute('sessionStart', she._start, svContext)
			.then(function() {
				log.info("SessionHandler Execution completed");
				resolve();
			})
			.catch(function(err) {
				reject(err);
			});
	});
};


/**
 * Executes the end SessionHandlers
 *
 * @function
 * @param  {SVContext} svContext The context to execute with
 * @returns {Promise} The `Promise` that can be used to wait until this completes
 */
SessionHandlerExecutor.prototype.executeEnd = function(svContext) {
	var she = this; // to control scoping in the promises

	return new Promise(function (resolve, reject) {
		log.info("Starting SessionHandler Execution");
		she._doExecute('sessionEnd', she._start, svContext)
			.then(function() {
				log.info("SessionHandler Execution completed");
				resolve();
			})
			.catch(function(err) {
				reject(err);
			});
	});
};

module.exports = SessionHandlerExecutor;