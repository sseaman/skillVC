var CardBuilder = require('../core-lib/cards/cardBuilder.js');

console.log(new CardBuilder().withJSON({ outputSpeech: { text : "aasaasa" } }).build());