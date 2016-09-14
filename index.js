var skillVC = new (require('./core-lib/skillVC.js'));

exports.handler = function(event, context) {
	skillVC.handler(event, context);
}