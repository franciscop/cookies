// This builds the library itself
module.exports = function (grunt) {
  // Configuration
  grunt.initConfig({
    jshint: {
      ignore_warning: {
        src: ['Gruntfile.js', 'umbrella.js'],
        options: {
          '-W043': true  // Allow for multiline with \ backslash
        }
      }
    },

    uglify: {
      options: {
        banner: '/* cookies.js ' + grunt.file.readJSON('package.json').version + ' https://github.com/franciscop/cookies.js */\n'
      },
      my_target: {
        files: {
          'cookies.min.js': 'cookies.js'
        }
      }
    },

    semistandard: {
      app: {
        src: [
          '!./test'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'package.js', // To bump versions
          'Gruntfile.js',
          'cookies.js',
          'test/test.js'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },

    mocha_phantomjs: {
      all: './tests.html',
      options: {
        'web-security': false
      }
    },

    bytesize: {
      all: {
        src: [
          'cookies.min.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-semistandard');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-bytesize');

  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('test', ['semistandard', 'mocha_phantomjs']);
  grunt.registerTask('default', ['build', 'test', 'bytesize']);
};
