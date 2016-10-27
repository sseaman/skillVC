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