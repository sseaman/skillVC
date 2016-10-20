var SkillTester = require('../../lib/test/skillTester.js');

var skillTester = new SkillTester(require('./index.js'));
console.log("Starting at "+ Date.now());
skillTester.test('helloWorldIntent');
console.log("Complete at "+ Date.now());
