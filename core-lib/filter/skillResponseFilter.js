var log = require('../skillVCLogger.js').getLogger('SkillResponseFilter');

/**
 * Last item in every filter as it actually tells Lambda if it succeeded or not
 */
function SkillResponseFilter() { }

SkillResponseFilter.prototype.executePost = function(svContext) {
	log.debug('Successful intent execution returned');
	if (svContext.session.response) {
		svContext.lambda.context.succeed(svContext.session.response);
	}
	else {
		log.warn('Intent execution (successful) returned null response');
	}
}

SkillResponseFilter.prototype.executePostOnError = function(svContext) {
	log.debug("Unsuccessful intent execution returned");
	if (svContext.session.response) {
		svContext.lambda.context.fail(svContext.session.response);
	}
	else {
		log.warn('Intent execution (unsuccessful) returned null response');
	}
}

module.exports = SkillResponseFilter;