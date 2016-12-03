# SkillVC

A Model / View / Controller framework for quickly creating complex custom skills for [Alexa](https://developer.amazon.com/alexa). 
Choose either Convention-over-Configuration, Configuration, or Scan approaches to the configuration and execution of your skill.

SkillVC is maintained in GitHub.  For full source to to [GitHub SkillVC](https://github.com/sseaman/skillVC)

For full API documentation, see [SkillVC API docs](https://sseaman.github.io/skillVC/api/)

If you find ANY issues, please take the time to report them at [Github Issues](https://github.com/sseaman/skillVC/issues)

## Installation
-----
You can install SkillVC in your project's `node_modules` folder, or you can install it globally.

To install the latest version available on NPM:

    npm install skillvc

To install the latest development version:

    npm install git+https://github.com/sseaman/skillVC.git

## Quick Start

SkillVC comes with command line tools to do such functions as setup a project for you, install SkillVC plugings, and build intent handlers
from your existing intent model files (coming soon). 

### Create SkillVC Project
To have SkillVC create all the necessary folders, files, and even stub index.js for your Convention-over-Configuration project, do the following:

```
Create the directory for your project
Install SkillVC per the installation instructions above (npm install skillvc)
In the directory of your project run: ./node_modules/.bin/skillvc init .
```
This will create all of the directories required as well the index.js (debug level logging) required for running SkillVC.

Next you need to create your intent handler to handle the calls from the Alexa for your defined intent.  By naming your file the name
of your intent, SkillVC will automatically know to use this file anytime the intent is executed.  Let's use the following example intent
definition:
```
{
    "intents" : [
        { "intent" : "HelloWorldIntent"}
    ]
}
```

### Create SkillVC Intent Handler
SkillVC comes with a code generator to allow you to quickly create an intent handler like so:
```
./node_modules/.bin/skillvc create ./intents/HelloWorldIntent.js
```

### Edit Intent Handler
By default the skeleton Intent Handler that is created does not return anything. To get Alexa to say "Hello Work", modify
the ```var response = '';``` line to the following
```
var response = svContext.appConfig.responseManager.tell('Hello World!');
```

This uses SkillVC's response manager to render a valid message to Alexa

### Bundle it all up
SkillVC also ships with a zip bundler to make uploading the project to Lambda easy.  Run the following command from your projects
root directory to bundle your project:
```
./node_modules/.bin/skillvc zip
```
This will create a project.zip file that can be uploaded to Lambda

### Finishing up
Assuming you have already setup Lambda and your skill in the Alexa Skill Kit website, you can now upload your zip file to your
lambda function and test your skill!


## Documentation
1. [Project Initialization](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#projectInitialization)
2. [Configuration Options](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#configurationOptions)
    1. [Convention-over-Configuration](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#configurationConvention)
    2. [Scanning](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#configurationScanning)
    3. [Configuration](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#configurationConfiguration)
3. [Intent Handlers](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#intentHandlers)
4. [Responses](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#responses)
    1. [Handlebars](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#responsesHandlebars)
    2. [Quick Responses](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#quickResponses)
5. [Session Handlers](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#sessionHandlers)
6. [Filters](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#filters)
7. [SkillVC Context](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#skillVCContext)
8. [Plugins](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#plugins)
    1. [Developing a Plugin](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#pluginsDevelopment)
9. [Example](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#example)
10. [FAQ](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#faq)
11. [License](https://github.com/sseaman/skillVC/tree/master/docs/MANUAL.md#license)