/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 *
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {

	/**
	 * Installs an NPM package
	 *
	 * @function
	 * @param  {String} destDir           The directory to install to
	 * @param  {String} packageName       The NPM name of the package
	 * @param  {String} humanFriendlyName The display name to use
	 * @param  {Object} options		  The options from the CLI
	 * @return {Promise} The promise to watch for completion
	 */
	install : function(destDir, packageName, humanFriendlyName, options) {
		return this._do('install', destDir, packageName, humanFriendlyName, options);
	},

	/**
	 * Uninstalls an NPM package
	 *
	 * @function
	 * @param  {String} destDir           The directory to uninstall from
	 * @param  {String} packageName       The NPM name of the package
	 * @param  {String} humanFriendlyName The display name to use
	 * @param  {Object} options		  The options from the CLI
	 * @return {Promise} The promise to watch for completion
	 */
	uninstall : function(destDir, packageName, humanFriendlyName, options) {
		return this._do('uninstall', destDir, packageName, humanFriendlyName, options);
	},

	_do : function(funcType, destDir, packageName, humanFriendlyName) {
		console.log('Attempting to npm '+funcType+' '+humanFriendlyName+' (could take a few seconds)...');
		
		// make sure there is a node_modules dir
		var nodeModulesDir = path.resolve(destDir, 'node_modules');
		if (!fs.existsSync(nodeModulesDir)){
			fs.mkdirSync(nodeModulesDir);
		}

		var exec = require('child_process').exec;
		var cmd = 'npm '+funcType+' --prefix '+destDir+' '+packageName;

		return new Promise(function(resolve, reject) {
			exec(cmd, function(error, stdout, stderr) {
				console.log( ((error || stderr) 
					? 'Error '+funcType+' ' +humanFriendlyName+': '+ ((error) ? error : stderr)
					: humanFriendlyName+' npm '+funcType+'ed')
				);

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
};