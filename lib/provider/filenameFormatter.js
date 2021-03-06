/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can parse, format, and validate file formats for use by providers
 * to determine if they should process a file
 *
 * @interface FilenameFormatter
 */

/**
 * Formats the itemId to what it would be resented as a fully qualified file name
 *
 * @function
 * @name  FilenameFormatter#format
 * @param  {String} itemId The id to use
 * @return {String} A fully qualified file name
 */

/**
 * Parses the passed in filename to its individual parts
 *
 * @function
 * @name  FilenameFormatter#parse
 * @param  {String} fileName Parses the file name into its individual components
 * @return {Array.String} The separate parts of the filename broken up by the implementing claessed delimiter
 */

/**
 * Validates if the passed in file name matches the format generated by the implementing class
 *
 * @function
 * @name  FilenameFormatter#isValid
 * @param  {String} fileName The filename to validate
 * @return {Boolean} True if the format matches, false otherwise
 */