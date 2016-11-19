/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 *
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
'use strict';

var fs = require('fs');
var path = require('path');
var npm = require('./npm.js');
var svUtil = require('../util.js');

module.exports = function (cmd) {

	var handle = function(dir, pluginName, options) {

		console.log('Starting '+pluginName+ ' installation...');
		var destDir = path.resolve(dir) + path.sep;
		var sourceDir = path.resolve(destDir, 'node_modules', pluginName);
		var pluginConfFile = path.resolve(destDir, 'node_modules', pluginName, 'skillvcPlugin.json');

		if (options.debug) {
			console.log('Reading plugin information from: '+sourceDir);
			console.log('Installing plugin to: '+destDir);
		}
		
		// to allow the promises to be able to call from resolve() or reject(), the code has to be a function
		var npmInstallSuccess = function () {

			if (fs.existsSync(pluginConfFile)) {
				var pluginConf = JSON.parse(fs.readFileSync(pluginConfFile, 'utf8'));

				// to allow the promises to be able to call from resolve() or reject(), the code has to be a function
				var preInstallSuccess = function() {
					if (pluginConf.filters && pluginConf.filters.length > 0) {
						console.log('Installing filters');
						moveFiles(sourceDir, destDir+'filters', pluginConf.filters, 'Filter');
					}
					if (pluginConf.intents && pluginConf.intents.length > 0) {
						console.log('Installing intents');
						moveFiles(sourceDir, destDir+'intents', pluginConf.intents, 'Intent Handler');
					}
					if (pluginConf.sessionHandlers && pluginConf.sessionHandlers.length > 0) {
						console.log('Installing sessionHandlers');
						moveFiles(sourceDir, destDir+'sessionHandlers', pluginConf.sessionHandlers, 'Session Handler');
					}
					if (pluginConf.responses && pluginConf.responses.length > 0) {
						console.log('Installing responses');
						moveFiles(sourceDir, destDir+'responses', pluginConf.responses, 'Response');
					}

					// move the plugins modules to the projects modules
					if (pluginConf.node_modules) {
						for (var i=0;i<pluginConf.node_modules.length;i++) {
							// if not already installed
							if (!fs.existsSync( path.resolve(destDir, 'node_modules', pluginConf.node_modules[i]) )) {
								fs.renameSync(
									path.resolve(sourceDir, 'node_modules', pluginConf.node_modules[i]),
									path.resolve(destDir, 'node_modules', pluginConf.node_modules[i]));
							}
						}
					}

					// to allow the promises to be able to call from resolve() or reject(), the code has to be a function
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
					
					// Run the postInstall executor - Promise step 3
					handleExe(sourceDir, destDir, pluginConf.executor, 'postInstall', options.debug).then(
						function() {
							postInstallSuccess(); // check for no_remove is in here
						},
						function() {
							// try uninstall no matter what as this is the last step
							postInstallSuccess(); // check for no_remove is in here
						}
					);
				};

				// Run the preInstall executor - Promise step 2
				handleExe(sourceDir, destDir, pluginConf.executor, 'preInstall', options.debug).then(
					function() {
						preInstallSuccess();
					},
					function() {
						if (options.ignore_errors) preInstallSuccess();
						else if (!options.no_remove) {
							npm.uninstall(destDir, pluginName, pluginName, options);
						}
					}
				);
			}
			else {
				console.log('NPM Module does not appear to be a SkillVC pluging (missing skillvcPlugin.json)');

				// either ignore the fact that it's not for SkillVC or don't remove it.. so leave its
				if (!options.ignore_skillvc && !options.no_remove) {
					npm.uninstall(destDir, pluginName, pluginName, options);
				}
			}
		};

		// install the NPM - Promise step 1
		npm.install(destDir, pluginName, pluginName, options).then(
			function() {
				npmInstallSuccess();
			},
			function() {
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
	};

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
	var handleExe = function(sourceDir, destDir, executor, stage, debug) {
		var result = new Promise(function(resolve) {resolve();}); 
		if (executor) {
			var toExecute;

			// the executor is a map of methods
			if (svUtil.isFunction(executor[stage])) {
				toExecute = executor[stage];
			}
			else {
				// have to use full path otherwise require uses the location of skillvc for relative paths
				var pExe = require(path.resolve(sourceDir, executor));
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
	};

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
	var moveFiles = function(sourceDir, destDir, files, humanFriendlyName) {
		var created = 0;
		var dirCreatedByPlugin = false;

		if (!fs.existsSync(destDir)){
			fs.mkdir(destDir);
			dirCreatedByPlugin = true;
		}

		var file;
		for (var i=0;i<files.length;i++) {
			file = path.resolve(sourceDir, path.normalize(files[i]));

			if (fs.existsSync(file)) {
				fs.renameSync(file, path.resolve(destDir, path.basename(file)));
				created ++;
			}
			else {
				console.log('Plugin ' + humanFriendlyName + ' ' + file +' not found');
			}
		}

		// nothing was actually copied
		if (dirCreatedByPlugin && created === 0) {
			fs.rmdirSync(destDir);
		}
	};

	cmd
		.command('install <dir> <pluginName>')
		.alias('p')
		.description('Installs a SkillVC plugin')
		.option('isv, --ignore_skillvc', 'Do not uninstall pluging if the plugin is not a SkillVC plugin')
		.option('nr, --no_remove', 'Do not remove the plugin information after installation')
		.option('d, --debug', 'Provide more information about the install')
		.option('ie, --ignore_errors', 'Ignore errors and do all plugin steps')
		.action(handle)
		.on('--help', function() {
			console.log('  Examples:\n'
				+'    install . pluginName\n'
				+'    install . pluginName --ignore_skillvc  // do not uninstall plugin if the plugin is not a SkillVC pluging\n'
				+'    install . pluginName --no_remove  // do not remove the plugin information after installation\n'
				+'    install . pluginName --debug  // provide more information about the install\n'
				+'    install . pluginName --ignore_errors // ignore errors and do all plugin steps\n'
				+ '\n');
		});
};