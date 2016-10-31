module.exports = {
	getIntentsList : function() {
		return ['hello2'];
	},

	handleIntent : function(event, context, svContext) {
		console.log("In Hello:");

		context.succeed(svContext.appConfig.responseManager.getResponse('card').renderTell());
	}
};