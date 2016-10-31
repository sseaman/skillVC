var SkillTester = require('../lib/test/skillTester.js');
require('winston-simple').setLevels({'all' : 'debug'});

var skillTester = new SkillTester(require('./testProject/index-FactoryFromDirectory.js'));
console.log("Starting at "+ Date.now());
skillTester.test('hello');
console.log("Complete at "+ Date.now());
