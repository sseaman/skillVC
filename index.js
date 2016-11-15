// NPM file for bringing in the Factory from the lib directory

// make the main objects available;
var svc = {
	factory : require('./lib/skillVCFactory.js'),
	tester 	: require('./lib/test/skillTester.js'),
	core 	: require('./lib/skillVC.js'),
	logger	: require('winston-simple')
};

module.exports = svc;