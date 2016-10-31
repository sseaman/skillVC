function IntentHandlerMixed() { 
}

IntentHandlerMixed.prototype = {
	getIntentsList : function() {
		return ['hello'];
	},

	handleIntent : function(event, context, svContext) {
		console.log("In Hello:");

		context.succeed(svContext.appConfig.responseManager.getResponse('card').renderTell());
	}
};

module.exports = IntentHandlerMixed;