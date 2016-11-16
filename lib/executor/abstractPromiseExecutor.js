/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var svUtil = require('../util.js');
var log = require('winston-simple').getLogger('PromiseExecutor');

/**
 * The AbstractPromiseExceutor will execute a list of internal items taking into consideration async processing
 * in each item and awaiting for their completion via the `Promise`s they return
 * 
 * @constructor
 */
function AbstractPromiseExecutor() {}

/**
 * Start the execution
 * 
 * @function
 * @abstract
 * @param  {SVContext} svContext The SVContext to use for execution
 */
AbstractPromiseExecutor.prototype.execute = function(svContext) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	throw new Error('Must be implemented by subclass');
};

/**
 * Method that actually does the execution of the items.
 *
 * If the item in the list does not return a `Promise`, this treats the call as sync and goes to the next item.
 * If the item in the list uses the deprecated `callback.success()` or `callback.failure()`, it treats the call
 * as sync as well.
 * Only a `Promise` is treated as async and everything waits until its completion
 * 
 * @param  {String} method    The function to execute on the item
 * @param  {Object} items     The items to iterate through
 * @param  {SVContext} svContext The SVContex to use when calling the methods.
 * @return {Promise}          The Promise that will have its `then` called when everything has completed
 */
AbstractPromiseExecutor.prototype._doExecute = function(method, items, svContext) {
	return new Promise(function(topResolve, topReject) {
		// these control the loop for each item loop (related to method)
		var itemLength = items.length;
		var idx = 0;

		/**
		 * Function that actually can handle the looping through resolve and rejects
		 * 
		 * @anonymous
		 * @param {Function} rootOut The main promises function to call when everything is done and we want to report as such
		 * @param {Function} parentResolve The resolve method to call when we want to go to the next successful (resolve)
		 *        iteration of the loop
		 * @param {Function} parentReject The reject method to call when we want to go to the next unsuccessful (reject)
		 *        iteration of the loop
		 * @param {Function} pathToFollow The method (resolve or reject) that represents the current path we are executing down
		 *        and should be called next
		 */
		var promiseHandler = function(rootOut, parentResolve, parentReject, pathToFollow) {
			if (idx < itemLength) {
				if (svUtil.isFunction(items[idx][method])) {
					log.info('Executing '+method+' for '+items[idx].getName());

					try {
						// execute the filter
						var exeResult = items[idx++][method](svContext.lambda.event, svContext.lambda.context, svContext);
						// result wasn't a promise,  so it wasn't async and we should just go to the next one
						if (!exeResult || (!(exeResult && exeResult.then))) {
							pathToFollow(); 
						}
						// It was a promise, go to the next loop iteration when done (by calling back to the correct path)
						else {
							exeResult.then(parentResolve, parentReject); // note that these are reference to function and not execution (no ())
						}
					}
					catch (e) {
						var oldIdx = idx - 1;
						// it's using old code (success / failure) and should still be handled
						if ((e.message === "Cannot read property 'success' of undefined") ||
							(e.message === "Cannot read property 'failure' of undefined")) 
						{
							log.warn(items[oldIdx].getName()+" is using legacy callback method 'success'");
							// it's actually good, just old code, so keep going
							pathToFollow();
						}
						// Something went wrong
						else {
							log.error('Error executing '+items[oldIdx].getName()+'. '+e.message);
						}
					}
				}
				// don't have the function signature we are looking for, skip
				else {
					idx ++;
					pathToFollow();
				}
			}
			// out of things to do, call the rootOut to tell the main promise we are done
			else { 
				rootOut();
			}
		};

		// Holds the resolve and reject promises that can be called for each iteration of the loop.
		// Needs to be a variable so it can be references multiple times
		var promiseFunctions = {
			resolve () {
				promiseHandler(topResolve, promiseFunctions.resolve, promiseFunctions.reject, promiseFunctions.resolve);
			},
			reject : function() {
				promiseHandler(topReject, promiseFunctions.resolve, promiseFunctions.reject, promiseFunctions.reject);
			}
		};

		// start things off
		promiseFunctions.resolve();
	});
};

module.exports = AbstractPromiseExecutor;