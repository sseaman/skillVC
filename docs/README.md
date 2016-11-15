# SkillVC

A Model / View / Controller framework for quickly creating complex custom skills for [Alexa](https://developer.amazon.com/alexa). 
Choose either Convention-over-Configuration, Configuration, or Scan approaches to the configuration and execution of your skill.

SkillVC is maintained in GitHub.  For full source to to [GitHub SkillVC](https://github.com/sseaman/skillVC)

For full API documentation, see [SkillVC API docs](https://sseaman.github.io/skillVC/)

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
the ```let response = '';``` line to the following
```
let response = svContext.appConfig.responseManager.tell('Hello World!');
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
1. Project Initialization
2. Configuration Options
    1. Convention-over-Configuration
    2. Scanning
    3. Configuration
3. Intent Handlers
4. Responses
    1. Handlebars
5. Session Handlers
6. Filters
7. SkillVC Context
8. Plugins
    1. Developing a Plugin
9. Example
10. FAQ
11. License