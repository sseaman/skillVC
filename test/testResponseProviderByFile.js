var ResponseProvider = require ('../lib/provider/convention/responseProviderByDirectory.js');

var cp = new ResponseProvider('./testProject/responses');
var response = cp.getItem('card');
cp.getItem('card copy');
console.log("GC:"+JSON.stringify(response));