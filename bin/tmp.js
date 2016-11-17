'use strict';

var cmd = require('commander');
var fs = require('fs');
var path = require('path');
var cmdDir = '../lib/commands';

cmd.version('0.2.0');

var files = fs.readdirSync(cmdDir);
for (let i=0;i<files.length;i++) {
	require(path.join(cmdDir, files[i]))(cmd);
}

cmd.parse(process.argv);
