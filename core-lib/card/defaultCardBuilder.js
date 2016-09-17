var Card = require('./card.js');
var deepExtend = require('deep-extend');

const cardFormat = {
    outputSpeech: {
        type: 'PlainText',
        text: ''
    },
    card: {
        type: 'Simple',
        title: '',
        content: ''
    },
    reprompt: {
        outputSpeech: {
            type: 'PlainText',
            text: ''
        }
    },
    shouldEndSession: true
};

/**
 * Builder to build a card 
 *
 * Allows only the sections of the card that you care about to be set and provides defaults for everything else
 */
function DefaultCardBuilder() {
    this._cardJSON = '';
    this._cardFormatterManager = null;
    this._cardId = null;
}

/**
 * Sets the FormatterManager of the card
 * 
 * @param  {FormatterManager} formatterManager The FormatterManager for use with the card
 * @return {CardBuilder}      The instance of the CardBuilder
 */
DefaultCardBuilder.prototype.withFormatterManager = function(formatterManager) {
    this._cardFormatterManager = formatterManager;
    return this;
}

/**
 * Sets the id of the card
 * 
 * @param  {String} cardId The id of the card
 * @return {CardBuilder}      The instance of the CardBuilder
 */
DefaultCardBuilder.prototype.withCardId = function(cardId) {
    this._cardId = cardId;
    return this;
}

/**
 * The passed in JSON will be merged with a card definition 
 * 
 * @param  {Object} json JSON that matches the parts of a card definition that is to be set
 * @return {CardBuilder}      The instance of the CardBuilder
 */
DefaultCardBuilder.prototype.withJSON = function(json) {
	this._cardJSON = deepExtend(cardFormat, json);
	return this;
}

/**
 * The passed in String will converted to JSON and merged with a card definition 
 * 
 * @param  {String} string String that when converted to JSON matches the parts of a card definition that is to be set
 * @return {CardBuilder}      The instance of the CardBuilder
 */
DefaultCardBuilder.prototype.withString = function(string) {
	this._cardJSON = deepExtend(cardFormat, JSON.parse(string));
	return this;
}

/**
 * Builds the final card based on all of the mergining
 * 
 * @return {Object} JSON that represents the card
 */
DefaultCardBuilder.prototype.build = function() {
	return new Card(this._cardId, this._cardJSON, this._cardFormatterManager);
}

module.exports = DefaultCardBuilder;