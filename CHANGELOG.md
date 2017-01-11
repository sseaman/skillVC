### v0.5.1 - (2017-01-10)

#### New Features
* Added `helper` directory in lib to provide common functions that skills might want to use in there code
* Added `sessionAttributesHelper` helper which will take any set session attributes and add it to all responses

### v0.5.0 - (2016-12-01) - BREAKING CHANGES

#### New Features
* `render()` added to ResponseManager to shorten call length required to send a response back from an intentHandler
* `ask()` and `tell()` added to ResponseManager to make this easier
* Now supports SmartHome skills
* Response types json must specify the response type (custom, smarthome, other..)

#### Deprecated
* ResponseManager `getResponse()` deprecated in favor of shorter `get()`
* Response `ask()` and `tell()` deprecated in favor of more generic `render()` to support SmartHome and future skill types. Moved to ResponseManager

### v0.4.0 - (2016-11-19) - BREAKING CHANGES

#### New Features
* Filters, Intent Handlers, and Session Handlers now support async processing within them.  To do async operations in a
Filter or Session Handler return a `Promise` from the method and SkillVC will honor the `Promise` until it
is completed.  For Intent Handlers, no `Promise` is require as it just needs to call `context.succeed()`
or `context.fail()` like any other skill.  SkillVC uses the calls to `context` to control an internal `Promise`
for the Intent Handler.
* Logging levels adjusted to never use verbose and favor info and debug more
* Logger is now available from the SkillVC require.  This allows skill developers to more easily set the logging levels
in SkillVC as well as use the winston-simple logger in their code
* Modified error logging to also display stack trace
* skillvc CLI will now build intent handler skeleton code for you via `create` option
* skillvc CLI now comes with a zip ability that will zip your project for us so you can upload it to Lambda

#### Deprecated
* svContext.filterChainCallback deprecated in favor of a `Promise`
* Filters no longer support `executePreOnError()` and `executePostOnError()`.  This was a confusing feature that
permitted multiple paths down the execution chain.  Developers should favor try/catch in their code to continue execution
and if the error is needed in another object, use the `svContext.session` to make the error available to other objects

### v0.3.3 - (2016-10-30) - BREAKING CHANGES

#### New Features
* Intent Handlers not longer call svContext.callback to send a response back from the skill.  They can now
call the lambda context.succeed and context.fail functions as they normally would in a skill outside of SkillVC.
* Intent Handlers no longer have to dig through the SVContext object to get the lambda event and context.  They
are now passed in as arguments.  This and the removal of svContext.callback allows existing skills written 
outside of SkillVC to be easily integrated into SkillVC with minimal code changes.
* Session Handlers and Filters no longer have to dig through the SVContext object to get the lambda event and context.  They
are now passed in as arguments.  
* All Filters, IntentHandlers, and SessionHandlers now have getName() added to them if it does not already exists. This
is primarily for logging and debugging.

#### Bug Fixes
* FilterProviderByDirectory and SessionHandlerByDirectory we not processing additional objects after loading the first one
* IntentHandlerProviderByDirectory was not stopping when it found what it was looking for
* AbstractProviderByAsycnDirectyro was not passing the itemId to the processItem
* AbstractProviderByAFile was not passing the itemId to the processItem
* ContextWrapperFilter was logging as ResponseRenderrFilter
* ResponseProviderByDirectory and ResponseProviderByFile loading is not confirming that it loaded the card
* DefaultProviderByScanning was not logging what it was loading correctly

### v0.3.2 - (2016-10-27)

#### Note
Officially declaring SkillVC as BETA as there are still multiple small issues that could impact skill development

#### Bug Fixes
* AbstractProviderbyAynsDirectory and AbstractProviderByFile were both incorrectly handling ItemProcesser 
    They were both expecting results to be returned (which is no longer correct).  Not sure how this ever passed testing
* ResponseRendererFilter was not using callback to continue filter chain
* SessionHandlerProviderByX were incorrectly logging as FilterProviderByX
* SkillVC.registerSessionHandlerManager had a type and was not returning the session handler
* SkillVC was incorrectly using SessionHandlerManager and not SessionHandlerExecutor
* A SkillVC that was already initialized was initializing again due to a missing return statement

### v0.3.1 - (2016-10-24)

#### New Features
*  Supports module.exports = {} for all objects  
	Previous versions of SkillVC required all intent handlers, filters, etc. to be coded like strict javascript objects  
		Example:  
	```
		function IntentHandler() {}

		IntentHandler.prototype.getIntentsList = function(svContext) {
		}

		IntentHandler.prototype.handleIntent = function(svContext) {
		}

		module.exports = IntentHandler;
	```
	It now supports more common Javascript conventions when dealing with module.exports such as  
	```
		module.exports = {
			getIntentsList : function() {
			},

			handleIntents : function(svContext) {
			}
		}
	```
	or slightly more OO, but less code such as
	```
		function IntentHandler() {}

		IntentHandler.prototype = {
			getIntentsList : function() {
			},

			handleIntent : function(svContext) {
			}
		}

		module.exports = IntentHandler;
	```
* Providers now use ItemProcessor interface for all item loading processing   
	Abstract providers and their concrete implementations had almost random method signatures for their processItem methods.  
	This has been standardized and better documentation and cleaner code implemented  
	This should make extending these objects much easier to follow
* Logging levels for SkillVC are no longer on by default.  They will need to be set in your index.js
* Created requireTest.js which will recursively look in directories for the specified file types and try a 	```require()``` on them
to ensure they will work correctly when executed later.  Think of it as a simple compile tester
* Now using Grunt to do builds and run ESLint and RequireTest

#### Cleanup
* Use of path creation via string concatenation replaced with path.join for cleaner code and safer OS independence
* Created requireTest.js to quickly ensure that all javascript in SkillVC can be ```require```d without errors
* Moved test project directories to /testProject
* Ran ESHint on all code.  Lots of cleanup (> 300 issues)

#### Bug Fixes
* Objects that used module.exports = {} could not be loaded.  Fixed
* Objects that used module.exports = {} were logged with name "Object".  Code modified to show file name in logs

	
### v0.3.0 - (2016-10-19)

#### New Features
* ```skillvc``` CLI created for project initialization and plugin installation  
    New CLI that will create directories and stub files for new SkillVC projects.    
    Use ```node ./node_modules/.bin/skillvc init .``` in the directory you have installed SkillVC and would like to make a SkillVC project  
    Use ```node ./node_modules/.bin/skillvc install . <pluginName>``` in your SkillVC directory to install the
        SkillVC plugin of your choice


#### Bug Fixes
* [`#2`](https://github.com/sseaman/skillVC/issues/2) -   ResponseManager.getFormatManager().addFormatter() returns "is not a function"  
  Error in handlebarsFormatterManager did not pass JSON to be formatted to handlebars