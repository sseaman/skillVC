/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Interface for classes that can build a card
 *
 * @interface CardBuilder
 */

/**
 * Sets the FormatterManager of the card
 *
 * @function
 * @name  CardBuilder#withFormatterManager
 * @param  {FormatterManager} formatterManager The FormatterManager for use with the card
 * @return {CardBuilder}      The instance of the CardBuilder
 */

/**
 * Sets the id of the card
 *
 * @function
 * @name  CardBuilder#withCardId
 * @param  {String} cardId The id of the card
 * @return {CardBuilder}      The instance of the CardBuilder
 */

/**
 * The passed in JSON will be merged with a card definition 
 *
 * @function
 * @name  CardBuilder#withJSON
 * @param  {Object} json JSON that matches the parts of a card definition that is to be set
 * @return {CardBuilder}      The instance of the CardBuilder
 */

/**
 * The passed in String will converted to JSON and merged with a card definition 
 *
 * @function
 * @name  CardBuilder#withString
 * @param  {String} string String that when converted to JSON matches the parts of a card definition that is to be set
 * @return {CardBuilder}      The instance of the CardBuilder
 */

/**
 * Builds the final card based on all of the mergining
 *
 * @function
 * @name CardBuilder#build
 * @return {Object} JSON that represents the card
 */
