var SkillTester = require('../lib/test/skillTester.js');

var skillTester = new SkillTester(require('./index-FactoryFromDirectory.js'));
console.log("Starting at "+ Date.now());
skillTester.test('hello');
console.log("Complete at "+ Date.now());
