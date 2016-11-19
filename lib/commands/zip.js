/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 *
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
'use strict';

module.exports = function (cmd) {

	var handle = function(options) {
		var fs = require('fs');
		var path = require('path');

		var dir = options.dir ? options.dir : '.';
		var projectName = options.project_name ? options.project_name : 'project.zip';
		var targetDir = options.target_dir ? options.target_dir : '.';
		var finalName = path.join(targetDir, projectName);

		// backup the existing one
		if (fs.existsSync(finalName)) {
			var i = 1;
			while (fs.existsSync(finalName+'.'+i)) {
				i++;
			}
			fs.renameSync(finalName, finalName+'.'+i);
		}

		console.log('Zipping '+dir+' into '+finalName);

		var archiver = require('archiver');
		var output = fs.createWriteStream(finalName);
		var zipArchive = archiver('zip');
		output.on('close', function() {
			console.log('Project zipped');
		});

		zipArchive.pipe(output);
		zipArchive.glob('**/*', {
			cwd: dir,
			ignore: [projectName]
		}, {});

		zipArchive.finalize(function(err) {
			if (err) {
				console.log('Error zipping project:', err);
			}
		});
	};

	cmd
		.command('zip')
		.alias('z')
		.description('Zips a project for upload to Lambda')
		.option('-d, --dir [value]', 'The directory to zip.  Defaults to .')
		.option('-p, --project_name [value]', 'The name of the zip file. Defaults to project.zip')
		.option('-t, --target_dir [value]', 'The directory to write the zip to.  Defaults to .')
		.action(handle)
		.on('--help', function() {
			console.log('  Examples:\n'
				+'    zip \n'
				+'    zip --dir ./tmp // zip the ./tmp directory\n'
				+'    zip --project_name mySkill.zip // names the zip mySkill.zip\n'
				+'    zip --target_dir ./out // creates the zip in the ./out directory'
		+ '\n');
		});
};