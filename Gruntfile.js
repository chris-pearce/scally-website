'use strict';

module.exports = function(grunt) {

  // Show elapsed time after tasks run
  require('time-grunt')(grunt);

  // Load all Grunt tasks
  require('jit-grunt')(grunt);

    grunt.initConfig({

      app: {
        app:      'app',
        dist:     'dist',
        baseurl:  ''
      },

      watch: {

        // ***************************************************************** //
        // SASS COMPILATION & AUTOPREFIXER
        // ***************************************************************** //
        sass: {
          files: ['<%= app.app %>/_assets/scss/**/*.{scss,sass}'],
          tasks: ['sass:server', 'autoprefixer']
        },

        // ***************************************************************** //
        // MINIFY JS
        // ***************************************************************** //
        scripts: {
          files: ['<%= app.app %>/_assets/js/**/*.{js}'],
          tasks: ['uglify']
        },

        // ***************************************************************** //
        // IMAGES
        // ***************************************************************** //
        images: {
            files: ['<%= app.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'],
            tasks: ['copy:server']
        },

        // ***************************************************************** //
        // JEKYLL TASKS WITH LIVE-RELOAD
        // ***************************************************************** //
        jekyll: {
          files: ['<%= app.app %>/**/*.{html,yml,md,mkd,markdown}'],
          tasks: ['jekyll:server']
          },
          livereload: {
            options: {
              livereload: '<%= connect.options.livereload %>'
            },
            files: [
              '.jekyll/**/*.{html,yml,md,mkd,markdown}',
              '.tmp/<%= app.baseurl %>/css/*.css',
              '.tmp/<%= app.baseurl %>/js/*.js',
              '.tmp/<%= app.baseurl %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
            ]
          }
        },

        // ***************************************************************** //
        // CONNECT: LOCAL SERVER SETUP INC. LIVE-RELOAD
        // ***************************************************************** //
        connect: {
          options: {
            port: 9000,
            livereload: 35729,
            // Change this to '0.0.0.0' to access the server from outside
            hostname: 'localhost'
          },
          livereload: {
            options: {
              open: {
                target: 'http://localhost:9000/<%= app.baseurl %>'
              },
              base: [
                '.jekyll',
                '.tmp',
                '<%= app.app %>'
              ]
            }
          },
          dist: {
            options: {
              open: {
                target: 'http://localhost:9000/<%= app.baseurl %>'
              },
              base: [
                '<%= app.dist %>',
                '.tmp'
              ]
            }
          }
        },

        // ***************************************************************** //
        // CLEAN FILES & FOLDERS
        // ***************************************************************** //
        clean: {
          server: [
            '.jekyll',
            '.tmp'
          ],
          dist: {
            files: [{
              dot: true,
              src: [
                '.tmp',
                '<%= app.dist %>/*',
                '!<%= app.dist %>/.git*'
              ]
            }]
          }
        },

        // ***************************************************************** //
        // JEKYLL TASKS
        // ***************************************************************** //
        jekyll: {
          options: {
            config: '_config.yml,_config.build.yml',
            src: '<%= app.app %>'
            },
            dist: {
              options: {
                dest: '<%= app.dist %>/<%= app.baseurl %>',
              }
            },
            server: {
              options: {
                config: '_config.yml',
                dest: '.jekyll/<%= app.baseurl %>'
              }
            }
          },

          // *************************************************************** //
          // MINIFY HTML
          // *************************************************************** //
          htmlmin: {
            dist: {
              options: {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                minifyJS: true,
                minifyCSS: true
              },
              files: [{
                expand: true,
                cwd: '<%= app.dist %>/<%= app.baseurl %>',
                src: '**/*.html',
                dest: '<%= app.dist %>/<%= app.baseurl %>'
              }]
            }
          },

          // *************************************************************** //
          // MINIFY JS
          // *************************************************************** //
          uglify: {
            server: {
              options: {
                mangle: false,
                beautify: true
              },
              files: {
                '.tmp/<%= app.baseurl %>/js/scripts.js': ['<%= app.app %>/_assets/js/**/*.js']
              }
            },
            dist: {
              options: {
                compress: true,
                preserveComments: false,
                report: 'min'
              },
              files: {
                '<%= app.dist %>/<%= app.baseurl %>/js/scripts.js': ['<%= app.app %>/_assets/js/**/*.js']
              }
            }
        },

          // *************************************************************** //
          // SASS COMPILATION
          // *************************************************************** //
          sass: {
            server: {
              options: {
                sourceMap: false
              },
              files: [{
                expand: true,
                cwd: '<%= app.app %>/_assets/scss/',
                src: '**/*.{scss,sass}',
                dest: '.tmp/<%= app.baseurl %>/css',
                ext: '.css'
              }]
            },
            dist: {
              options: {
                style: 'compressed',
                sourceMap: false
              },
              files: [{
                expand: true,
                cwd: '<%= app.app %>/_assets/scss',
                src: '**/*.{scss,sass}',
                dest: '<%= app.dist %>/<%= app.baseurl %>/css',
                ext: '.css'
              }]
            }
          },

          // *************************************************************** //
          // REMOVE UNNEEDED CSS
          // *************************************************************** //
          uncss: {
            options: {
              htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
              report: 'gzip'
            },
            dist: {
              src: '<%= app.dist %>/<%= app.baseurl %>/**/*.html',
              dest: '.tmp/<%= app.baseurl %>/css/style.css'
            }
          },

          // *************************************************************** //
          // AUTOPREFIXER
          // *************************************************************** //
          autoprefixer: {
            options: {
              browsers: ['last 2 versions']
            },
            server: {
              files: [{
                expand: true,
                cwd: '.tmp/<%= app.baseurl %>/css',
                src: '**/*.css',
                dest: '.tmp/<%= app.baseurl %>/css'
              }]
            },
            dist: {
              files: [{
                expand: true,
                cwd: '<%= app.dist %>/<%= app.baseurl %>/css',
                src: '**/*.css',
                dest: '<%= app.dist %>/<%= app.baseurl %>/css'
              }]
            }
        },

          // *************************************************************** //
          // LOAD CRITICAL CSS
          // *************************************************************** //
          critical: {
            dist: {
              options: {
                base: './',
                css: ['.tmp/<%= app.baseurl %>/css/style.css'],
                minify: true,
                width: 320,
                height: 480
              },
              files: [{
                expand: true,
                cwd: '<%= app.dist %>/<%= app.baseurl %>',
                src: ['**/*.html'],
                dest: '<%= app.dist %>/<%= app.baseurl %>'
              }]
            }
          },

          // *************************************************************** //
          // MINIFY CSS
          // *************************************************************** //
          cssmin: {
            dist: {
              options: {
                keepSpecialComments: 0,
                check: 'gzip'
              },
              files: [{
                expand: true,
                cwd: '.tmp/<%= app.baseurl %>/css',
                src: ['*.css'],
                dest: '.tmp/<%= app.baseurl %>/css'
              }]
            }
          },

          // *************************************************************** //
          // OPTIMISE IMAGES
          // *************************************************************** //
          imagemin: {
            options: {
              progressive: true,
              cache: false,
              optimizationLevel: 4
            },
            dist: {
              files: [{
                expand: true,
                cwd: '<%= app.app %>/img',
                src: ['**/*.{png,jpg,jpeg,gif}'],
                dest: '<%= app.dist %>/<%= app.baseurl %>/img'
              }]
            }
          },

          // *************************************************************** //
          // MINIFY SVG
          // *************************************************************** //
          svgmin: {
            dist: {
              files: [{
                expand: true,
                cwd: '<%= app.app %>/img',
                src: '**/*.svg',
                dest: '<%= app.dist %>/<%= app.baseurl %>/img'
              }]
            }
          },

          // *************************************************************** //
          // COPY FILES AND FOLDERS
          // *************************************************************** //
          copy: {
            dist: {
              files: [{
                expand: true,
                dot: true,
                cwd: '.tmp/<%= app.baseurl %>',
                src: [
                  'css/**/*',
                  'js/**/*'
                ],
                dest: '<%= app.dist %>/<%= app.baseurl %>'
              }]
            }
          },

          // *************************************************************** //
          // GIT COMMIT AND PUSH TO GH-PAGES
          // *************************************************************** //
          buildcontrol: {
            dist: {
              options: {
                dir: '<%= app.dist %>/<%= app.baseurl %>',
                remote: 'git@github.com:chris-pearce/scally-website.git',
                branch: 'gh-pages',
                commit: true,
                push: true,
                connectCommits: false
              }
            }
          }
        });

      // ***************************************************************** //
      // DEFINE TASKS
      // ***************************************************************** //
      grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
          return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
          'clean:server',
          'jekyll:server',
          'sass:server',
          'autoprefixer:server',
          'uglify:server',
          'connect:livereload',
          'watch'
        ]);
      });

      // ***************************************************************** //
      // REGISTER TASKS
      // ***************************************************************** //

      // Server
      grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
      });

      // Build
      grunt.registerTask('build', [
        'clean:dist',
        'jekyll:dist',
        'imagemin',
        'svgmin',
        'sass:dist',
        //'uncss',
        'autoprefixer:dist',
        'cssmin',
        'uglify:dist',
        'critical',
        'htmlmin'
    ]);

      // Deploy
      grunt.registerTask('deploy', [
        'build',
        'copy',
        'buildcontrol'
      ]);

      // Default (serve)
      grunt.registerTask('default', [
        'serve'
      ]);
};