function HelloIntentHandler() { 
}

HelloIntentHandler.prototype.getIntentsList = function() {
	return this._intents;
}

HelloIntentHandler.prototype.handleIntent = function(event, context, callback) {
	console.log("In Hello:"+context.skillVCContext.cardManager);

	callback.success(context.skillVCContext.cardManager.getCard('card'));
}

module.exports = HelloIntentHandler;