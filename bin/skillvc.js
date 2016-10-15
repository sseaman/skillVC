/*
-- build
	reads from the intents and creates intent handlers for each intent in /intents


-- plugin
	installs a plugin
	a plugin is any node_modules that has node_modules/moduleName/skillvc.json
	skillvc.json = {
		filters : []

		],
		intentHandlers : []

		]
		// and so on 
		// but also:
		executor : ""
		// which is an object that will be run when the plugin is installed to do
		// whatever else the plugin owner wants to do
	}
	skillvc (bin) will read the json, run executor.preInstall, install everything where it should be 
		filters in /filters, etc... and then run executor.postInstall

*/

var cmd = require('commander');
var fs = require('fs');
var path = require('path');
var svUtil = require('../lib/util.js');

var initHandler = {
	handle : function(dir, options) {
		var dirPath = path.normalize(dir) + path.sep;

		if (!options.no_dir) {
			console.log('Attempting to create directories...');
			initHandler._create(dirPath, 'filters');
			initHandler._create(dirPath, 'intents');
			initHandler._create(dirPath, 'models');
			initHandler._create(dirPath, 'responses');
			initHandler._create(dirPath, 'sessionHandlers');
			console.log('Directories creation completed');

			if (!options.no_models) {
				console.log('Attempting to create model files...');
				initHandler._create(dirPath, 'models/customSlots.json');
				initHandler._create(dirPath, 'models/intents.json');
				initHandler._create(dirPath, 'models/sampleUtterances.json');
				console.log('Model files creation completed');
			}
		}

		if (!options.no_index) {
			console.log('Attempting to create index.js ...');

			if (!fs.existsSync(dirPath+'index.js')) {
				var data =
					((options.no_skillvc) ? '' : "var skillVC = require('skillvc').factory.createfromDirectory();\n")
					+ '\n'
					+ 'exports.handler = function(event, context) {\n'
					+ ((options.no_skillvc) ? '\n\t' : '\tskillVC.handler(event, context);\n')
					+ '}\n';

				fs.writeFileSync(dirPath + 'index.js', data, 'utf8');
				console.log('Index file creation completed');
			}
			else {
				console.log('index.js already exists.  Skipping');
			}
		}

		if (!options.no_skillvc) {
			if (!fs.existsSync(dirPath + 'node_modules/skillvc')) {
				npm.install(dirPath, 'skillvc', 'SkillVC');
			}
			else {
				console.log('Attempting to install SkillVC...');
				console.log('SkillVC already installed. Skipping');
			}
		}
	},

	_create : function(dirPath, name) {
		if (!fs.existsSync(dirPath + name)) {
			fs.mkdir(dirPath + name);
		}
		else {
			console.log('\t'+name+' already exists. Skipping');
		}
	}
};

var pluginHandler = {
	handle : function(dir, pluginName, options) {
		var dirPath = path.normalize(dir) + path.sep;
		var pluginConfFile = dirPath+'node_modules/'+pluginName+'/skillvcPlugin.json';

		npm.install(dirPath, pluginName, pluginName, 
			function() {
				if (fs.existsSync(pluginConfFile)) {
					var pluginConf = require(pluginConfFile);

					if (pluginConf.executor && svUtil.isFunction(pluginConf.executor.preInstall)) {
						pluginConf.executor.preInstall(dirPath);
					}

					if (pluginConf.filters && pluginConf.filters.length > 0) {
						pluginHandler._copyPluginFile(dirPath, 'filters', 'Filters');
					}
					if (pluginConf.intents && pluginConf.intents.length > 0) {
						pluginHandler._copyPluginFile(dirPath, 'intents', 'Intents');
					}
					if (pluginConf.sessionHandlers && pluginConf.sessionHandlers.length > 0) {
						pluginHandler._copyPluginFile(dirPath, 'sessionHandlers', 'Session Handlers');
					}
					if (pluginConf.responses && pluginConf.responses.length > 0) {
						pluginHandler._copyPluginFile(dirPath, 'responses', 'Responses');
					}

					if (pluginConf.executor && svUtil.isFunction(pluginConf.executor.postInstall)) {
						pluginConf.executor.postInstall(dirPath);
					}

					console.log('Plugin installation completed');
				}
				else {
					console.log('NPM Module does not appear to be a SkillVC pluging (missing skillvcPlugin.json');

					if (!options.ignore_skillvc) {
						npm.uninstall(dirPath, pluginName, pluginName);
					}
				}
			}
		);
	},

	_copyPluginFile : function(dirPath, type, humanFriendlyName) {
		var created = 0;
		var dirCreatedByPlugin = false;

		if (!fs.existsSync(dirPath+  type)){
			fs.mkdir(dirPath + type);
			dirCreatedByPlugin == true;
		}

		for (var i=0;i<pluginConf[type].length;i++) {
			if (fs.existsSync(pluginConf[type][i])) {
				_copyFile(pluginConf[type][i], dirPath + type);
				created ++;
			}
			else {
				console.log('Plugin '+humanFriendlyName + ' ' + pluginConf[type][i]+' not found');
			}
		}

		// nothing was actually copied
		if (dirCreatedByPluging && created == 0) {
			fs.rmdirSync(dirPath + type);
		}
	}
};

