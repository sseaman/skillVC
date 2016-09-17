module.exports = {

	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * @param obj1
	 * @param obj2
	 * @returns obj3 a new object based on obj1 and obj2
	 */
	merge : function (obj1,obj2) {
	    var obj3 = {};
	    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	    return obj3;
	},

	/**
	 * Does a deep copy of an object using JSON stringify and parse
	 * 
	 * @param  {Object} obj The object to copy
	 * @return {Object}     A copy of the passed in object
	 */
	deepClone : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},

	/**
	 * Returns true if the passed in object is a function
	 * @param  {Object}  obj The Object to check
	 * @return {Boolean}     true if it is a function, false otherwise
	 */
	isFunction : function(obj) {
		return (typeof(obj) == "function"); 
		// var getType = {};
		// return obj && getType.toString.call(obj) === '[object Function]';
	},

	/**
	 * Allops a loop with async functions
	 * See: http://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
	 * 
	 * @param  {[type]}   iterations [description]
	 * @param  {[type]}   func       [description]
	 * @param  {Function} callback   [description]
	 * @return {[type]}              [description]
	 */
	asyncLoop : function(iterations, func, callback) {
	    var index = 0;
	    var done = false;
	    var loop = {
	        next: function() {
	            if (done) {
	                return;
	            }

	            if (index < iterations) {
	                index++;
	                func(loop);

	            } else {
	                done = true;
	                callback();
	            }
	        },

	        idx: function() {
	            return index - 1;
	        },

	        break: function() {
	            done = true;
	            callback();
	        }
	    };
	    loop.next();
	    return loop;
	}

}