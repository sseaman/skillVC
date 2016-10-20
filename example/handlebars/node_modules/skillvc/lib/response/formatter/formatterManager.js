/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can manager Formatters
 *
 * @interface FormatterManager
 */

/**
 * Sets the FormatterManager of the response
 *
 * @function
 * @name  ResponseBuilder.withFormatterManager
 * @param  {FormatterManager} formatterManager The FormatterManager for use with the response
 * @return {ResponseBuilder}      The instance of the ResponseBuilder
 */

/**
 * Returns the formatter stored under the formatterId
 *
 * @function
 * @name  FormatterManager#getFormatter
 * @param  {String} formatterId The Id of the formatter to return
 * @return {Formatter} The formatter, null if not found;
 */

/**
 * Adds formatters (any object that has .format(string) and returns a string)
 * 
 * @function
 * @name  FormatterManager#addFormatters
 * @param {Object.<string, Formatter>} formatterMap Map of formatters where the key is the id of the formatter (what will match in the { })
 *                           and the value is the Formatter object that implements .format(value) and returns a string
 */

/**
 * Formats everything in the passed in string.
 *
 * This does so by looking for any {id} in the string, where id is some text, and matching
 * the id to an id the formatterMap map and valuesMap.
 *
 * The formatter found by the id is called using the value found in the valuesMap
 *
 * @function
 * @name  FormatterManager#format
 * @param  {String} string    The string to format that contatins N number of {someString}
 * @param  {Object.<string, Object>} valuesMap The map that contains values where the key is equal to someString
 * @return {String}           A new string with all the values formatted and replaced
 */
