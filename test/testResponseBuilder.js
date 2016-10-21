var ResponseBuilder = require('../lib/response/defaultResponseBuilder.js');

console.log(new ResponseBuilder().withJSON({ outputSpeech: { text : "aasaasa" } }).build());