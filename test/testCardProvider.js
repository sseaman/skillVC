var CardProvider = require ('../core-lib/card/provider/cardProviderByDirectory.js');

var cp = new CardProvider('../assets/cards');
var card = cp.getCard('card');
console.log("GC:"+JSON.stringify(card));