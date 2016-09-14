var SkillTester = require('./framework/skillTester.js');

var skillTester = new SkillTester('../../index.js');
console.log("Starting at "+ Date.now());
skillTester.test('hello');
console.log("Complete at "+ Date.now());
