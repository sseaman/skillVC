const request = {
	request : {
		intent		: {
			name	: ''
		},
		requestId 	: 'fakeRequestId',
		type		: 'IntentRequest',

	},
	session : {
		application : {
			applicationId	: 'fakeApplicationId'
		},
		sessionId 	: 'fakeSessionId',
		user		: {
			userId 		: 'fakeUserId'
		}, 
		new 		: true
	}
};

/**
 * Tester for testing skills
 *
 * Example:
 * // set where index.js is located
 * var skillTester = new SkillTester('../../index.js');
 * // test the 'hello' intent
 * skillTester.test('hello');
 *  
 * @param {[type]} index  [description]
 * @param {[type]} config [description]
 */
function SkillTester (index, config) {
	this._index = require(index);
}

SkillTester.prototype.test = function(intent, requestOptions, callback) {
	var testCallback = (callback) ? callback : this.logCallback();

	this._index.handler(this.buildRequest(intent, requestOptions), testCallback);
}

SkillTester.prototype.logCallback = function() {
	return {
		succeed : function(result) {
			console.log("SUCCESS: "+JSON.stringify(result));
		},
		fail: function(error) {
			console.log("FAILURE: "+JSON.stringify(error));
		}
	}
}

SkillTester.prototype.buildRequest = function(intent, options) {
	var req = this._deepExtend(request, options); 
	req.request.intent.name = intent;
	return req;
}

	// from https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
SkillTester.prototype._deepExtend = function() {
	    // Variables
	    var de = this;
	    var extended = {};
	    var i = 0;
	    var length = arguments.length;

	    // Merge the object into the extended object
	    var merge = function (obj) {
	        for ( var prop in obj ) {
	            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
	                // property is an object, merge properties
	                if (Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
	                    extended[prop] = de._deepExtend(extended[prop], obj[prop] );
	                } else {
	                    extended[prop] = obj[prop];
	                }
	            }
	        }
	    };

	    // Loop through each object and conduct a merge
	    for ( ; i < length; i++ ) {
	        var obj = arguments[i];
	        merge(obj);
	    }

	    return extended;

	},

module.exports = SkillTester;