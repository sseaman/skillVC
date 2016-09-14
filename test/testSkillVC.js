var SkillVC = require('../core-lib/skillVC.js');
var SkillTester = require('./framework/skillTester.js');

var skillTester = new SkillTester('../../index.js');
console.log("Starting at "+ Date.now());
skillTester.test('hello');
console.log("Complete at "+ Date.now());

// not exiting.. find out why..
// process._getActiveHandles();
// process._getActiveRequests();
// 
// console.log("CM:"+skillVC.getContext().cardManager);
// console.log("Card:"+skillVC.getContext().cardManager.getCard('card').getId());
// console.log("Card JSON:"+JSON.stringify(skillVC.getContext().cardManager.getCard('card').getRawJSON()));

