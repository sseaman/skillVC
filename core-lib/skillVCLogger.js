/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var winston = require('winston');

/**
 * Providers a centralized logger mechanism with per object definable logging levels using 
 * {@link https://github.com/winstonjs/winston|winston}
 *
 * The levels can be set by providing a map where the keys are the objects and the values
 * the log levels.  If no level is provided, it defaults to info
 *
 * If the map contains key 'all' then every log will be set to the level defined with the 'all' key
 *
 * If the level is set to 'none', logging is disabled
 *
 * @example
 * var Logger = require('./skillVCLogger.js');
 * var log = Logger.getLogger('SkillVC'); // use to actually do the logging
 *
 * Then in your code:
 * Logger.setLevels({'all':'debug'}); // everything set to debug
 * Logger.setLevels({'all':'none'});  // turn off all logging
 * Logger.getLevels({'SkillVC', 'debug'}) // turns on debugging for SkillVC.  All others will be turned off
 *
 * @constructor
 * @see {@link https://github.com/winstonjs/winston|winston}
 * @param {Map} levels The logging levels
 */
function SkillVCLogger(logLevels) { }

/**
 * Allows for runtime setting of log levels.  Can be called at anytime to adjust log levels
 * 
 * @function
 * @param {Map} logLevels The logging levels for any object
 */
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

/**
 * Get a {@link https://github.com/winstonjs/winston|winston} logging instance that is configured
 * based upon the set logging levels.
 *
 * If no logging levels have been set it will default to level 'info'
 * 
 * @function
 * @param  {String} className The name of the javascript file (class) to create a logger for
 * @return {Winston.Logger} A usable and configured instance of a Winston logger.
 */
SkillVCLogger.getLogger = function(className) {
	winston.loggers.add(className, {
		console : {
		    json : false,
		    timestamp : true,
		    label: className,
		    level : (winston.loggers.loggers[className]) 
				? winston.loggers.loggers[className].transports.console.level 
				: 'info'
		}
	});
	return winston.loggers.get(className);
}

module.exports = SkillVCLogger;