/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var DefaultFilenameFormatter = require ('./defaultFilenameFormatter.js');

/**
 * Formats/Parses a file that has the format: itemId.json
 *
 * @constructor
 * @extends {DefaultFilenameFormatter}
 * @param {Object} [options] Options for use in the formatter
 */
function DefaultJSONFilenameFormatter(options) { 
	/*eslint no-unused-vars: ["error", { "args": "none" }]*/
	DefaultFilenameFormatter.apply(this, 
		[ { 'suffix' : 'json' } ] );
}

DefaultJSONFilenameFormatter.prototype = Object.create(DefaultFilenameFormatter.prototype);
DefaultJSONFilenameFormatter.prototype.constructor = DefaultJSONFilenameFormatter;

module.exports = DefaultJSONFilenameFormatter;