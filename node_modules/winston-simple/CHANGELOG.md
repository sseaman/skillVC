### v1.0.8 - (2016-11-19)

#### Bug Fixes
* Was attempting to add console when it may already exists, which threw a Winston error 

### v1.0.7 - (2016-11-06)

#### Bug Fixes
* In Lambda or multi-object, complex systems, the global setting of levels wasn't properly applied if it had never been set before.

### v1.0.6 - (2016-10-26)

#### Bug Fixes
* Log level not being adhered to  
    Setting the log level for classes not yet set was not working due to using 'this.' on a object level variable

### v1.0.5 - (2016-10-21)

#### Bug Fixes
* Error when no log level specified  
	If winston-simple was invoked without any log level being set via ```setLevels``` there were multiple
	null exceptions within the code.  This has been fixed and ```winston-simple``` will now simply not log
	if no levels are set