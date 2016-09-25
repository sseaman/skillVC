/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultFilenameFormatter = require ('./defaultFilenameFormatter.js');

/**
 * Formats/Parses a file that has the format: itemId.js
 *
 * @constructor
 * @extends {DefaultFilenameFormatter}
 */
function DefaultJSFilenameFormatter() { 
	DefaultFilenameFormatter.apply(this, [
		{ 'suffix' : 'js'} ]);
}

DefaultJSFilenameFormatter.prototype = Object.create(DefaultFilenameFormatter.prototype);
DefaultJSFilenameFormatter.prototype.constructor = DefaultJSFilenameFormatter;

module.exports = DefaultJSFilenameFormatter;