/*
-- build
	reads from the intents and creates intent handlers for each intent in /intents

*/

var cmd = require('commander');
var fs = require('fs');
var path = require('path');
var svUtil = require('../lib/util.js');

/**
 * Functions to handle the init CLI command
 * 
 * @type {Map}
 */
var initHandler = {

	/**
	 * Handles the CLI request to initialize a project
	 * 
	 * @function
	 * @param  {String} dir     The directory to operate in
	 * @param  {Object} options The options from the CLI
	 */
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
				npm.install(dirPath, 'skillvc', 'SkillVC', options);
			}
			else {
				console.log('Attempting to install SkillVC...');
				console.log('SkillVC already installed. Skipping');
			}
		}
	},

	/**
	 * Creates a directory
	 * 
	 * @function
	 * @private
	 * @param  {String} dirPath The root directory to use
	 * @param  {String} name    The name of the directory to create in the dirPath (root directory)
	 */
	_create : function(dirPath, name) {
		if (!fs.existsSync(dirPath + name)) {
			fs.mkdir(dirPath + name);
		}
		else {
			console.log('\t'+name+' already exists. Skipping');
		}
	}
};

/**
 * Functions to handle the install CLI command
 * 
 * @type {Map}
 */
var pluginHandler = {

	/**
	 * 
	 * @function
	 * @param  {String} dir        The directory to operate in
	 * @param  {String} pluginName The name of the plugin to use (should be an NPM name)
	 * @param  {Object} options    The options from the CLI
	 */
	handle : function(dir, pluginName, options) {
		console.log('Stating '+pluginName+ ' installation...');
		var destDir = path.resolve(dir);
		var sourceDir = path.resolve(destDir, 'node_modules', pluginName);
		var pluginConfFile = path.join(destDir, 'node_modules', pluginName, 'skillvcPlugin.json');

		if (options.debug) {
			console.log('Reading plugin information from: '+sourceDir);
			console.log('Installing plugin to: '+destDir);
		}
		
		var npmInstallSuccess = function () {

			if (fs.existsSync(pluginConfFile)) {
				var pluginConf = JSON.parse(fs.readFileSync(pluginConfFile, 'utf8'));

				var preInstallSuccess = function() {
					if (pluginConf.filters && pluginConf.filters.length > 0) {
						console.log('Installing filters');
						pluginHandler._moveFiles(sourceDir, destDir+'filters', pluginConf.filters, 'Filter');
					}
					if (pluginConf.intents && pluginConf.intents.length > 0) {
						console.log('Installing intents');
						pluginHandler._moveFiles(sourceDir, destDir+'intents', pluginConf.intents, 'Intent Handler');
					}
					if (pluginConf.sessionHandlers && pluginConf.sessionHandlers.length > 0) {
						console.log('Installing sessionHandlers');
						pluginHandler._moveFiles(sourceDir, destDir+'sessionHandlers', pluginConf.sessionHandlers, 'Session Handler');
					}
					if (pluginConf.responses && pluginConf.responses.length > 0) {
						console.log('Installing responses');
						pluginHandler._moveFiles(sourceDir, destDir+'responses', pluginConf.responses, 'Response');
					}

					// move the plugins modules to the projects modules
					if (pluginConf.node_modules) {
						for (var i=0;i<pluginConf.node_modules.length;i++) {
							fs.renameSync(
								path.join(sourceDir, 'node_modules', pluginConf.node_modules[i]),
								path.join(destDir, 'node_modules', pluginConf.node_modules[i]));
						}
					}

					var postInstallSuccess = function() {
						if (!options.no_remove) {
							// Uninstall the plugin as it has been applied to SkillVC
							npm.uninstall(destDir, pluginName, pluginName, options).then(function() {
								console.log('Plugin installation completed');
							});
						}
						else {
							console.log('Plugin not removed.  It will be in an incomplete state due to moving files for installation');
							console.log('Plugin installation completed');
						}
					};
					
					var postExecPromise = pluginHandler._handleExe(sourceDir, destDir, pluginConf.executor, 'postInstall', options.debug);
					postExecPromise.then(
						function () {
							postInstallSuccess();
						},
						function(reject) {
							// try uninstall no matter what
							postInstallSuccess();
						}
					);
				};

				var preExecPromise = pluginHandler._handleExe(sourceDir, destDir, pluginConf.executor, 'preInstall', options.debug);
				preExecPromise.then(
					function () {
						preInstallSuccess();
					},
					function (reject) {
						if (options.ignore_errors) preInstallSuccess();
					}
				);
			}
			else {
				console.log('NPM Module does not appear to be a SkillVC pluging (missing skillvcPlugin.json)');

				if (!options.ignore_skillvc && !options.no_remove) {
					npm.uninstall(destDir, pluginName, pluginName, options);
				}
			}
		};

		var npmPromise = npm.install(destDir, pluginName, pluginName, options);
		npmPromise.then(
			function () {
				npmInstallSuccess();
			},
	 		function (reject) {
				//act like nothing happened
				if (options.ignore_errors) {
					npmInstallSuccess();
				} 
				// remove unless specified
				else if (!options.no_remove) {
					npm.uninstall(destDir, pluginName, pluginName, options);
				}
			}
		);
	},

	/**
	 * Processes and executes a defined executor
	 * 
	 * @function
	 * @private
	 * @param  {String} sourceDir  Directry where the files are being read from
	 * @param  {String} destDir    Directory where the files should be written to
	 * @param  {Object} executor The executor to use.  This can be a map of functions in the JSON itself or
	 *                           a reference to a file to load and use.  The file can be a map of functions
	 *                           or an object that requires instantiation and then execution.
	 * @param  {String} stage    The stage of execution (preInstall or postInstall)
	 * @param  {Boolean} debug   Is debuging enabled?
	 * @return {Promise} The promise from the executor so the code can wait until its done
	 */
	_handleExe : function(sourceDir, destDir, executor, stage, debug) {
		var result = new Promise(function(resolve, rej) {resolve();}); 
		if (executor) {
			var toExecute;

			// the executor is a map of methods
			if (svUtil.isFunction(executor[stage])) {
				toExecute = executor[stage];
			}
			else {
				// have to use full path otherwise require uses the location of skillvc for relative paths
				var pExe = require(path.join(sourceDir, executor));
				// if I got an object back, construct it
				if (svUtil.isFunction(pExe)) pExe = new pExe();

				// if it has the function in question, run it
				if (svUtil.isFunction(pExe[stage])) { 
					toExecute = pExe[stage];
				}
			}

			if (toExecute) {
				if (debug) console.log('Executing '+stage+' plugin executor');
				var tmpResult = toExecute(sourceDir, destDir);
				if (tmpResult && tmpResult.then) result = tmpResult; // it's a promise
			}
			else if (debug) {
				console.log('Plugin executor does not contain method '+stage+'. This may be by design');
			}
		}

		return result;
	},

	/**
	 * Moves files from one place to another using nodes rename function.
	 *
	 * This will create the destination directory if it doesn't exist and also subsiquently
	 * remove it if no files were written to it (and it the destination directory was
	 * create by this, meaning no files were already in that directory)
	 * 
	 * @function
	 * @private
	 * @param  {String} sourceDir            Directry where the files are being read from
	 * @param  {String} destDir              Directory where the files should be written to
	 * @param  {Array.String} files       List of files (comes from the JSON config)
	 * @param  {String} humanFriendlyName What to use in the console log messaging
	 */
	_moveFiles : function(sourceDir, destDir, files, humanFriendlyName) {
		var created = 0;
		var dirCreatedByPlugin = false;

		if (!fs.existsSync(destDir)){
			fs.mkdir(destDir);
			dirCreatedByPlugin == true;
		}

		var file;
		for (var i=0;i<files.length;i++) {
			file = path.join(sourceDir, path.normalize(files[i]));

			if (fs.existsSync(file)) {
				fs.renameSync(file, path.join(destDir, path.basename(file)));
				created ++;
			}
			else {
				console.log('Plugin '+humanFriendlyName + ' ' + file +' not found');
			}
		}

		// nothing was actually copied
		if (dirCreatedByPlugin && created == 0) {
			fs.rmdirSync(destDir);
		}
	}

};

