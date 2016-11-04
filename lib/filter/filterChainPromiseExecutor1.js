var svUtil = require('../util.js');
var log = require('winston-simple').getLogger('FilterChainPromiseExecutor');


// CHANGE to abstract so session can also use it...
// INTENT HANDLER needs to use promises as well
// NEED TO DO REJECT
function FilterChainPromiseExecutor(preFilters, postFilters) {
	this._pre = preFilters;
	this._post = postFilters;
}

FilterChainPromiseExecutor.prototype.execute = function(svContext) {
	var fcm = this; // to control scoping in the promises

	fcm._doExecute('Pre', fcm._pre, svContext)
		.then(fcm._doExecute.bind(this, 'Post', fcm._post, svContext)) // use bind so I don't have to wrap with function()
		.then(function() {log.debug("Execution completed")});
};

FilterChainPromiseExecutor.prototype._doExecute = function(type, items, svContext) {
	return new Promise(function(topResolve, topReject) {
		var itemLength = items.length;
		var idx = 0;

		var promiseFunctions = {
			resolve () {
				if (idx < itemLength) {
					if (svUtil.isFunction(items[idx]['execute'+type])) {
						log.verbose('Executing '+type+' filter '+items[idx].getName());

						try {
							var exeResult = items[idx++]['execute'+type](svContext.lambda.event, svContext.lambda.context, svContext);
							if (!exeResult || (!(exeResult && exeResult.then))) {
								promiseFunctions.resolve(); // wasn't a promise, just keep going
							}
							else {
								exeResult.then(promiseFunctions.resolve, promiseFunctions.reject);
							}
						}
						catch (e) {
							if (e.message == "Cannot read property 'success' of undefined") {
								// it's actually good, just old code, so keep going
								log.warn("Filter is using legacy callback method 'success'");
								promiseFunctions.resolve();
							}
							else {
								log.error('Error executing filter. '+e.message);
							}
						}
					}
					else { // skip
						idx ++;
						promiseFunctions.resolve();
					}
				}
				else { // all done, exit out
					topResolve();
				}
			},
			reject : function() {
				// if (idx < itemLength) {
				// 	if (svUtil.isFunction(items[idx]['execute'+type+'OnError'])) {
				// 		log.verbose('Executing '+type+' filter '+items[idx].getName());

				// 		var exeResult = items[idx++]['execute'+type+'OnError'](svContext.lambda.event, svContext.lambda.context, svContext);
				// 		if (exeResult && exeResult.then) exeResult.then(promiseFunctions.resolve, promiseFunctions.reject);
				// 		else promiseFunctions.reject(); // not a promise
				// 	}
				// 	else { // skip
				// 		idx ++;
				// 		promiseFunctions.reject();
				// 	}
				// }
				// else {
				// 	// all done, exit out
				// 	topReject();
				// }
			}
		};

		// start things off
		promiseFunctions.resolve();
	});
};

module.exports = FilterChainPromiseExecutor;