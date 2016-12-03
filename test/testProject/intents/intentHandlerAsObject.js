function HelloIntentHandler() { 
}

HelloIntentHandler.prototype.getIntentsList = function() {
	return ['hello3'];
};

HelloIntentHandler.prototype.handleIntent = function(event, context, svContext) {
	console.log("In Hello:");

	context.succeed(svContext.appConfig.responseManager.render('card'));
};

module.exports = HelloIntentHandler;