var buildHandler = {
	handle : function() {

	}
};

var npm = {
	install : function(dirPath, packageName, humanFriendlyName, callback) {
		console.log('Attempting to install '+humanFriendlyName+' (could take a few seconds)...');
		// make sure there is a node_modules dir
		if (!fs.existsSync(dirPath+'node_modules')){
		    fs.mkdirSync(dirPath+'node_modules');
		}

		// not locally installed, try globally
		var exec = require('child_process').exec;
		var cmd = 'npm install --prefix '+dirPath+' '+packageName;

		exec(cmd, function(error, stdout, stderr) {
			if (error || stderr) {
				console.log('Error installing '+humanFriendlyName+': '+ ((error) ? error : stderr));
			}
			else {
				console.log(humanFriendlyName+' installed');
			}

			if (fs.existsSync(dirPath+'etc')) fs.rmdirSync(dirPath+'etc');

			if (callback) callback( (error || stderr) );
		});
	},

	uninstall : function(dirPath, packageName, humanFriendlyName, callback) {
		console.log('Attempting to uninstall '+humanFriendlyName+' (could take a few seconds)...');

		// not locally installed, try globally
		var exec = require('child_process').exec;
		var cmd = 'npm uninstall --prefix '+dirPath+' '+packageName;

		exec(cmd, function(error, stdout, stderr) {
			if (error || stderr) {
				console.log('Error uninstalling '+humanFriendlyName+': '+ ((error) ? error : stderr));
			}
			else {
				console.log(humanFriendlyName+' uninstalled');
			}

			if (fs.existsSync(dirPath+'etc')) fs.rmdirSync(dirPath+'etc');

			if (callback) callback( (error || stderr) );
		});
	}
}

var _copyFile = function(src, dest) {
	fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}


// execution code

cmd.version('0.2.0');

cmd
	.command('init <dir>')
	.alias('i')
	.description('Initialize a project by creating directories, index.js, and installing SkillVC')
	.option('-nd, --no_dir', 'Do not create the directories')
	.option('-ni, --no_index', 'Do not create an index.js')
	.option('-nm, --no_models', 'Do not create stubs for model files in the /models directory')
	.option('-nsvc, --no_skillvc', 'Do not install SkillVC')
	.action(initHandler.handle)
	.on('--help', function() {
	    console.log('  Examples:\n'
	    	+ '    init .\n'
	    	+ '    init . --no_dir  // do not create directories\n'
	    	+ '    init . --no_index  // do not create index.js\n'
	    	+ '    init . --no_models  // do not create stubs for model files in the /models directory\n'
			+ '    init . --no_skillvc  // do not install SkillVC\n'
	    	+ '\n');
	  });

cmd
	.command('build <intentFile>')
	.alias('b')
	.description('NOT IMPLEMENTED YET - Builds intentHandlers based on the intents defined in the specified intent file')
	.action(buildHandler.handle);

cmd
	.command('install <dir> <pluginName>')
	.alias('p')
	.description('Installs a SkillVC plugin')
	.option('isv, --ignore_skillvc', 'Do not uninstall pluging if the plugin is not a SkillVC plugin')
	.action(pluginHandler.handle)
	.on('--help', function() {
		console.log('  Examples:\n'
			+'    install . pluginName\n'
			+'    install . pluginName --ignore_skillvc  // Do not uninstall plugin if the plugin is not a SkillVC pluging\n'
			+ '\n');
	});

cmd.parse(process.argv);

if (!cmd.args.length) cmd.help();