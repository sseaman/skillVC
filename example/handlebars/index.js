/**
 * Test index.js for use with testHandlebars.js
 */
var skillVC = require('../../index.js').factory.createfromDirectory();

exports.handler = function(event, context) {
	skillVC.handler(event, context);
}
