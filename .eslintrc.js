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
        "no-console" : 0,
        "semi" : 2
    }
};