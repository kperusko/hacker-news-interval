'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js', '!test/coverage/**', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/contrib/**/*.js', '!packages/contrib/**/node_modules/**'],
};

module.exports = function(grunt) {

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),	  
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      test: {
        NODE_ENV: 'test',
		src: '.env'
      },
	  build: {
		NODE_ENV: 'production'
	  }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  /**
   * Default Task
   */
  grunt.hook.push('concurrent', 9999);
  if (process.env.NODE_ENV === 'production') {	  
    grunt.hook.push('uglify', 200);
  } else {
    grunt.hook.push('jshint', -200);	  
  }

  //Default task.
  grunt.registerTask('default', ['hook']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);

  // Heroku deployment
  grunt.registerTask('heroku:production', ['uglify']);
};
