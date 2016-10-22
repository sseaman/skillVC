var RequireTest = require('./test/requireTest.js');

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-eslint');
	grunt.option('force', true); // for es-lint
 
	grunt.initConfig({
		eslint: {
			options: {
				config: 'eslintrc.js'
				// ignorePath : './.eslintignore',
				// ignore : true
			},
			target: ['.']
		}
	});

	grunt.registerTask('default', ['eslint']);

	grunt.registerTask('requireTest', 'Checks to ensure code works when "require()d"', function() {
		this.async();
		var rt = new RequireTest();
		rt.compile('.', ['.js'], {
			"no_console" : true,
			"log_level"  : "none",
			"skip_dirs"  : ["test", "docs", "node_modules"]
		});
	});

	grunt.registerTask('build', ['eslint', 'requireTest']);
};