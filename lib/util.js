/**
 * @author Sloan Seaman 
 * @copyright 2016 and on
 * @version .1
 * @license https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */
module.exports = {

	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * 
	 * @param {Map} obj1 The first object
	 * @param {Map} obj2 The second object
	 * @returns {Map} A new object based on obj1 and obj2
	 */
	merge : function (obj1,obj2) {
		var obj3 = {};
		for (var attrnameA in obj1) { obj3[attrnameA] = obj1[attrnameA]; }
		for (var attrnameB in obj2) { obj3[attrnameB] = obj2[attrnameB]; }
		return obj3;
	},

	/**
	 * Compresses an array that might have many empty items between entries
	 *
	 * @function
	 * @param {Array.Object} array The array to compress
	 * @returns {Array.Object} The compressed array
	 */
	compressArray : function(array) {
		var newArray = [];
		for (var n = 0; n < array.length; n++) {
			if (array[n]) {
				newArray.push(array[n]);
			}
		}
		return newArray;
	},

	/**
	 * Does a deep copy of an object using JSON stringify and parse
	 * 
	 * @param  {Object} obj The object to copy
	 * @param {Function} filterFunction function to skip things in the deepClone.  
	 *                          Function should be:
	 *                          function(key, value) { ...; return value}
	 * @return {Object} A copy of the passed in object
	 */
	deepClone : function(obj, filterFunction) {
		return (obj) 
			? JSON.parse( (filterFunction) ? JSON.stringify(obj, filterFunction) : JSON.stringify(obj) )
			: null;
	},

	/**
	 * Returns the names of the arguments from a function
	 * 
	 * From: https://davidwalsh.name/javascript-arguments
	 * 
	 * @param  {Function} func The function whose args are to be looked at
	 * @return {Array.String}  The names of the arguments for the function
	 */
	getArgs : function(func) {
		// First match everything inside the function argument parens.
		var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

		// Split the arguments string into an array comma delimited.
		return args.split(',')
			.map(function(arg) {
				// Ensure no inline comments are parsed and trim the whitespace.
				return arg.replace(/\/\*.*\*\//, '').trim();
			})
			.filter(function(arg) {
				// Ensure no undefined values are added.
				return arg;
			});
	},
	
	/**
	 * Loads a file and, if it's an object that can be instantiated, instantiates it.  Otherwise it 
	 * just returns the object.
	 *
	 * This allows the loading of either:
	 * ```
	 * module.exports = {
	 * 		func : function() {}
	 * }
	 * ```
	 * and
	 * ```
	 * function Func() { }
	 *
	 * Func.prototype.meth = function() {
	 * }
	 * ```
	 * and
	 * ```
	 * function Func() { }
	 *
	 * Func.prototype = {
	 * 		meth : function() {
	 * 		}
	 * }
	 * ```
	 * 
	 * @param  {String} file The file to load
	 * @return {Object} The loaded, and possibly instantiated object
	 */
	instantiate : function(file) {
		// got it as at least a map, now see if we can instantiate it
		var obj = require(file);  

		if (this.isFunction(obj)) { // it's got a constructor
			obj = new obj();
		}
		return obj;
	},

	/**
	 * Returns true if the passed in object is a function
	 * 
	 * @param  {Object}  obj The Object to check
	 * @return {Boolean}     true if it is a function, false otherwise
	 */
	isFunction : function(obj) {
		return (typeof obj  === "function"); 
		// var getType = {};
		// return obj && getType.toString.call(obj) === '[object Function]';
	}

};