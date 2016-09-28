var ResponseProvider = require ('../lib/responses/responseProviderByFile.js');

var cp = new ResponseProvider('../assets/response.json');
var response = cp.getResponse('response');
cp.getResponse('billy');
cp.getResponse('xxx');
cp.getResponse('response');
console.log("GC:"+JSON.stringify(response));