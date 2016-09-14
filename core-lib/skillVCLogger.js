var winston = require('winston');

function SkillVCLogger() { 
}

// TODO: Make this externally configurable and be able to set log level per object
SkillVCLogger.getLogger = function(className) {
	return new (winston.Logger)({
	  transports: [
	    new (winston.transports.Console)({
	      json : false,
	      timestamp : true,
	      label: className,
	      level : 'debug'
	    })
	  ]
	});
}

module.exports = SkillVCLogger;