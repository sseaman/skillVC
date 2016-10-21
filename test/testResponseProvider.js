var path = require('path');
var ResponseProvider = require ('../lib/provider/convention/responseProviderByDirectory.js');

var cp = new ResponseProvider(path.join(process.cwd(), '/testProject/responses'));
var response = cp.getItem('card');
console.log("GC:"+JSON.stringify(response));