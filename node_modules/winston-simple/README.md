# winston-simple

A simple, log4j style wrapper for [Winston](https://github.com/winstonjs/winston) logging.  Easier to setup 
and use than the default Winston configuration.

## Table of Contents
1. Installation
2. Source / Webpage
3. Usage
    1. Log Levels
    2. Configuration
    3. Log Format
    4. Usage in Code
    5. Customization
4. Example
5. License

## Installation
-----
You can install winston-simple in your project's `node_modules` folder, or you can install it globally.

To install the latest version available on NPM:

    npm install winston-simple

To install the latest development version:

    npm install git+https://github.com/sseaman/winston-simple.git

## Source / Webpage
-----
winston-simple is maintained in GitHub.  For full source to to [GitHub winston-simple](https://github.com/sseaman/winston-simple)

## Usage
-----
winston-simple is a log4j style wrapper for [Winston](https://github.com/winstonjs/winston) logging that supports
per object log level setting, global log level setting, or global disabled logging.  winston-simple uses simple 
map configuration to determine how logging is contolled.

### Log Levels
winston-simples uses the same npm logging levels of [Winston](https://github.com/winstonjs/winston) with one 
addition: `none`, which will disable logging for a specifed object.

The full list of logging levels are:
```{ none, error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }```

### Configuration 
winston-simple uses a map to set the log levels of the objects that you wish to control the logging level.  The
key of the map represents the name of the object.  The value is the level of the logging.  Once the logging level is set
in winston-simple you never need to set it again, but you can modify it at any time and it will apply the changes to the logging 
levels realtime.

### Per Object Configuration

```
{
	"MyObjectName"  : "debug",
	"AnotherObject" : "info",
	and so on
}
```

The above would set the the log level of `MyObjectName` to `debug` and `AnotherObject` to `info`.  All other objects will have logging disabled.

### Global Configuraton
winston-simple supports the idea of global configuration for all objects that wish to do logging.  To enable global logging levels
use the `all` key for the map.  The value is the level of the logging to apply to all object.

```
{
	"all" : "debug"
}
```
The above would set all logging levels for all objects to "debug".

You can also disable logging for all objects by setting the logging levels to:

```
{
	"all" : "none"
}
```

### Combining Global and per object
winston-simple also support a combination of per object and global configuration.  This allow a default log level to be 
set for all object levels but different specific levels for certain objects

Example:
```
{
	"all" 			: "debug",
	"MyObjectName"	: "info"
}
```

### Log Format
winston-simple defaults to the standard [Winston](https://github.com/winstonjs/winston) configuration, but with the 
addition of the Object name as a label.
This results in the following formatted log entry:

```
2016-10-07T19:24:56.995Z - info: [MyObjectName] This is the log message
```

### Usage in Code
To set the log levels used by winston-simple first require the npm package and then set the logging level.
```
var Logger = require('winston-simple);
Logger.setLevels({
	'all' : 'debug',
	'MyObjectName' : 'info'
});
```

You can the use the Logger to get a logger for use in your code:
```
var log = Logger.getLogger('MyObjectName');

log.debug("This is a debug message");
```

### Customization
winston-simple exposes it's underlying [Winston](https://github.com/winstonjs/winston) instance so that you may 
configure winston-simple however you want.  

To retreived the instance, simply call `getWinston()` on your winston-simple instance.  Any changes made to the
returned [Winston](https://github.com/winstonjs/winston) object will be applied to all loggers.

## Example
-----
The following example shows the tightest way to initialize winston-simple.

**/index.js**

```
var log = require('winston-simple').setLevels(
	{
		'all' : 'info',
		'SomeObject' : 'debug'
	}).getLogger("Index");

//some code....
log.info("This will be logged");
log.debug("This will NOT be logged");
```

**/lib/SomeObject.js**
```
var log = require('winston-simple').getLogger('SomeObject');

log.info("This will be logged");
log.debug("This will also be logged because it was configued in index.js");
```

## License
-----
winston-simple is copyright (c) 2016-present Sloan Seaman <sloan@pobox.com>.

winston-simple is free software, licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).