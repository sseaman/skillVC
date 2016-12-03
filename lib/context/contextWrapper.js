
/**
 * Wraps the lambda context object so that calls to succeed and fail to not directly fire
 * but are delayed until later (when all post filters have completed)
 * 
 * @constructor
 * @param {Object} lambdaContext The lambda skill context object
 * @param {Object} succeedCallback The function to fire once succeed() is called
 * @param {Object} failCallback The function to fire once fail() is called
 */
function ContextWrapper(lambdaContext, succeedCallback, failCallback) {
	this._succeedCallback = succeedCallback;
	this._failCallback = failCallback;
	this._context = lambdaContext;
	this._succeed = lambdaContext.succeed; // store the function
	this._fail = lambdaContext.fail; // store the function;

	this._resSucceed = null;
	this._resFail = null;
	this._didSucceed = false;
}

/**
 * Overrides the lambda context succeed function 
 * 
 * @override
 * @param  {String} response The skill response to return
 */
ContextWrapper.prototype.succeed = function(response) {
	this._didSucceed = true;
	this._resSucceed = response;
	this._succeedCallback(); // continue the chain
};

/**
 * Overrides the lambda context fail function 
 * 
 * @override
 * @param  {String} response The skill response to return
 */
ContextWrapper.prototype.fail = function(response) {
	this._didSucceed = false;
	this._resFail = response;
	this._failCallback(); // continue the chain
};

/**
 * Returns the context that is being wrapped
 * 
 * @function
 * @return {Object} The context that is being wrapped
 */
ContextWrapper.prototype.getWrappedContext = function() {
	return this._context;
};

/**
 * Returns true if the type of response was of type succeed()
 * 
 * @return {Boolean} True if succeed was called
 */
ContextWrapper.prototype.isSucceed = function() {
	return (this._didSucceed);
};

/**
 * Returns true if succeed() or fail() was called.  Useful for knowing if an intentHandler actually did anything
 * 
 * @return {Boolean} true if succeed() or fail() was called
 */
ContextWrapper.prototype.responseOccurred = function() {
	return (this._resSucceed || this._resFail);
};

/**
 * Returns the response that was sent by the intent handler
 *
 * @return {String} [he skill response
 */
ContextWrapper.prototype.getResponse = function() {
	return (this._resSucceed) ? this._resSucceed : this._resFail;
};


module.exports = ContextWrapper;