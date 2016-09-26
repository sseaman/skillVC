var CardBuilder = require('../lib/cards/cardBuilder.js');

console.log(new CardBuilder().withJSON({ outputSpeech: { text : "aasaasa" } }).build());