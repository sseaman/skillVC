/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 *
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
'use strict';

module.exports = function (cmd) {

	var handle = function(intent, options) {
		var fs = require('fs');
		var path = require('path');

		if (!fs.existsSync(intent)) {
			var logLevel = options.log_level ? options.log_level : 'debug';
			var intentName = path.parse(intent).name;
			var data =
					"var log = require('skillvc')"
						+".logger.setLevels({'"+intentName+"':'"+logLevel+"'})"
						+".getLogger('"+intentName+"');\n"
					+ '\n'
					+ 'module.exports = {\n'
					+ '\thandleIntent : function(event, context, svContext) {\n'
					+ "\t\tvar response = '';\n"
					+ '\t\t//your code goes here\n'
					+ '\t\tcontext.succeed(response);\n'
					+ '\t}'
					+ ((options.intent_name) 
						?	',\n\n'
							+ '\tgetIntentsList : function() {\n'
							+"\t\treturn ['"+options.intent_name+"'];\n"
							+'\t}\n'
						: '\n\n')
					+ '};\n';

				fs.writeFileSync(intent, data, 'utf8');
				console.log('Intent file '+intentName+' created');
		}
		else {
			console.log('Intent '+intent+ ' already exists');
		}
	};
	
	cmd
		.command('create')
		.alias('c')
		.description('Creates a skeleton intent file')
		.option('-in, --intent_name [value]', 'The name of the intent (SkillVC will use this over the filename)')
		.option('-ll, --log_level [value]', 'The logging level of the intent. Defaults to debug')
		.action(handle)
		.on('--help', function() {
			console.log('  Examples:\n'
				+ '    create ./intents/helloWorldIntent.js\n'
				+ '    create ./intents/helloWorldIntent.js --intent_name HelloIntent // use HelloIntent as the intent name\n'
				+ '    create ./intents/helloWorldIntent.js --log_level verbose // set the logging level to verbose\n'
				+ '\n');
		});
};