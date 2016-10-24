/**
 * Simple tester for testing the handlebars functionality of SkillVC
 * @type {[type]}
 */
var SkillTester = require('../../lib/test/skillTester.js');
require('winston-simple').setLevels({'all':'debug'});

var skillTester = new SkillTester(require('./index.js'));
console.log("Starting at "+ Date.now());
skillTester.test('RandomNumberIntent');
console.log("Complete at "+ Date.now());
