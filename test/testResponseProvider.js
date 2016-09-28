var ResponseProvider = require ('../lib/response/provider/responseProviderByDirectory.js');

var cp = new ResponseProvider('../assets/responses');
var response = cp.getResponse('response');
console.log("GC:"+JSON.stringify(response));