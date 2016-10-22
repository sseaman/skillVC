### v0.3.1 - (2016-10-21)

#### New Features
<!-- *  Supports module.exports = {} for all objects  
	Previous versions of SkillVC required all intent handlers, filters, etc. to be coded like strict javascript objects  
		Example:  
	```
		function IntentHandler() {}

		IntentHandler.prototype.handleIntent = function(svContext) {
		}

		module.exports = IntentHandler;
	```
	It now supports more common Javascript conventions when dealing with module.exports such as  
	```
		module.exports = {
			handleIntents : function(svContext) {
			}
		}
	``` -->
* Providers now use ItemProcessor interface for all item loading processing   
	Abstract providers and their concrete implementations had almost random method signatures for their processItem methods.  
	This has been standardized and better documentation and cleaner code implemented  
	This should make extending these objects much easier to follow

#### Cleanup
* Use of path creation via string concatenation replaced with path.join for cleaner code and safer OS independence
* Created compileTest.js to quickly ensure that all javascript in SkillVC can be ```require```d without errors
* Moved test project directories to /testProject
* Ran ESHint on all code.  Lots of cleanup (> 300 issues)

<!-- #### Bug Fixes
* Objects that used module.exports = {} could not be loaded.  Fixed
* Objects that used module.exports = {} were logged with name "Object".  Code modified to show file name in logs
 -->
	
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