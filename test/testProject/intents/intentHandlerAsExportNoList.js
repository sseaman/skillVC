// Should register under its filename
module.exports = {

	handleIntent : function(event, context, svContext) {
		console.log("In Hello:");

		context.succeed(svContext.appConfig.responseManager.getResponse('card').renderTell());
	}
};