### v0.3.0 - (2016-10-19)

#### New Features
* ```skillvc``` CLI created for project initialization and plugin installation  
    New CLI that will create directories and stub files for new SkillVC projects.    
    Use ```node ./node_modules/.bin/skillvc init .``` in the directory you have installed SkillVC and would like to make a SkillVC project  
    Use ```node ./node_modules/.bin/skillvc install <pluginName> .``` in your SkillVC directory to install the
        SkillVC plugin of your choice


#### Bug Fixes
* [`#2`](https://github.com/sseaman/skillVC/issues/2) -   ResponseManager.getFormatManager().addFormatter() returns "is not a function"  
  Error in handlebarsFormatterManager did not pass JSON to be formatted to handlebars