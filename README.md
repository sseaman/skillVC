# SkillVC

A View / Controller (no Model) framework for quickly creating complex custom skills for [Alexa](https://developer.amazon.com/alexa). 
Choose either Convention-over-Configuration, Configuration, or Scan approaches to the configuration and execution of your skill.

## Table of Contents
1. Installation
2. Source / Webpage
3. Usage
    1. Configuration Types
        1. Convention-over-Configuration
        2. Scanning
        3. Congiuration
    2. SkillVC Context
    2. Intent Handlers
    3. Responses
        1. Handlebars
    4. Session Handlers
    5. Filters
    6. Advanced Configuration
4. Example
5. License

## Installation
-----
You can install SkilLVC in your project's `node_modules` folder, or you can install it globally.

To install the latest version available on NPM:

    npm install skillvc

To install the latest development version:

    npm install git+https://github.com/sseaman/skillVC.git

## Source / Webpage
-----
SkillVC is maintained in GitHub.  For full source to to [https://github.com/sseaman/skillVC](GitHub SkillVC)

For full API documetation, see [https://sseaman.github.io/skillVC/](SkillVC API docs)

## Usage
-----
SkillVC is designed to be very easy to use out of the box, but also allow for a high degree of configuration.  Please
note that at this time SkillVC only supports **custom** skill types, but this will be expanded if there are enough requests.

For more detailed documentation, see the individual object API documentation

### Configuration Types
SkillVC is designed to be highly configurable and allows for multiple configuration setups as well as providing multiple
points to override internal execution to give the most customizable framework possible.  When first starting out
with SkillVC you will want to choose the configuration type you want.

#### Convention-over-Configuration
[Convention-over-Configuration (CoC)](https://en.wikipedia.org/wiki/Convention_over_configuration)) is the simpliest and most 
straightforward way to use SkillVC as objects are simply placed in specific directories and SkillVC does the rest.

To leverage CoC, first create the following directories in your project:
* /responses
* /filters
* /intents
* /sessionHandlers

In each directory you will place the corresponding objects for your skill.  That is, responses go in /responses, objects that handle
intents go in /intents, and so on. See the individual sections below on how these objects are formatted and their required 
methods.

Once you have the objects you want in their correct directories, all that is needed is to have SkillVC 
handle all of the requests to your skill.  For CoC, with the default directory structure listed above, create an index.js that
has the following:
```
const skillVC = require('skillvc').factory.createfromDirectory();

exports.handler = function(event, context) {
    skillVC.handler(event, context);
}
```

#### Scanning
Scanning searches a defined set of files and, based on reading (introspection) each file, classifies them as responses,
filters, intents, or sessionHanlder.  Scanning had an advantage over CoC because it allows a single javascript object
to act as both a filter, intent, and sessionHandler (responses are still required to be separate files).  However, as
each object must be full loaded and introspected, it can take SkillVC longer to initialize when compared to CoC.

For Scanning, create an index.js that has the following:
```
const skillVC = require('skillvc').factory.createFromScan([
    'locationAndNameOfFileToScan',
    'locationAndNameOfFileToScan',
    'and so on'
    ]);

exports.handler = function(event, context) {
	skillVC..handler(event, context);
}
```

#### Configuration
-----
Configuration is the last built in type and is the most complicated form of initialization.  It provide
the most out-of-the-box customization of how SkillVC works and, if done correctly, can be the fastest of the configuration
methods. To use configuration, you define a Map ({}) that has the responses, filters, intents, and sessionHandlers and provide that
map to SkillVC.  In this way you have complete control over how things are loaded and controlled.
 
The map must follow the format and each object must implement the methods required for each object:
```
{
	sessionHandlers : {
		start : [],
		end : []
	},
	filters : {
		pre : [],
		post : []
	},
	intentHandlers : {},
	responses : {}
}
```
**Note:** This is the same format that the Scanning configuration uses internally when loading objects

For Configuration, create an index.js that has the following:
```
const skillVC = require('skillvc').factory.createFromConfiguration({
        the contents of the map to use for configuration
    });

exports.handler = function(event, context) {
	skillVC.handler(event, context);
}
```

### SkillVC Context
-----
SkillVC uses a contex object (`map`) to store all objects related to execution as well as callbacks for use by the
various objects described below.  The context object, `skillVC` is passed to every object and can be manipulated by
any object.  This object is used by every object in SkillVC so it's good to know what all is available.

The context object contains the following:
* lambda
    * event - The event that was passed by lambda to your lambda function (index.js)
    * context - The context that was passed by lambda to your lambda function (index.js)
* appConfig The configuration that was passed into SkillVC when created.  Specific objects are always present and listed 
		below.  You can also use this `map` to pass your own objects into SkillVC at time of creation.
    * responseManager - The ResponseManager that is being used by SkillVC.  This object is used by Intent Handlers
        (or other objects) to get configured responses
    * filterManager - The FilterManager being used by SkillVC to manage filters
    * filterChainExecutor - The FilterChainExecutor that will execute the filter chain that has been registered
    * intentHandlerManager - The IntentHandlerManager being used by SkillVC to manage Intent Handlers
    * sessionHandlerManager - The SessionHandlerManager being used by SkillVC to manage Session Handlers
    * logLevel - SkillVC uses [Winston](https://github.com/winstonjs/winston) to internal logging.  See the 
    	`SkillVCLogger` object for configuration options
* appSession - A `map` that is created when SkillVC is initialized, lives for the life of SkillVC, and can be used to
        store any objects that you want to make avaliable to other objects
* callback - Has `success` and `failure` functions to be used by Intent Handlers to return Responses and continue SkillVC execution
* filterChainCallback - Has `success` and `failure` functions to be used by Filters to continue SkillVC execution
* session - A `map` that is created on every intent event and can be used to store any objects that you want to make
		avaliable to other objects


### Intent Handlers
-----
Intent Handlers are the main objects for your skill and handle requests sent by Alexa to your skill.  When an intent
is mapped to an utterance by Alexa and then sent to your Lambda function configured with SkillVC, SkillVC will
execute the Intent Handler registerd for the executed intent.

#### Mapping to an Intent
SkillVC can map Alexa intent events to Intent Hanlder objects in a few ways:
* By list provided from getIntentsList()
* By Filename

**By list provided from getIntentsList()**
If the Intent Handler you have created implements the function `getIntentsList()` and returns an array of
intent names that match the names registered in your intent list in developer.amazon.com/edw, SkillVC will
invoke that specific Intent Handler for each of the intents returned byt the function.

Example:
```
MyIntentObject.prototype.getIntentsList = function() {
	return ['HelloWorldIntent', 'GoodByeIntent'];
}
```
would execute MyIntentObject for HelloWorldIntent and GoodByeIntent events

**By Filename**
If your Intent Handler does not implement `getIntentsList()` then SkillVC will use the name of the file (case sensitive)
as the intent name.

So, if you name your file HelloWorldIntent.js, SkillVC will use that object when the HelloWorldIntent event occurs.

#### Executing
Objects registered as Intent Handlers must implement the `handleIntent(svContext)` function.  The `handleIntent(svContext)`
function will be called for whenever the intent the Intent Handler is registered for is invoked by Alexa.

What the `handleIntent(svContext)` method does is entirely up to the developer of the skill, however it must return 
a Response via the `callback` method provided by the svContext, even on error.  Failure to invoke the `callback` method will stop
SkillVC and not allow any downstream filters to execute.

Within the svContext that is passed to the function are a number of object that can be used by the Intent Handler.  Of 
most interest to the Intent Handler are the ResponseManager and callback.

**ResponseManager**
The ResponseManager is SkillVC's object for managing the responses registered with the system.  It allows for retrieval of
responses for use by Intent Handlers.  To get the ResponseManager, access `svContext.appConfig.responseManager'.  Once retrieved, 
an Intent Handler can call the `getResponse('someResponseId')` method of the ResponseManager to return the instance of the Response
that is required.  See the API documentation for more information and the example below for a common use case.

**callback**
As Intent Handlers could be preforming async operations, the use of a callback is required to tell SkillVC to continue
with its execution flow.  The callback to be used can be accessed in `svContext.callback' and has two methods:
* `success` - used if the Intent Handler was successful
* `failure` - used if the Intent Handler had an error or wants to report some other type of issue

The function used by the skill determines which path down the post intent execution filter chain is used, 
`executePost` or `executePostOnError`.  See the Filter section below for more details

An example of a simple Intent Handler that uses the above:
```
function HelloWorldIntentHandler() { }

HelloIntentHandler.prototype.getIntentsList = function() {
	return ['HelloWorldIntent'];
}

HelloIntentHandler.prototype.handleIntent = function(svContext) {
	svContext.callback.success(svContext.appConfig.responseManager.getResponse('hello').renderTell());
}

module.exports = HelloIntentHandler;
```

#### Launch Request
Alexa supports another type of intent event, LaunchRequest, which is executed by Alexa when your skill is invoked
without a specific intent.  An example is when someone says "Alexa, Tell MySkill", but does not give a directive.

In SkillVC, Launch Requests are treated the same as any other intent and are handled by an Intent Handler that maps
to an intent type of "launch".  To register a Intent Handler to execute on Launch Requests you can either:
* Have `getIntentsList()` return an intent name of 'launch'
* Name your file launch.js


### Responses
-----
Responses are defined by individual JSON files (using CoC and Scanning) tha represent the JSON information required by 
Alexa.  To simplify the process of creating a response, SkillVC does not require all Response information, only the fields
you are concerned with (all other information will be filled in for you).

To set any field (or all of them), create a JSON file (or Object if using the Configuration type) with just the fields you want. 

Example:
```
{
 	"outputSpeech": {
        "text": "this is some text"
    }
}
```

This will create a final Response in SkillVC with:
```
{
    outputSpeech: {
        type: 'PlainText',
        text: 'this is some text'
    },
    card: {
        type: 'Simple',
        title: '',
        content: ''
    },
    reprompt: {
        outputSpeech: {
            type: 'PlainText',
            text: ''
        }
    },
    shouldEndSession: true
};
```

#### Response Object
Once loaded into SkillVC, the response itself is represented as a Response object.  The Response object is a builder object that 
allows for the continued manipulate of the response as well as the final rendering of the JSON for use by Alexa via the
`renderAsk()` or 'renderTell()' functions of the response.  See the API documentation for more information.

#### Handlebars
By default, SkillVC ships with support for using [Handlebars](http://handlebarsjs.com/) in your Responses.  This is provide
the ability to do robust variable replacement within a Response.

To leverage Handlebars in a response, first use the Handlebars [expressions](http://handlebarsjs.com/expressions.html) in your Response:
```
{
 	"outputSpeech": {
		"text" : "{{subject}}. From {{date start}} to {{date end}} at {{location location}}."
	}
}
```

To do the actual variable replacement, pass a `map` when rendering a response that has the key as the placeholder 
('subject' in the above example) and the value you want to replace it with as the value in the `map`.

SkillVC also supports Handlebars [helpers](http://handlebarsjs.com/block_helpers.html) but allows for full object usage in
place of just function support.  This allows your helpers to have more state as well as be more easily externally 
configurable.

Using the 'date' example above, you would create an object that implements Formatter (function format(value)) and register 
it like so:
```
var dateFormat = require('dateformat');

function CalendarDateFormatter(options) {
	this._format = "dddd, mmmm dS, yyyy, h:MM:ss TT";
};

/**
 * Required method
 * 
 * @param {String} value The value to use in the formatting
 * @return {String} The final formatted string
 */
CalendarDateFormatter.prototype.format = function(value) {
	return dateFormat(value, this._format);
};
```

You would then register the formatter with the Response:
```
responseManager.getResponse('theResponseIWant').getFormatterManager().addFormatter(
	'date' : new CalendarDateFormat()
);
```

Whenever you use the response it will have the formatter registered with it and will use it when doing the variable replacement
in the response

### Session Handlers
Session Handlers are objects that can be registered for when a session is opened or closed.  These objects can do
whatever the developer chooses and have full access to the svContext.

The location of the session object provided by Alexa is `svContext.lambda.context.session`.  Also, to allow for additional
options, SkillVC provides a new `map` for every skill request at `svContext.session` if developers want 
another session outside of what Alexa provides.

To create a Session Handler an object must implement two functions:
* `sessionStart(svContet)` - Called when a session is started
* `sessionEnd(svContext)` - Called when a session ends

Example:
```
function MySessionHandler() {}

MySessionHandler.prototype.sessionStart = function(svContext) {
	svContext.lambda.context.session = {};  // create a new session
}

// I don't want to do anything..
MySessionHandler.prototype.sessionEnd = function(svContext) {}
```

#### Ordering of execution
SkillVC supports the ability to have more than one Session Handler.  This is useful if you session creation and teardown
has multiple steps that you want to keep in separate objects.

To set the execution order of the Session Handlers you may choose to add the function `getOrder()` to your Session Handler.
`getOrder()` should return the numerical value of the position within the exection order for the Session Handler that has
implemented the function.  If `getOrder()` is not implements, the Session Handler will be added to the execution order
based on the order it was loaded. This means that if you only have one Session Handler, implementing getOrder() is not 
required.

SkillVC does not required that Session Handlers need to be in exact numerical order. For instance, you can have one
Session Handler set to order position 1 and the next at 5 to allow some room for future objects.

Example:
```
function MySessionHandler() {}

MySessionHandler.prototype.getOrder = function() {
	return 3;
}
```
```
function MyOtherSessionHandler() {}

MyOtherSessionHandler.prototype.getOrder = function() {
	return 1;
}
```

In the above example, SkillVC would execute `MyOtherSessionHandler` before `MySessionHandler`

### Filters
-----
Filters in SkillVC are similar to Servlet Filters in the Java world.  They are objects that can be registered and executed
before and after the execution of an Intent Handler.  Filter are very handy for things such as database connection setup
and teardown, post manipulation of Intent Handler results, or other functionality you wish to execute regardless of the
intent that Alexa is invoking.

Filters following a loose [Intercepting Filter Pattern](https://en.wikipedia.org/wiki/Intercepting_filter_pattern)
and can execute before and/or after an Intent Handler has been executed and can implement any (or all) 
of the following functions:
* `executePre(svContext)` - Called before an Intent Handler is executed
* `executePreOnError(svContext)` - Called before an Intent Handler is executed and an error occurred
* `executePost(svContext)` - Called after an Intent Handler as executed
* `executePostOnError(svContext)` - Called after an Intent Handler is executed and an error occurred

**callback**
As Filters could be preforming async operations, the use of a callback is required to tell SkillVC to continue
with its execution flow.  The callback to be used can be accessed in `svContext.filterChainCallback' and has two methods:
* `success` - used if the Filter was successful
* `failure` - used if the Filter had an error or wants to report some other type of issue

Example:
```
function DBSetupFilter() {}

DBSetupFilter.prototype.executePre = function(svContext) {
	// do what is required to setup the connect
	// place it in the context for IntentHandlers (or other objects) to use
	svContext.session.myDbConn = the db.

	// continue the chain so SkillVC can execute the next step
	svContext.filterChainCallback.success();
}

DBSetupFilter.prototype.executePost = function(svContext) {
	//shutdown the db conn
	svContext.session.myDbConn = null;

	// continue the chain so SkillVC can execute the next step
	svContext.filterChainCallback.success();
}

```
#### Ordering of execution
SkillVC supports the ability to have more than one Filter.  This is useful if you want to have filters to have distinct
functionality.  

To set the execution order of the Filters you may choose to add the function `getOrder()` to your SFilter.
`getOrder()` should return the numerical value of the position within the exection order for the Filter that has
implemented the function.  If `getOrder()` is not implements, the Filter will be added to the execution order
based on the order it was loaded. This means that if you only have one Filter, implementing getOrder() is not 
required.

SkillVC does not required that Filter need to be in exact numerical order. For instance, you can have one
Filter set to order position 1 and the next at 5 to allow some room for future objects.

Example:
```
function MyFilter() {}

MyFilter.prototype.getOrder = function() {
	return 3;
}
```
```
function MyOtherFilter() {}

MyOtherFilter.prototype.getOrder = function() {
	return 1;
}
```

### Advanced Configuration
-----
Coming soon, if someone asks for it

## Example
-----

### Hello World
The following example (which shows that SkillVC may be overkill for simple skills) demonstrated what is required
for a simple hello world skill in SkillVC.  The following example uses CoC to make things as simple as possible.

**/responses/hello.json**
```
{
 	"outputSpeech": {
        "text": "Hello {{name}}! How are you?"
    }
}
```

**/intents/HelloIntent.js**
```
function HelloIntentHandler() { 
}

HelloIntentHandler.prototype.handleIntent = function(svContext) {
	svContext.callback.success(
		svContext.appConfig.responseManager.getResponse('hello').renderTell(
			{ 'name' : 'Sloan'}
		)
	);
}

module.exports = HelloIntentHandler;
```

**/index.js**
```
var skillVC = require('skillvc').factory.createfromDirectory();

exports.handler = function(event, context) {
	SkillVC.handler(event, context);
}
```

In your intents definition in developer.amazon.com:
```
{
  "intents": [
    { "intent": "HelloIntent"}
   ]
}
```

## License
-----
SkillVC is copyright (c) 2016-present Sloan Seaman <sloan@pobox.com>.

SkillVC is free software, licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).