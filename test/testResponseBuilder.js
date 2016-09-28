var ResponseBuilder = require('../lib/responses/responseBuilder.js');

console.log(new ResponseBuilder().withJSON({ outputSpeech: { text : "aasaasa" } }).build());