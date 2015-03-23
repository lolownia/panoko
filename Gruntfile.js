module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
    
    grunt.initConfig({
	sass: {
            options: {
		sourceMap: true
            },
            dist: {
		files: {
                    'app/client/panoko.css': 'app/client/panoko.scss'
		}
            }
	}
    });
    
    grunt.registerTask('default', ['sass']);
}
