
/**
 * Wraps the lambda context object so that calls to succeed and fail to not directly fire
 * but are delayed until later (when all post filters have completed)
 * 
 * @constructor
 * @param {Object} lambdaContext The lambda skill context object
 * @param {Object} callback The to fire once succeed() or fail() is called
 */
function ContextWrapper(lambdaContext, callback) {
	this._callback = callback;
	this._context = lambdaContext;
	this._succeed = lambdaContext.succeed; // store the function
	this._fail = lambdaContext.fail; // store the function;

	this._resSucceed = null;
	this._resFail = null;
}

/**
 * Overrides the lambda context succeed function 
 * 
 * @override
 * @param  {String} response The skill response to return
 */
ContextWrapper.prototype.succeed = function(response) {
	this._resSucceed = response;
	this._callback.success(); // continue the chain
};

/**
 * Overrides the lambda context fail function 
 * 
 * @override
 * @param  {String} response The skill response to return
 */
ContextWrapper.prototype.fail = function(response) {
	this._resFail = response;
	this._callback.failure(); // continue the chain
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
	return (this._resSucceed);
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