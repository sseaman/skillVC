function HelloIntentHandler() { 
}

HelloIntentHandler.prototype.getIntentsList = function() {
	return ['hello'];
}

HelloIntentHandler.prototype.handleIntent = function(svContext) {
	console.log("In Hello:");

	svContext.callback.success(svContext.appConfig.responseManager.getResponse('card').renderTell());
}

module.exports = HelloIntentHandler;