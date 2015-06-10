// @credit
// https://github.com/ozasadnyy/optimized-jekyll-grunt/blob/master/Gruntfile.js

module.exports = function(grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // Setup env vars
      app: {
        source:   'app',
        dist:     'dist',
        jekyll:   '.jekyll',
        temp:     '.tmp'
      },

      // Start `watch`
      watch: {

        // ***************************************************************** //
        // SASS COMPILATION & AUTOPREFIXER
        // ***************************************************************** //
        sass: {
          files: '<%= app.source %>/_assets/scss/**/*.{scss,sass}',
          tasks: [
            'sass:server',
            'autoprefixer'
          ]
        },

        // ***************************************************************** //
        // MINIFY JS
        // ***************************************************************** //
        scripts: {
          files: '<%= app.source %>/_assets/js/**/*.{js}',
          tasks: 'uglify'
        },

        // ***************************************************************** //
        // IMAGES
        // ***************************************************************** //
        images: {
            files: '<%= app.source %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}',
            tasks: 'copy:server'
        },

        // ***************************************************************** //
        // GENERATE JEKYLL SITE
        // ***************************************************************** //
        jekyll: {
          files: '<%= app.source %>/**/*.{html,yml,md,mkd,markdown}',
          tasks: 'jekyll:server'
        },

        // ***************************************************************** //
        // LIVE RELOAD
        // ***************************************************************** //
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= app.jekyll %>/**/*.{html,yml,md,mkd,markdown}',
            '<%= app.temp %>/css/*.css',
            '<%= app.temp %>/js/*.js',
            '<%= app.temp %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
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
                target: 'http://localhost:9000'
              },
              base: [
                '<%= app.jekyll %>',
                '<%= app.temp %>',
                '<%= app.source %>'
              ]
            }
          },
          dist: {
            options: {
              open: {
                target: 'http://localhost:9000'
              },
              base: [
                '<%= app.dist %>',
                '<%= app.temp %>'
              ]
            }
          }
        },

        // ***************************************************************** //
        // CLEAN FILES & FOLDERS
        // ***************************************************************** //
        clean: {
          server: [
            '<%= app.jekyll %>',
            '<%= app.temp %>'
          ],
          dist: {
            files: [{
              dot: true,
              src: [
                '<%= app.temp %>',
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
            src: '<%= app.source %>'
          },
          dist: {
            options: {
              dest: '<%= app.dist %>/<%= app.baseurl %>',
            }
          },
          server: {
            options: {
              config: '_config.yml',
              dest: '<%= app.jekyll %>/<%= app.baseurl %>'
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
              '<%= app.temp %>/js/scripts.js': ['<%= app.source %>/_assets/js/**/*.js']
            }
          },
          dist: {
            options: {
              compress: true,
              preserveComments: false,
              report: 'min'
            },
            files: {
              '<%= app.dist %>/js/scripts.js': ['<%= app.source %>/_assets/js/**/*.js']
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
              cwd: '<%= app.source %>/_assets/scss/',
              src: '**/*.{scss,sass}',
              dest: '<%= app.temp %>/css',
              ext: '.css'
            }]
          },
          dist: {
            options: {
              sourceMap: false
            },
            files: [{
              expand: true,
              cwd: '<%= app.source %>/_assets/scss',
              src: '**/*.{scss,sass}',
              dest: '<%= app.dist %>/css',
              ext: '.css'
            }]
          }
        },

        // *************************************************************** //
        // REMOVE UNNEEDED CSS
        // N.B. CURRENTLY NOT WORKING  (ಥ﹏ಥ)
        // *************************************************************** //
        uncss: {
          options: {
            htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
            report: 'gzip'
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= app.dist %>/<%= app.baseurl %>',
              src: '**/*.html',
              dest: '<%= app.dist %>/<%= app.baseurl %>'
            }]
          }
        },

        // *************************************************************** //
        // AUTOPREFIXER
        // *************************************************************** //
        autoprefixer: {
          options: {
            browsers: ['last 1 version']
          },
          server: {
            files: [{
              expand: true,
              cwd: '<%= app.temp %>/css',
              src: '**/*.css',
              dest: '<%= app.temp %>/css'
            }]
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= app.dist %>/css',
              src: '**/*.css',
              dest: '<%= app.dist %>/css'
            }]
          }
        },

        // *************************************************************** //
        // LOAD CRITICAL CSS
        // *************************************************************** //
        critical: {
          options: {
            base: './',
            css: '<%= app.temp %>/css/style.css',
            width: 1366,
            height: 900,
            minify: true
          },
          home: {
            src: '<%= app.jekyll %>/index.html',
            dest: '<%= app.source %>/_includes/critical-css/home.css'
          },
          getting_started: {
            src: '<%= app.jekyll %>/getting-started.html',
            dest: '<%= app.source %>/_includes/critical-css/getting-started.css'
          },
          demos: {
            src: '<%= app.jekyll %>/demos.html',
            dest: '<%= app.source %>/_includes/critical-css/demos.css'
          },
          documentation: {
            src: '<%= app.jekyll %>/documentation.html',
            dest: '<%= app.source %>/_includes/critical-css/documentation.css'
          }
        },

        criticalcss: {
          options: {
            filename: '<%= app.temp %>/css/style.css',
            width: 1366,
            height: 900,
            minify: true
          },
          home: {
            options: {
              url: 'http://localhost:9000',
              outputfile: '<%= app.source %>/_includes/critical-css/home.css'
            }
          },
          getting_started: {
            options: {
              url: 'http://localhost:9000/getting-started.html',
              outputfile: '<%= app.source %>/_includes/critical-css/getting-started.css'
            }
          },
          demos: {
            options: {
              url: 'http://localhost:9000/demos.html',
              outputfile: '<%= app.source %>/_includes/critical-css/demos.css'
            }
          },
          docs: {
            options: {
              url: 'http://localhost:9000/documentation.html',
              outputfile: '<%= app.source %>/_includes/critical-css/documentation.css'
            }
          }
        },

        // *************************************************************** //
        // MINIFY CSS
        // *************************************************************** //
        cssmin: {
          options: {
            keepSpecialComments: 0,
            check: 'gzip'
          },
          server: {
            files: [{
              expand: true,
              cwd: '<%= app.source %>/_includes/critical-css',
              src: ['**/*.css'],
              dest: '<%= app.source %>/_includes/critical-css'
            }]
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= app.dist %>/css',
              src: ['**/*.css'],
              dest: '<%= app.dist %>/css'
            }]
          }
        },

        // *************************************************************** //
        // OPTIMISE IMAGES
        // *************************************************************** //
        imagemin: {
          options: {
            progressive: true,
            optimizationLevel: 4,
            svgoPlugins: [
              { cleanupIDs: false },
              { removeUselessStrokeAndFill: false },
            ]
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= app.source %>/img',
              src: '**/*.{png,jpg,jpeg,gif}',
              dest: '<%= app.dist %>/img'
            }]
          }
        },

        // *************************************************************** //
        // MINIFY SVG
        // *************************************************************** //
        svgmin: {
          options: {
            plugins: [
              { cleanupIDs: false },
              { removeUselessStrokeAndFill: false },
            ]
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= app.source %>/img',
              src: '**/*.svg',
              dest: '<%= app.dist %>/img'
            }]
          }
        },

        // *************************************************************** //
        // CACHE BUST
        // N.B. CURRENTLY NOT WORKING  (ಥ﹏ಥ)
        // *************************************************************** //
        cacheBust: {
          dist: {
            assets: {
              files: [{
                expand: true,
                cwd: '<%= app.dist %>/<%= app.baseurl %>',
                src: '**/*.html',
                dest: '<%= app.dist %>/<%= app.baseurl %>'
              }]
            }
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
              cwd: '<%= app.temp %>/<%= app.baseurl %>',
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

      // End `watch`
      });

      // ***************************************************************** //
      // LOAD NPM TASKS
      // ***************************************************************** //
      grunt.loadNpmTasks('grunt-contrib-clean');
      grunt.loadNpmTasks('grunt-contrib-connect');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-htmlmin');
      grunt.loadNpmTasks('grunt-contrib-imagemin');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-autoprefixer');
      grunt.loadNpmTasks('grunt-build-control');
      //grunt.loadNpmTasks('grunt-cache-bust');
      //grunt.loadNpmTasks('grunt-critical');
      grunt.loadNpmTasks('grunt-criticalcss');
      grunt.loadNpmTasks('grunt-jekyll');
      grunt.loadNpmTasks('grunt-sass');
      grunt.loadNpmTasks('grunt-svgmin');
      //grunt.loadNpmTasks('grunt-uncss');

      // ***************************************************************** //
      // REGISTER TASKS
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
          'criticalcss',
          'cssmin:server',
          'watch'
        ]);
      });

      // Server
      grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
      });

      // Build
      grunt.registerTask('build', [
        //'connect:dist',
        'clean:dist',
        'jekyll:dist',
        'imagemin',
        'svgmin',
        'sass:dist',
        //'uncss',
        'autoprefixer:dist',
        'cssmin:dist',
        'uglify:dist',
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