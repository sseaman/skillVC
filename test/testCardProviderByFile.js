var CardProvider = require ('../lib/cards/cardProviderByFile.js');

var cp = new CardProvider('../assets/card.json');
var card = cp.getCard('card');
cp.getCard('billy');
cp.getCard('xxx');
cp.getCard('card');
console.log("GC:"+JSON.stringify(card));