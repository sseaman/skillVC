var svUtil = require('../util.js');
var log = require('winston-simple').getLogger('FilterChainPromiseExecutor');


// CHANGE to abstract so session can also use it...
// INTENT HANDLER needs to use promises as well
function FilterChainPromiseExecutor(preFilters, postFilters) {
	this._pre = preFilters;
	this._post = postFilters;
}

FilterChainPromiseExecutor.prototype.execute = function(svContext) {
	var fcm = this; // to control scoping in the promises

	log.debug("Starting Filter Chain Execution");
	fcm._doExecute('Pre', fcm._pre, svContext)
		.then(fcm._doExecute.bind(this, 'Post', fcm._post, svContext)) // use bind so I don't have to wrap with function()
		.then(function() {log.debug("Filter Chain Execution completed")});
};

/**
 * I need to document the shit out of this
 * @param  {[type]} type      [description]
 * @param  {[type]} items     [description]
 * @param  {[type]} svContext [description]
 * @return {[type]}           [description]
 */
FilterChainPromiseExecutor.prototype._doExecute = function(type, items, svContext) {
	return new Promise(function(topResolve, topReject) {
		// these control the loop for each item loop (related to type)
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
				if (svUtil.isFunction(items[idx]['execute'+type])) {
					log.verbose('Executing type '+type+' for '+items[idx].getName());

					try {
						// execute the filter
						var exeResult = items[idx++]['execute'+type](svContext.lambda.event, svContext.lambda.context, svContext);
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
						// it's using old code (success / failure) and should still be handled
						// FIXME: Needs to support failure as well as Async
						if (e.message == "Cannot read property 'success' of undefined") {
							log.warn(items[idx].getName()+" is using legacy callback method 'success'");
							// it's actually good, just old code, so keep going
							pathToFollow();
						}
						// Something went wrong
						else {
							log.error('Error executing '+items[idx].getName()+'. '+e.message);
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
		}

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

module.exports = FilterChainPromiseExecutor;