var fs = require('fs');
var path = require('path');
var cmd = require('commander');

function RequireTest() {}

/**
 * Runs through all of the defined files and executes a ```require()``` on them to ensure
 * they 'compile' correctly and resolve all of their dependencies
 * 
 * Wrote this while npm was down from a DDOS on 10/21/2016.  
 */
RequireTest.prototype = {
	
	compile : function(dirToScan, filterList, options) {
		var dir = (dirToScan) ? dirToScan : '.';
		dir = path.normalize(dir);

		var filters = (filterList) ? filterList : ['.js'];
		var log = console.log;

		if (options.log_level) {
			var winstonS = require('winston-simple');
			winstonS.setLevels({'all' : options.log_level});
		}

		var files = this.getFiles(dir, filters, options);
		for (var i=0;i<files.length;i++) {
			try {
				process.stdout.write('Checking '+files[i]+' ...');
				process.chdir(path.dirname(files[i]));
				if (options.no_console) console.log = function() {}; // suppress console

				require (files[i]);

				if (options.no_console) console.log = log;
				process.stdout.write(' SUCCESS\n');
			}
			catch (e) {
				process.stdout.write(' ERROR \n\t'+e.stack+'\n');
			}
		}
	},

	getFiles : function(dir, filters, options) {
		return (function walkSync(dir, fileList) {
			var files = fs.readdirSync(dir);
			fileList = fileList || [];
			files.forEach(function(file) {
				if (fs.statSync(path.join(dir, file)).isDirectory()) {
					if (!(options.skip_dirs.indexOf(path.basename(file)) >= 0)) {
						fileList = walkSync(path.join(dir, file), fileList);
					}
				}
				else {
					if ((path.parse(file).base !== 'compileTest.js') // don't load myself
						&& (!filters || filters.indexOf(path.extname(file)) >= 0) )
					{
						fileList.push(path.resolve(dir,file));
					}
				}
			});
			return fileList;
		})(dir, null);
	}

};

module.exports = RequireTest;

/***************************
* Cmd / main code
****************************/
// node compileTest.js compile .. --skip_dirs docs,node_modules --no_console

cmd.version('0.2.0');

cmd
	.command('run <dir> [filterList]')
	.alias('r')
	.description('Does require on every .js object to check for issues')
	.option('-nc, --no_console', 'Disable any console output when compiling each javascript file')
	.option('-sd, --skip_dirs <items>', 'List of directories to not scan', function(val) { return val.split(','); } )
	.option('-ll, --log_level <level>', 'Set the log level of all the objects that will be compiled')
	.action(function(dir, filterList, options) {
		var rt = new RequireTest();
		rt.compile(dir, filterList, options);
	})
	.on('--help', function() {
		console.log('  Examples:\n'
			+'    node requireTest.js run\n'
			+'    node requireTest.js run --skip_dirs test,docs,node_modules // do not check those directories\n'
			+'    node requireTest.js run --log_level none // Disable winston logging (uses winston-simple)\n'
			+'    node requireTest.js run --no_console // turn off all console logging from the code that is being checked\n'
			+ '\n');
	});

cmd.parse(process.argv);

if (!cmd.args.length) cmd.help();
