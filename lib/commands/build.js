/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 *
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
'use strict';

module.exports = function(cmd) {

	var handle = function() {
		/*
		-- build
			reads from the intents and creates intent handlers for each intent in /intents

		*/
	};

	cmd
		.command('build <intentFile>')
		.alias('b')
		.description('NOT IMPLEMENTED YET - Builds intentHandlers based on the intents defined in the specified intent file')
		.action(handle);

};