var winston = require('winston');

/**
 * Providers a centralized logger mechanism with per object definable logging level
 *
 * The levels can be set by providing a map where the keys are the objects and the values
 * the log levels.  If no level is provided, it defaults to info
 *
 * If the map contains key 'all' then every log will be set to the level defined with the 'all' key
 *
 * If the level is set to 'none', logging is disabled
 *
 * Examples:
 * var Logger = require('./skillVCLogger.js');
 * var log = Logger.getLogger('SkillVC'); // use to actually do the logging
 *
 * Then in your code:
 * Logger.setLevels({'all':'debug'}); // everything set to debug
 * Logger.setLevels({'all':'none'});  // turn off all logging
 * Logger.getLevels({'SkillVC', 'debug'}) // turns on debugging for SkillVC.  All others will be turned off
 * 
 * @param {[type]} levels [description]
 */
function SkillVCLogger(logLevels) { }

SkillVCLogger.setLevels = function(logLevels) {
	levels = logLevels;

	// go through all the loggers
	for (var key in winston.loggers.loggers)  {
		var logger = winston.loggers.loggers[key];

		if (logLevels['all']) { 
			if (logLevels['all'] != 'none') { // turning on everything
				logger.transports.console.level = logLevels['all'];
			}
			else { // all = none so remove everything
				logger.remove(winston.transports.Console)
			}
		}
		else {
			// individual log levels were set
			var level = logLevels[key];
			if (level != 'none') {
				logger.transports.console.level = level;
			}
			else { // level = none, so turn it off
				logger.remove(winston.transports.Console)
			}
		}
	}
}	

SkillVCLogger.getLogger = function(className) {
	winston.loggers.add(className, {
		console : {
		    json : false,
		    timestamp : true,
		    label: className,
		    level : 'debug'
		}
	});
	return winston.loggers.get(className);
}

module.exports = SkillVCLogger;