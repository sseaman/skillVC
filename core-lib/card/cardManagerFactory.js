var CardProviderByDirectory = require ('./provider/cardProviderByDirectory.js');
var CardProviderByFile = require ('./provider/cardProviderByFile.js');
var CardProviderByMap = require ('./provider/cardProviderByMap.js');
var HandlebarsFormatterManager = require('./formatter/handlebarsFormatterManager.js');
var DefaultCardBuilder = require('./defaultCardBuilder.js');
var DefaultCardManager = require('./defaultCardManager.js');

/**
 * Factory that can create CardManagers depending on the specific needs of the skill
 */
function CardManagerFactory() {
	
}

CardManagerFactory.createHandlebarEnabledByDirectory = function(directory) {
	var cardProvider = new CardProviderByDirectory(directory,
		{ 
			cardBuilder : new DefaultCardBuilder()
				.withFormatterManager(new HandlebarsFormatterManager())
		}
	);
	return new DefaultCardManager([cardProvider]);
}

CardManagerFactory.createHandlebarEnabledByFile = function(file) {
	var cardProvider = new CardProviderByFile(file,
		{ 
			cardBuilder : new DefaultCardBuilder()
				.withFormatterManager(new HandlebarsFormatterManager())
		}
	);
	return new DefaultCardManager([cardProvider]);
}

CardManagerFactory.createHandlebarEnabledByMap= function(map) {
	var cardProvider = new CardProviderByMap(map,
		{ 
			cardBuilder : new DefaultCardBuilder()
				.withFormatterManager(new HandlebarsFormatterManager())
		}
	);
	return new DefaultCardManager([cardProvider]);
}

CardManagerFactory.createByDirectory = function(directory) {
	return new DefaultCardManager([new CardProviderByDirectory(directory)]);
}

CardManagerFactory.createByFile = function(file) {
	return new DefaultCardManager([new CardProviderByFile(file)]);
}

CardManagerFactory.createByMap = function(map) {
	return new DefaultCardManager([new CardProviderByMap(map)]);
}

module.exports = CardManagerFactory;