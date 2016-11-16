# Hello World Example

An example of a basic hello world skill in SkillVC.

## Steps

To create this Hello World example, or any new project with SkillVC that uses Convention-over-Configuration, follow the below steps:

### Step 1 - Install SkillVC
In the directory that you want your project, first install SkillVC via NPM 

```npm install skillvc```


### Step 2 - Create the files
Run the skillvc initializer in your projects directory to build all the structures and skeleton files

```node ./node_modules/bin/skillvc.js init .```

### Step 3 - Make your Response
Next you need to make a response.  A response goes in the ```/responses``` directory and contains your response that you want to send. For this example:

/responses/helloWorld.json
```
{
 	"outputSpeech": {
        "text": "Hello World!"
    }
}
```

### Step 4 - Code your Intent Handler
Next you need to make a basic intent handler.  Every intent handler should call `context.succeed()` or `context.fail()`
just like an other skill would

To get a response in helloWorld.json, use the SkillVC responseManager found at `svContxt.appConfig.responseManager`
to get the response you want (the file name extension is not required)


/intents/helloWorldIntent.js
```
/** 
 * This is the minimal code version of an intent.  A more object oriented version in presented in the actual example file
 */
module.exports = {
	handleIntent : function(event, context, svContext) {
		context.succeed(svContext.appConfig.responseManager.getResponse('helloWorld').renderTell());
	}
}
```
### Step 5 - Model
The last step is to enter the model information into the Alexa Skill Kit website (developer.amazon.com/edw).  SkillVC's initializer
creates a ```/models``` directory to store your model information in.  It is suggested to use this directory to store your 
information as SkillVC will be expanded at a later time to integrate these.

/models/intents.json
```
{
  "intents": [
  	{ "intent": "helloWorldIntent" }
  ]
}
```

/models/sampleUtterances.json
```
helloWorldIntent say hello
```

### Step 6 - AWS / Alexa Skill Kit
The last step is to zip up everything and upload it to your lambda function, complete the data entry in the
Alexa Skill Kit website, and go!
You can test this skill on the Alexa Skill Kit Service Simulator on the `Test` tab by typing:
```say hello```
and clicking the Ask button