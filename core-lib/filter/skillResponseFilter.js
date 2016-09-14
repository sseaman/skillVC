/**
 * Last item in every filter as it actually tells Lambda if it succeeded or not
 */
function SkillResponseFilter() { }

SkillResponseFilter.prototype.execute = function(filterContext) {
	if (filterContext.filterSession.response) filterContext.skillContext.succeed(filterContext.filterSession.response);
}

SkillResponseFilter.prototype.executeOnError = function(filterContext) {
	if (filterContext.filterSession.response) filterContext.skillContext.fail(filterContext.filterSession.response);
}

module.exports = SkillResponseFilter;