/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/** @private */
var CardProviderByDirectory = require ('./provider/cardProviderByDirectory.js');
var CardProviderByFile = require ('./provider/cardProviderByFile.js');
var CardProviderByMap = require ('./provider/cardProviderByMap.js');
var HandlebarsFormatterManager = require('./formatter/handlebarsFormatterManager.js');
var DefaultCardBuilder = require('./defaultCardBuilder.js');
var DefaultCardManager = require('./defaultCardManager.js');

/**
 * Static factory that can create CardManagers depending on the specific needs of the skill
 *
 * @class
 * @constructor
 */
function CardManagerFactory() {
	
}

/**
 * Creates a CardManager that loads cards from a directory and 
 * uses the DefaultCardManager and the HandlebarsFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultCardManager}
 * @see  {@link CardProviderByDirectory}
 * @see  {@link HandlebarsFormatterManager}
 * @param  {String} directory The directory to read the cards from
 * @return {CardManager} The CardManager that will manage the cards
 */
CardManagerFactory.createHandlebarEnabledByDirectory = function(directory) {
	var cardProvider = new CardProviderByDirectory(directory,
		{ 
			cardBuilder : new DefaultCardBuilder()
				.withFormatterManager(new HandlebarsFormatterManager())
		}
	);
	return new DefaultCardManager([cardProvider]);
}

/**
 * Creates a CardManager that loads cards from a file and 
 * uses the DefaultCardManager and the HandlebarsFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultCardManager}
 * @see  {@link CardProviderByFile}
 * @see  {@link HandlebarsFormatterManager}
 * @param  {String} file The file to read the cards from
 * @return {CardManager} The CardManager that will manage the cards
 */
CardManagerFactory.createHandlebarEnabledByFile = function(file) {
	var cardProvider = new CardProviderByFile(file,
		{ 
			cardBuilder : new DefaultCardBuilder()
				.withFormatterManager(new HandlebarsFormatterManager())
		}
	);
	return new DefaultCardManager([cardProvider]);
}

/**
 * Creates a CardManager that loads cards from a map and 
 * uses the DefaultCardManager and the HandlebarsFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultCardManager}
 * @see  {@link CardProviderByMap}
 * @see  {@link HandlebarsFormatterManager}
 * @param  {String} file The map to use
 * @return {CardManager} The CardManager that will manage the cards
 */
CardManagerFactory.createHandlebarEnabledByMap= function(map) {
	var cardProvider = new CardProviderByMap(map,
		{ 
			cardBuilder : new DefaultCardBuilder()
				.withFormatterManager(new HandlebarsFormatterManager())
		}
	);
	return new DefaultCardManager([cardProvider]);
}

/**
 * Creates a CardManager that loads cards from a directory and 
 * uses the DefaultCardManager and the BasicFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultCardManager}
 * @see  {@link CardProviderByDirectory}
 * @see  {@link BasicFormatterManager}
 * @param  {String} directory The directory to read the cards from
 * @return {CardManager} The CardManager that will manage the cards
 */
CardManagerFactory.createByDirectory = function(directory) {
	return new DefaultCardManager([new CardProviderByDirectory(directory)]);
}

/**
 * Creates a CardManager that loads cards from a file and 
 * uses the DefaultCardManager and the BasicFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultCardManager}
 * @see  {@link CardProviderByFile}
 * @see  {@link BasicFormatterManager}
 * @param  {String} file The file to read the cards from
 * @return {CardManager} The CardManager that will manage the cards
 */
CardManagerFactory.createByFile = function(file) {
	return new DefaultCardManager([new CardProviderByFile(file)]);
}

/**
 * Creates a CardManager that loads cards from a map and 
 * uses the DefaultCardManager and the BasicFormatterManager
 *
 * @function
 * @static
 * @see  {@link DefaultCardManager}
 * @see  {@link CardProviderByMap}
 * @see  {@link BasicFormatterManager}
 * @param  {String} file The map to use
 * @return {CardManager} The CardManager that will manage the cards
 */
CardManagerFactory.createByMap = function(map) {
	return new DefaultCardManager([new CardProviderByMap(map)]);
}

module.exports = CardManagerFactory;