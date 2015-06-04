module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
  grunt.loadNpmTasks('grunt-contrib-coffee');

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
    },
    coffee: {
      coffee_to_js: {
        options: {
          sourceMap: true
        },
        expand: true,
        flatten: false,
        cwd: "app/client",
        src: ["**/*.coffee"],
        dest: 'app/client',
        ext: ".js"
      }
    }
  });

  grunt.registerTask('default', ['sass', 'coffee']);
}
