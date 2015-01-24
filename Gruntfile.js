'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js', '!test/coverage/**', '**/*.js',
    '!node_modules/**'
  ],
};

module.exports = function (grunt) {

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
    jsbeautifier: {
      modify: {
        src: paths.js,
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', '*.js', ],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
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

  // load NPM tasks
  require('load-grunt-tasks')(grunt);

  /**
   * default Task
   */
  grunt.hook.push('concurrent', 9999);
  if (process.env.NODE_ENV === 'production') {
    grunt.hook.push('uglify', 200);
  } else {
    grunt.hook.push('jshint', -200);
  }

  // default task.
  grunt.registerTask('default', ['hook']);

  // test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);

  // 
  grunt.registerTask('clean', [
    'jsbeautifier:modify',
    'jshint'
  ]);

  // verify to check that code is formatted and passes JSHint:	
  grunt.registerTask('verify', [
    'jsbeautifier:verify',
    'jshint'
  ]);

  // Heroku deployment
  grunt.registerTask('heroku:production', ['uglify']);
};
