/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var svUtil = require('../util.js');

/**
 * The SessionHandlerExecutor manages the execution of the registered SessionHandlers.  
 *
 * This uses an async supporting loop to execute each SessionHandler and does not
 * expect a callback or return object.  
 *
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

/**
 * Executes the start SessionHandlers
 *
 * @function
 * @see  {@link Util#asyncLoop}
 * @param  {SVContext} svContext The context to execute with
 */
SessionHandlerExecutor.prototype.executeStart = function(svContext) {
	var startIdx = 0;

	svUtil.asyncLoop(
		this._start.length, 
		function(loop) {
			this._start[startIdx++].sessionStart(svContext);
			loop.next();
		}
	),
	function() {};
};

/**
 * Executes the end SessionHandlers
 *
 * @function
 * @see  {@link Util#asyncLoop}
 * @param  {SVContext} svContext The context to execute with
 */
SessionHandlerExecutor.prototype.executeEnd = function(svContext) {
	var endIdx = 0;

	svUtil.asyncLoop(
		this._end.length, 
		function(loop) {
			this._end[endIdx++].sessionEnd(svContext);
			loop.next();
		}
	),
	function() {};
};

module.exports = SessionHandlerExecutor;