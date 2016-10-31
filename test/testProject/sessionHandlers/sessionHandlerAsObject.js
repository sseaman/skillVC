function ObjectSessionHandler() {}

ObjectSessionHandler.prototype.sessionStart = function(event, context, svContext) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	console.log('Start');
};

ObjectSessionHandler.prototype.sessionEnd = function(event, context, svContext) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	console.log('End');
};

module.exports = ObjectSessionHandler;