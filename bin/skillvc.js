/*
-- init
	-- dironly
	-- noindex

	creates the /filters /intents etc files as well as stubs for:
		sampleUtterances.txt
		customSlots.json
		intents.json
		index.js (with skillVC code in it) if there is no --noindex

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
	var normed = path.normalize(dir);
	if (!options.no_dir) {
		fs.mkdir(normed + path.sep + "filters");
		fs.mkdir(normed + path.sep + "intents");
		fs.mkdir(normed + path.sep + "models");
		fs.mkdir(normed + path.sep + "responses");
		fs.mkdir(normed + path.sep + "sessionHandlers");

		if (!options.no_models) {
			fs.writeFileSync(normed + path.sep + "models/customSlots.json", "");
			fs.writeFileSync(normed + path.sep + "models/intents.json", "");
			fs.writeFileSync(normed + path.sep + "models/sampleUtterances.txt", "");
		}
	}

	if (!options.no_index) {
		var data =
			((options.no_skillvc) ? "" : "var skillVC = require('skillvc').factory.createfromDirectory();\n")
			+ "\n"
			+ "exports.handler = function(event, context) {\n"
			+ ((options.no_skillvc) ? "\n\t" : "\tskillVC.handler(event, context);\n")
			+ "}\n";

		fs.writeFileSync(normed + path.sep + "index.js", data, 'utf8');
	}

	if (!options.no_skillvc) {
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
	    	+ '    init . --no-dir  // do not create directories\n'
	    	+ '    init . --no-index  // do not create index.js\n'
	    	+ '    init . --no_models  //Do not create stubs for model files in the /models directory\n'
			+ '    init . --no-skillvc  // do not install SkillVC\n'
	    	+ '\n');
	  });

cmd
	.command('build <intentFile>')
	.alias('b')
	.description('Builds intentHandlers based on the intents defined in the specified intents file')
	.action(handleBuild);

cmd
	.command('install <pluginName>')
	.alias('p')
	.description('Installs the SkillVC plugin')
	.action(handlePlugin);

cmd.parse(process.argv);

if (!cmd.args.length) cmd.help();