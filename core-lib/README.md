https://github.com/github/markup
https://guides.github.com/features/wikis/

https://github.com/jsdoc2md/jsdoc-to-markdown


# SkillVC

A View / Controller (no Model) framework for quickly creating custom skills for [Alexa](https://developer.amazon.com/alexa). 
Choose either Convention-over-Configuration, Configuration, or Scan approaches to the configuration and execution of your skill.

## Table of Contents
1. Installation
2. Usage
    1. Configuration Types
        1. Convention-over-Configuration
        2. Scanning
        3. Congiuration
    2. Cards
        1. Handlebars
    3. Intent Handlers
    4. Session Handlers
    5. Filters
    6. Advanced Configuration
4. Example
5. License

## Installation

## Usage
SkillVC is designed to be very easy to use out of the box, but also allow for a high degree of configuration.  Please
note that at this time SkillVC only supports **custom** skill types, but this will be expanded if there are enough requests.

### Configuration Types
SkillVC is designed to be highly configurable and allows for multiple configuration setups as well as providing multiple
points to override internal execution to provide the most customizable framework possible.  When first starting out
with SkillVC you will want to choose the configuration type you want.

#### Convention-over-Configuration
[Convention-over-Configuration (CoC)](https://en.wikipedia.org/wiki/Convention_over_configuration)) is the simpliest and most 
straightforward way to use SkillVC as objects are simply placed in specific directories and SkillVC does the rest.

To leverage CoC, first create the following directories in your project:
* /cards
* /filters
* /intents
* /sessionHandlers

In each directory you will place the corresponding objects for your skill.  That is, cards go in /cards, objects that handle
intents go in /intents, and so on. See the individual sections below on how these objects are formatted and their required 
methods.

Once you have the objects you want in their correct directories, all that is needed is to have SkillVC 
handle all of the requests to your skill.  For CoC, with the default directory structure listed above, create an index.js that
has the following:
```
var SkillVCFactory = require('./core-lib/skillVCFactory.js');

exports.handler = function(event, context) {
	SkillVCFactory.createfromDirectory().handler(event, context);
}
```

#### Scanning
Scanning searches a defined set of files and, based on reading (introspection) each file, classifies them as cards,
filters, intents, or sessionHanlder.  Scanning had an advantage over CoC because it allows a single javascript object
to act as both a filter, intent, and sessionHandler (cards are still required to be separate files).  However, as
each object must be full loaded and introspected, it can take SkillVC longer to initialize when compared to CoC

For Scanning, create an index.js that has the following:
```
var SkillVCFactory = require('./core-lib/skillVCFactory.js');

exports.handler = function(event, context) {
	SkillVCFactory.createFromScan([
		'locationAndNameOfFileToScan',
		'locationAndNameOfFileToScan',
		'and so on'
	 	]).handler(event, context);
}
```

#### Configuration
Configuration is the last built in type and is the most complicated form of initialization.  It provide
the most out-of-the-box customization of how SkillVC works and, if done correctly, can be the fastest of the configuration
methods. To use configuration, you define a Map ({}) that has the cards, filters, intents, and sessionHandlers and provide that
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
	cards : {}
}
```
**Note:** This is the same format that the Scanning configuration uses internally when loading objects

### Cards
Cards are defined by individual JSON files (using CoC and Scanning) tha represent the JSON information required by 
Alexa.  To simplify the process of creating a card, SkillVC does not require all Card information, only the fields
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

This will create a final Card in SkillVC with:
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

#### Handlebars
By default, SkillVC ships with support for using [Handlebars](http://handlebarsjs.com/) in your Cards.  This is provide
the ability to do robust variable replacement within a Card.

To leverage Handlebars in a card, first use the Handlebars [expressions](http://handlebarsjs.com/expressions.html) in your Card:
```
{
 	"outputSpeech": {
		"text" : "{{subject}}. From {{date start}} to {{date end}} at {{location location}}."
	}
}
```

To do the actual variable replacement, pass a Map when rendering a card that has the key as the placeholder 
('subject' in the above example) and the value you want to replace it with as the value in the map.

SkillVC also supports Handlebars [helpers](http://handlebarsjs.com/block_helpers.html) but allows for full object usage in
place of just function support.  This allows your helpers to have more state as well as be more easily externally 
configurable.

Using the 'location' example above, you would create an object that implements Formatter (function format(value)) and register 
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

You would then register the formatter with the Card:
```
cardManager.getCard('theCardIWant').getFormatterManager().addFormatter(
	'location' : new CalendarDateFormat()
);
```

Whenever you use the card it will have the formatter registered with it and will use it when doing the variable replacement
in the card

## Example


## License

SkillVC is copyright (c) 2016-present Sloan Seaman <sloan@pobox.com>.

SkillVC is free software, licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
