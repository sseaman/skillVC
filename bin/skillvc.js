/*
-- build
	reads from the intents and creates intent handlers for each intent in /intents


-- plugin
	installs a plugin
	a plugin is any node_modules that has node_modules/moduleName/skillvc.json
	skillvc.json = {
		filters : {

		},
		intentHandlers : {

		}
		// and so on that matches what Scanning uses
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

var handleInit = function(dir, options) {
	var dirPath = path.normalize(dir) + path.sep;
	if (!options.no_dir) {
		fs.mkdir(dirPath + "filters");
		fs.mkdir(dirPath + "intents");
		fs.mkdir(dirPath + "models");
		fs.mkdir(dirPath + "responses");
		fs.mkdir(dirPath + "sessionHandlers");
		console.log("Directories created");

		if (!options.no_models) {
			fs.writeFileSync(dirPath + "models/customSlots.json", "");
			fs.writeFileSync(dirPath + "models/intents.json", "");
			fs.writeFileSync(dirPath + "models/sampleUtterances.txt", "");
			console.log("Model files created");
		}
	}

	if (!options.no_index) {
		var data =
			((options.no_skillvc) ? "" : "var skillVC = require('skillvc').factory.createfromDirectory();\n")
			+ "\n"
			+ "exports.handler = function(event, context) {\n"
			+ ((options.no_skillvc) ? "\n\t" : "\tskillVC.handler(event, context);\n")
			+ "}\n";

		fs.writeFileSync(dirPath + "index.js", data, 'utf8');
		console.log("Index file created");
	}

	if (!options.no_skillvc) {
		try {
			var npm = require("npm");
			npm.load(
				{
				    loaded: false
				}, 
				function (err) {
					if (err) {
						console.log("Error installing SkillVC: "+err)
					}
					else {
				  		npm.commands.install(["skillvc"], 
				  			function (err, data) {
							    if (err) console.log("Error installing SkillVC: "+err)
							});
						npm.on("log", function (message) {
							console.log(message);
						});
					}
				}
			);
		}
		catch (e) {
			// not locally installed, try globally
			var exec = require('child_process').exec;
			var cmd = 'npm install skillvc';

			exec(cmd, function(error, stdout, stderr) {
				if (error || stderr) {
					console.log("Error installing SkillVC: "+ ((error) ? error : stderr));
				}
				else {
					console.log("SkillVC installed");
				}
			});
		}
	}
};

var handleBuild = function(intentsFile, options) {

};

var handlePlugin = function(pluginName, options) {

};

cmd.version('1.0.0');

cmd
	.command('init <dir>')
	.alias('i')
	.description('Initialize a project by creating directories, index.js, and installing SkillVC')
	.option('-nd, --no_dir', 'Do not create the directories')
	.option('-ni, --no_index', 'Do not create an index.js')
	.option('-nsvc, --no_skillvc', 'Do not install SkillVC')
	.option('-nm, --no_models', 'Do not create stubs for model files in the /models directory')
	.action(handleInit)
	.on('--help', function() {
	    console.log('  Examples:'
	    	+ '\n'
	    	+ '    init . --no_dir  // do not create directories\n'
	    	+ '    init . --no_index  // do not create index.js\n'
	    	+ '    init . --no_models  //Do not create stubs for model files in the /models directory\n'
			+ '    init . --no_skillvc  // do not install SkillVC\n'
	    	+ '\n');
	  });

cmd
	.command('build <intentFile>')
	.alias('b')
	.description('Builds intentHandlers based on the intents defined in the specified intent file')
	.action(handleBuild);

cmd
	.command('install <pluginName>')
	.alias('p')
	.description('Installs the SkillVC plugin')
	.action(handlePlugin);

cmd.parse(process.argv);

if (!cmd.args.length) cmd.help();