/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * 
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var AbstractProviderByAsyncDirectory = require('../abstractProviderByAsyncDirectory.js');
var svUtil = require('../../util.js');
var providerUtil = require('../providerUtil.js');
var fs = require('fs');
var path = require('path');
var events = require('events');
var log = require('winston-simple').getLogger('EventListenerProviderByDirectory');

/**
 * Considering moving IntentHandlers to be based on events
 *
 * @param {String} directory The directory to read
 * @param {Map} [options] The options to use
 */
function EventListenerProviderByDirectory(directory, options) {
	if (!directory) throw Error('directory required');

	AbstractProviderByAsyncDirectory.apply(this, [
		directory, 
		options]);
}

EventListenerProviderByDirectory.prototype = Object.create(AbstractProviderByAsyncDirectory.prototype);
EventListenerProviderByDirectory.prototype.constructor = EventListenerProviderByDirectory;

/**
 * 
 * @param {Map} items Map of the items being processed
 * @param {String} itemId The Id of the item to process
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
EventListenerProviderByDirectory.prototype.processItem = function(items, itemId, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/

	// This gets called if there is a request for a intentHandler before they are all loaded
	// Since intents can declare what they do inside of them, I can't load by the filename and
	// assume that it represents what it can handle.  I need to scan everything.
	var files = fs.readdirSync(this._directory);
	for (var i=0;i<files.length;i++) {
		this.processItems(items, path.resolve(this._directory, files[i]), options);
		if (items[itemId]) break; // found the one we want, stop loading
	}
};

/**
 * Uses node require to load the file.  If the intent is not found this method
 * will favor performance and never look for the file again.
 *
 * @function
 * @param {Map} items Map of the items being processed
 * @param {String} fileName The name of the file being processed
 * @param {Object} options Any options that are being passed to the ItemProcessor (can be null)
 */
EventListenerProviderByDirectory.prototype.processItems = function(items, fileName, options) {
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/

	try {
		var loaded = svUtil.instantiate(path.resolve(process.cwd(), fileName));

		providerUtil.addFunctions(loaded, { 'name' : path.parse(fileName).name });

		var eventEmitter = new events.EventEmitter();
		if (svUtil.isFunction(loaded.registerListener)) {
			loaded.registerListener(eventEmitter);

			var itemNames = eventEmitter.eventNames();
			for (var i=0;i<itemNames.length;i++) {
				//FIXME:  won't handle more than one eventlistener per event
				items[itemNames[i]] = loaded;
				log.info('Loaded event listener '+loaded.getName()+ ' for event '+itemNames[i]);
			}
		}
		else { // it didn't specify an intent list, so make it what the name of the file is
			log.info('Loaded event listener '+loaded.getName()+ ' for event '+path.parse(fileName).name);
		}

		// also store it under the filename just for reference and to ensure Async doesn't attempt to load it again
		items[path.parse(fileName).name] = loaded;

	}
	catch (err) {
		log.error("Error event listener "+path.parse(fileName).base+". Error:"+err.stack);
	}
};

module.exports = EventListenerProviderByDirectory;
