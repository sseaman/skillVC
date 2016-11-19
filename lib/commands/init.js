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

module.exports = function(cmd) {

	var handle = function(dir, options) {
		var dirPath = path.normalize(dir) + path.sep;

		if (!options.no_dir) {
			console.log('Attempting to create directories...');
			createDir(dirPath, 'filters');
			createDir(dirPath, 'intents');
			createDir(dirPath, 'models');
			createDir(dirPath, 'responses');
			createDir(dirPath, 'sessionHandlers');
			console.log('Directories creation completed');

			if (!options.no_models) {
				console.log('Attempting to create model files...');
				createFile(dirPath, 'models/customSlots.json');
				createFile(dirPath, 'models/intents.json');
				createFile(dirPath, 'models/sampleUtterances.json');
				console.log('Model files creation completed');
			}
		}

		if (!options.no_index) {
			console.log('Attempting to create index.js ...');

			if (!fs.existsSync(dirPath+'index.js')) {
				var data =
					((options.no_skillvc) ? '' 
						: 	 "var skillVC = require('skillvc');\n"
							+"skillVC.logger.setLevels({'all':'debug'});\n"
							+"var skillVCMain = skillVC.factory.createfromDirectory();\n")
					+ '\n'
					+ 'exports.handler = function(event, context) {\n'
					+ ((options.no_skillvc) ? '\n\t' : '\skillVCMain.handler(event, context);\n')
					+ '}\n';

				fs.writeFileSync(dirPath + 'index.js', data, 'utf8');
				console.log('Index file creation completed');
			}
			else {
				console.log('index.js already exists.  Skipping');
			}
		}

		if (options.hello_world) {
			this.create.handle(path.join(dirPath, '/intents/helloWorldIntent.js'), {});
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
	};

	/**
	 * Creates a directory
	 * 
	 * @function
	 * @private
	 * @param  {String} destDir The root directory to use
	 * @param  {String} name    The name of the directory to create in the destDir (root directory)
	 */
	var createDir = function(destDir, name) {
		if (!fs.existsSync(destDir + name)) {
			fs.mkdir(destDir + name);
		}
		else {
			console.log('\t'+name+' already exists. Skipping');
		}
	};

	/**
	 * Creates an empty file
	 * 
	 * @function
	 * @private
	 * @param  {String} destDir The root directory to use
	 * @param  {String} name    The name of the file to create in the destDir (root directory)
	 */
	var createFile = function(destDir, name) {
		if (!fs.existsSync(destDir + name)) {
			fs.closeSync(fs.openSync((destDir + name), 'w'));
		}
		else {
			console.log('\t'+name+' already exists. Skipping');
		}
	};

	cmd
		.command('init <dir>')
		.alias('i')
		.description('Initialize a project by creating directories, index.js, and installing SkillVC')
		.option('-nd, --no_dir', 'Do not create the directories')
		.option('-ni, --no_index', 'Do not create an index.js')
		.option('-nm, --no_models', 'Do not create stubs for model files in the /models directory')
		.option('-nsvc, --no_skillvc', 'Do not install SkillVC')
		.option('-hw, --hello_world', 'Creates a Hello World intent handler')
		.action(handle)
		.on('--help', function() {
			console.log('  Examples:\n'
				+ '    init .\n'
				+ '    init . --no_dir  // do not create directories\n'
				+ '    init . --no_index  // do not create index.js\n'
				+ '    init . --no_models  // do not create stubs for model files in the /models directory\n'
				+ '    init . --no_skillvc  // do not install SkillVC\n'
				+ '    init . --hello_world  // create a HelloWolrdIntent intent handler file\n'
				+ '\n');
		});
};