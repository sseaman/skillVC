module.exports = {
    "extends": "eslint:recommended",
    "parserOptions" : {
        "ecmaVersion" : 6,
        "sourceType" : "module",
        "ecmaFeatures" : {
            "impliedStrict" : true
        }
    },
    "env": {
        "node": true
    },
    "rules":{
        "eqeqeq" : 2,
        "no-console" : 0,
        "no-alert" : 2,
        "no-eq-null" : 2,
        "no-implied-eval" : 2,
        "semi" : 2, 
        "valid-jsdoc" : [ 2, { "requireReturn": false } ]
    },
    "ignorePath" : "./.eslintignore"
};