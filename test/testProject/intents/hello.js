function HelloIntentHandler() { 
}

HelloIntentHandler.prototype.getIntentsList = function() {
	return ['hello'];
};

HelloIntentHandler.prototype.handleIntent = function(event, context, svContext) {
	console.log("In Hello:");

	context.succeed(svContext.appConfig.responseManager.getResponse('card').renderTell());
};

module.exports = HelloIntentHandler;