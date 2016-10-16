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
				npm.install(dirPath, 'skillvc', 'SkillVC', true);
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
		console.log('Stating '+pluginName+ ' installation...');
		var destDir = path.normalize(dir) + path.sep;
		var pluginConfFile = path.join(destDir, 'node_modules', pluginName, 'skillvcPlugin.json');

		npm.install(destDir, pluginName, pluginName, options.debug,
			function() {
				if (fs.existsSync(pluginConfFile)) {
					var pluginConf = JSON.parse(fs.readFileSync(pluginConfFile, 'utf8'));

					if (pluginConf.executor && svUtil.isFunction(pluginConf.executor.preInstall)) {
						pluginConf.executor.preInstall(destDir);
					}

					var sourceDir = path.join(destDir, 'node_modules', pluginName);

					if (pluginConf.filters && pluginConf.filters.length > 0) {
						console.log('Installing filters');
						pluginHandler._moveFiles(destDir+'filters', sourceDir, pluginConf.filters, 'Filter');
					}
					if (pluginConf.intents && pluginConf.intents.length > 0) {
						console.log('Installing intents');
						pluginHandler._moveFiles(destDir+'intents', sourceDir, pluginConf.intents, 'Intent Handler');
					}
					if (pluginConf.sessionHandlers && pluginConf.sessionHandlers.length > 0) {
						console.log('Installing sessionHandlers');
						pluginHandler._moveFiles(destDir+'sessionHandlers', sourceDir, pluginConf.sessionHandlers, 'Session Handler');
					}
					if (pluginConf.responses && pluginConf.responses.length > 0) {
						console.log('Installing responses');
						pluginHandler._moveFiles(destDir+'responses', sourceDir, pluginConf.responses, 'Response');
					}

					// move the plugins modules to the projects modules
					var pluginModulesRoot = path.join(sourceDir, 'node_modules');
					if (fs.existsSync(pluginModulesRoot)) {
						console.log('Installing node_modules');
						var pluginInstalledModules = fs.readdirSync(pluginModulesRoot).filter(function(file) {
						    return fs.statSync(path.join(pluginModulesRoot, file)).isDirectory();
						});
						for (var i=0;i<pluginInstalledModules.length;i++) {
							fs.renameSync(
								path.join(sourceDir, 'node_modules', pluginInstalledModules[i]),
								path.join(destDir, 'node_modules', pluginInstalledModules[i]));
						}
					}

					if (pluginConf.executor && svUtil.isFunction(pluginConf.executor.postInstall)) {
						pluginConf.executor.postInstall(destDir);
					}

					if (!options.no_remove) {
						// Uninstall the plugin as it has been applied to SkillVC
						npm.uninstall(destDir, pluginName, pluginName, options.debug, function() {
							console.log('Plugin installation completed');
						});
					}
					else {
						console.log('Plugin not removed.  It will be in an incomplete state due to moving files for installation');
						console.log('Plugin installation completed');
					}
				}
				else {
					console.log('NPM Module does not appear to be a SkillVC pluging (missing skillvcPlugin.json)');

					if (!options.ignore_skillvc) {
						npm.uninstall(destDir, pluginName, pluginName, options.debug);
					}
				}
			}
		);
	},

	_moveFiles : function(dest, source, files, humanFriendlyName) {
		var created = 0;
		var dirCreatedByPlugin = false;

		if (!fs.existsSync(dest)){
			fs.mkdir(dest);
			dirCreatedByPlugin == true;
		}

		var file;
		for (var i=0;i<files.length;i++) {
			file = path.join(source, path.normalize(files[i]));

			if (fs.existsSync(file)) {
				fs.renameSync(file, path.join(dest, path.basename(file)));
				created ++;
			}
			else {
				console.log('Plugin '+humanFriendlyName + ' ' + file +' not found');
			}
		}

		// nothing was actually copied
		if (dirCreatedByPlugin && created == 0) {
			fs.rmdirSync(dest);
		}
	}

};

var buildHandler = {
	handle : function() {

	}
};

var npm = {
	install : function(dirPath, packageName, humanFriendlyName, consoleOn, callback) {
		if (consoleOn) console.log('Attempting to npm install '+humanFriendlyName+' (could take a few seconds)...');
		// make sure there is a node_modules dir
		if (!fs.existsSync(dirPath+'node_modules')){
		    fs.mkdirSync(dirPath+'node_modules');
		}

		// not locally installed, try globally
		var exec = require('child_process').exec;
		var cmd = 'npm install --prefix '+dirPath+' '+packageName;

		exec(cmd, function(error, stdout, stderr) {
			if (error || stderr) {
				if (consoleOn) console.log('Error installing '+humanFriendlyName+': '+ ((error) ? error : stderr));
			}
			else {
				if (consoleOn) console.log(humanFriendlyName+' npm installed');
			}

			if (fs.existsSync(dirPath+'etc')) fs.rmdirSync(dirPath+'etc');

			if (callback) callback( (error || stderr) );
		});
	},

	uninstall : function(dirPath, packageName, humanFriendlyName, consoleOn, callback) {
		if (consoleOn) console.log('Attempting to npm uninstall '+humanFriendlyName+' (could take a few seconds)...');

		// not locally installed, try globally
		var exec = require('child_process').exec;
		var cmd = 'npm uninstall --prefix '+dirPath+' '+packageName;

		exec(cmd, function(error, stdout, stderr) {
			if (error || stderr) {
				if (consoleOn) console.log('Error uninstalling '+humanFriendlyName+': '+ ((error) ? error : stderr));
			}
			else {
				if (consoleOn) console.log(humanFriendlyName+' npm uninstalled');
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
	.option('nr, --no_remove', 'Do not remove the plugin information after installation')
	.option('d, --debug', 'Provide more information about the install')
	.action(pluginHandler.handle)
	.on('--help', function() {
		console.log('  Examples:\n'
			+'    install . pluginName\n'
			+'    install . pluginName --ignore_skillvc  // do not uninstall plugin if the plugin is not a SkillVC pluging\n'
			+'    install . pluginName --no_remove  // do not remove the plugin information after installation\n'
			+'    install . pluginName --debug  // provide more information about the instal\n'
			+ '\n');
	});

cmd.parse(process.argv);

if (!cmd.args.length) cmd.help();