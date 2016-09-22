/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * @typedef {Object.<string, Object>} SVContext
 * @property {Object} appConfig Contains all the configuration information that was passed into @{link SkillVC} when it was created.
 *                              This is useful for when you want to inject your own configuration info into @{link SkillVC}
 * @property {Object} [appConfig.logLevels] The logging levels for @{link SkillVC}.  See {@link SkillVCLogger} for more information
 * @property {CardManager} appConfig.cardManger The registered {@link CardManager} that will be used by SkillVC
 * @property {Object} appConfig.filterChainExecutor The registered {@link FilterChainExecutor} that will be used to execute the filter chain
 * @property {Object} appConfig.filterManager
 * @property {FilterManager} appConfig.filterManager.pre The {@link FilterManager} for all pre filters
 * @property {FilterManager} appConfig.filterManager.post The {@link FilterManager} for all post filters
 * @property {IntentHandlerManager} appConfig.intentHandlerManager The registered {@link IntentHandlerManager}
 * @property {SessionHandlerManager} [appConfig.sessionHandlerManager] The registered {@link SessionHandlerManager}
 * @property {Object} appId The applicationId that will be checked to ensure that something / someone is not tying to 
 *                          incorrectly invoke your skill
 * @property {Object} appSession Map for use by anything in @{link SkillVC} that may want to keep a session for the life of @{link SkillVC}
 * @property {IntentHandler~callback} callback The callback that all intents should use to report if they were successful or not
 * @property {Object} lambda The objects passed from lambda that
 * @property {Object} lambda.event The lambda skill event object
 * @property {Object} lambda.context The lamdba skill context object
 * @property {Object} session A session that is alive only for a single execution of SVHandler can be used to pass information between
 *                            objects but do not need to live forever (use appSession for longer lived objects)
 */