/**
 * Functions to handle the build CLI command
 * 
 * @type {Map}
 */
var buildHandler = {
	handle : function() {

	}
};

var npm = {

	/**
	 * Installs an NPM package
	 *
	 * @function
	 * @param  {String} destDir           The directory to install to
	 * @param  {String} packageName       The NPM name of the package
	 * @param  {String} humanFriendlyName The display name to use
	 * @param  {Object} options		  The options from the CLI
	 * @param  {boolean} options.debug Debug mode?
	 * @param  {boolean} options.ignore_errors Ignore errors?
	 * @return {Promise} The promise to watch for completion
	 */
	install : function(destDir, packageName, humanFriendlyName, options) {
		return npm._do('install', destDir, packageName, humanFriendlyName, options);
	},

	/**
	 * Uninstalls an NPM package
	 *
	 * @function
	 * @param  {String} destDir           The directory to uninstall from
	 * @param  {String} packageName       The NPM name of the package
	 * @param  {String} humanFriendlyName The display name to use
	 * @param  {Object} options		  The options from the CLI
	 * @param  {boolean} options.debug Debug mode?
	 * @param  {boolean} options.ignore_errors Ignore errors?
	 * @return {Promise} The promise to watch for completion
	 */
	uninstall : function(destDir, packageName, humanFriendlyName, options) {
		return npm._do('uninstall', destDir, packageName, humanFriendlyName, options);
	},

	_do : function(funcType, destDir, packageName, humanFriendlyName, options) {
		if (options.debug) console.log('Attempting to npm '+funcType+' '+humanFriendlyName+' (could take a few seconds)...');
		// make sure there is a node_modules dir
		if (!fs.existsSync(destDir+'node_modules')){
		    fs.mkdirSync(destDir+'node_modules');
		}

		// not locally installed, try globally
		var exec = require('child_process').exec;
		var cmd = 'npm '+funcType+' --prefix '+destDir+' '+packageName;

		return new Promise(function(resolve, reject) {
			exec(cmd, function(error, stdout, stderr) {
				if (options.debug) {
					console.log( ((error || stderr) 
						? 'Error '+funcType+' ' +humanFriendlyName+': '+ ((error) ? error : stderr)
						: humanFriendlyName+' npm '+funcType+'ed')
					);
				}

				if (fs.existsSync(destDir+'etc')) fs.rmdirSync(destDir+'etc');

				if (error || stderr) {
					reject((error) ? error : stderr);
				}
				else {
					resolve();
				}				
			});
		});
	}
}

var _copyFile = function(src, destDir) {
	fs.createReadStream(src).pipe(fs.createWriteStream(destDir));
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
	.option('ie, --ignore_errors', 'Ignore errors and do all plugin steps')
	.action(pluginHandler.handle)
	.on('--help', function() {
		console.log('  Examples:\n'
			+'    install . pluginName\n'
			+'    install . pluginName --ignore_skillvc  // do not uninstall plugin if the plugin is not a SkillVC pluging\n'
			+'    install . pluginName --no_remove  // do not remove the plugin information after installation\n'
			+'    install . pluginName --debug  // provide more information about the install\n'
			+'    install . pluginName --ignore_errors // ignore errors and do all plugin steps\n'
			+ '\n');
	});

cmd.parse(process.argv);

if (!cmd.args.length) cmd.help();