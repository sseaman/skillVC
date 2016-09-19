/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var log = require('../skillVCLogger.js').getLogger('FilterChainExecutor');
var svUtil = require('../util.js');

/**
 * The FilterChainExecutor is the 'engine' of SkillVC in that it controls the execution of
 * all the registered filters (including intent handling which is treated as a filter).
 *
 * This works by invoking the first registered filter, registering itself as the callback
 * listener and then executing the next filter.  
 * 
 * @constructor
 * @see  {@link Filter}
 * @param {Filter} [preFilters]  The pre filters to execute
 * @param {Filter} [postFilters] The post filters to execute
 */
function FilterChainExecutor(preFilters, postFilters) {
	this._pre = preFilters;
	this._post = postFilters;
}

/**
 * Executes the filter chain based on the passed in pre and post filters
 *
 * @function
 * @see  {@link FilterChainExecutor~filterChainCallback}
 * @param  {SVContext} svContext The context to execute with
 */
FilterChainExecutor.prototype.execute = function(svContext) {
	var preIdx = 0;
	var postIdx = 0;

	var fcm = this;
	var filterChainCallback = {
		//TODO: I could store these in more tightly defined maps so I don't have to check if functions exist at time of execution
		success : function() {
			if (preIdx < fcm._pre.length && svUtil.isFunction(fcm._pre[preIdx].executePre)) {
				log.verbose("Executing Pre filter "+fcm._pre[preIdx].constructor.name);
				fcm._pre[preIdx++].executePre(svContext);
			}
			else if (postIdx < fcm._post.length && svUtil.isFunction(cm._post[postIdx].executePost)) {
				log.verbose("Executing Post filter "+fcm._post[postIdx].constructor.name);
				fcm._post[postIdx++].executePost(svContext);
			}
		},
		failure : function() {
			if (preIdx < fcm._pre.length && svUtil.isFunction(fcm._pre[preIdx].executePreOnError)) {
				log.verbose("Executing Pre filter "+fcm._pre[preIdx].constructor.name);
				fcm._pre[preIdx++].executePreOnError(svContext);
			}
			else if (postIdx < fcm._post.length && svUtil.isFunction(cm._post[postIdx].executePostOnError)) {
				log.verbose("Executing Post filter "+fcm._post[postIdx].constructor.name);
				fcm._post[postIdx++].executePostOnError(svContext);
			}
		}
	}

	// Filterchains should use the dedicated filterChainCallback and not the main callback
	svContext.filterChainCallback = filterChainCallback;  // set the callback so the filter chain can continue if callback is called
	
	filterChainCallback.success(); //start things off
}

/**
 * @typedef {Object<string, Function>} FilterChainExecutor~filterChainCallback
 * @property {Function} success Called on the successfull execution of a filter
 * @property {Function} failure Called on the unsuccessfull execution of a filter
 */

module.exports = FilterChainExecutor;