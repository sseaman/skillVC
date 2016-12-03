function IntentHandlerMixed() { 
}

IntentHandlerMixed.prototype = {
	getIntentsList : function() {
		return ['hello'];
	},

	// does an async function to test handling of async processing in an intent
	handleIntent : function(event, context, svContext) {
		console.log("In Hello:");

		setTimeout(function(){
			console.log('TImer out');
			context.succeed(svContext.appConfig.responseManager.render('card'));
		}, 2000);      

	}
};

module.exports = IntentHandlerMixed;