# Handlebars Example

An example of using Handlebars and a custom formatter in SkillVC.  See source code for more documentation

## Intents
The randomNumberIntent fields the intent request for RandomNumberIntent.  As the case (r vs R) is different, 
and SkillVC is case-sensitive, randomNumberIntent implements `getIntentsList()` to define what intent
it managers.

It also registers a `Formatter`, numberFormatter, with Handlebars to manipulate an Handlebar
values that have a defined type of `numberFormat`.  Once registered, the numberFormatter will work
with any defined `numberFormat` in the response.

## Responses
randomNumber.json contains a response that uses Handlebars for variable replacement.  
It specifies a `numberFormat` type for the `randomNum` value in the response.