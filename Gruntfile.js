// @credit
// https://github.com/ozasadnyy/optimized-jekyll-grunt/blob/master/Gruntfile.js

'use strict';

module.exports = function(grunt) {

  // Start configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Setup env vars
    app: {
      source:   'app',
      dist:     'dist',
      jekyll:   '.jekyll',
      temp:     '.tmp'
    },

    watch: {

      // SASS COMPILATION & AUTOPREFIXER
      sass: {
        files: '<%= app.source %>/_assets/scss/**/*.{scss,sass}',
        tasks: [
          'sass:dev',
          'autoprefixer'
        ],
        options: {
          spawn: false
        }
      },

      // MINIFY JS
      scripts: {
        files: '<%= app.source %>/_assets/js/**/*.{js}',
        tasks: [
          'uglify:dev',
          'uglify:jekyll_includes'
        ],
        options: {
          spawn: false
        }
      },

      // GENERATE JEKYLL SITE
      jekyll: {
        files: '<%= app.source %>/**/*.{html,yml,md,mkd,markdown}',
        tasks: 'jekyll:dev',
        options: {
          spawn: false
        }
      }

    },

    // LIVE RELOAD
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
    },

    // CONNECT
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
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

    // CLEAN FILES & FOLDERS
    clean: {
      dev: [
        '<%= app.jekyll %>',
        '<%= app.temp %>',
        '<%= app.dist %>'
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

    // JEKYLL TASKS
    jekyll: {
      options: {
        config: '_config.yml,_config.build.yml',
        src: '<%= app.source %>'
      },
      dev: {
        options: {
          config: '_config.yml',
          dest: '<%= app.jekyll %>'
        }
      },
      dist: {
        options: {
          dest: '<%= app.dist %>',
        }
      }
    },

    // MINIFY HTML
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
          cwd: '<%= app.dist %>',
          src: '**/*.html',
          dest: '<%= app.dist %>'
        }]
      }
    },

    // UGLIFY
    uglify: {
      dev: {
        options: {
          mangle: false,
          beautify: true
        },
        files: {
          '<%= app.temp %>/js/scripts.js': ['<%= app.source %>/_assets/js/**/*.js']
        }
      },
      jekyll_includes: {
        options: {
          compress: true,
          preserveComments: false,
          report: 'gzip',
          mangle: false
        },
        files: {
          '<%= app.source %>/_includes/js/enhance.min.js': ['<%= app.source %>/_includes/js/enhance.js'],
          '<%= app.source %>/_includes/js/font-face-observer.min.js': ['<%= app.source %>/_includes/js/font-face-observer.js']
        }
      },
      dist: {
        options: {
          compress: true,
          preserveComments: false,
          report: 'gzip',
          screwIE8: true
        },
        files: {
          '<%= app.dist %>/js/scripts.js': ['<%= app.source %>/_assets/js/**/*.js']
        }
      }
    },

    // SASS COMPILATION
    sass: {
      options: {
        sourceMap: false,
        precision: 3,
        // nested, expanded, compact, compressed
        outputStyle: 'expanded'
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= app.source %>/_assets/scss/',
          src: '**/*.{scss,sass}',
          dest: '<%= app.temp %>/css',
          ext: '.css'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.source %>/_assets/scss',
          src: '**/*.{scss,sass}',
          dest: '<%= app.dist %>/css',
          ext: '.css'
        }]
      }
    },

    // REMOVE UNNEEDED CSS
    // N.B. CURRENTLY NOT WORKING  (ಥ﹏ಥ)
    uncss: {
      options: {
        htmlroot: '<%= app.dist %>',
        report: 'gzip'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.dist %>',
          src: '**/*.html',
          dest: '<%= app.dist %>'
        }]
      }
    },

    // AUTOPREFIXER
    autoprefixer: {
      dev: {
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

    // LOAD CRITICAL CSS
    critical: {
      options: {
        base: './',
        css: '<%= app.temp %>/css/style.css',
        width: 1366,
        height: 768,
        minify: true
      },
      home: {
        src:  '<%= app.jekyll %>/index.html',
        dest: '<%= app.source %>/_includes/critical-css/home.css'
      },
      getting_started: {
        src:  '<%= app.jekyll %>/getting-started.html',
        dest: '<%= app.source %>/_includes/critical-css/getting-started.css'
      },
      demos: {
        src:  '<%= app.jekyll %>/demos.html',
        dest: '<%= app.source %>/_includes/critical-css/demos.css'
      },
      documentation: {
        src:  '<%= app.jekyll %>/documentation.html',
        dest: '<%= app.source %>/_includes/critical-css/documentation.css'
      }
    },

    // MINIFY CSS
    cssmin: {
      options: {
        keepSpecialComments: 0,
        check: 'gzip'
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

    // OPTIMISE IMAGES
    imagemin: {
      options: {
        progressive: true,
        optimizationLevel: 4
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.source %>/_assets/img',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= app.dist %>/img'
        }]
      }
    },

    // MINIFY SVG
    svgmin: {
      options: {
        plugins: [
          { cleanupIDs: false },
          { removeUselessStrokeAndFill: false }
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.source %>/_assets/img',
          src: '**/*.svg',
          dest: '<%= app.dist %>/img'
        }]
      }
    },

    // CACHE BUST
    // N.B. CURRENTLY NOT WORKING  (ಥ﹏ಥ)
    cacheBust: {
      dist: {
        assets: {
          files: [{
            expand: true,
            cwd: '<%= app.dist %>',
            src: '**/*.html',
            dest: '<%= app.dist %>'
          }]
        }
      }
    },

    // COPY FILES AND FOLDERS
    copy: {
      fonts_dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= app.source %>/_assets/fonts',
          src: '**/*.{woff,woff2}',
          dest: '<%= app.temp %>/fonts'
        }]
      },
      fonts_dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= app.source %>/_assets/fonts',
          src: '**/*.{woff,woff2}',
          dest: '<%= app.dist %>/fonts'
        }]
      },
      images_dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= app.source %>/_assets/img',
          src: '**/*.{gif,jpg,jpeg,png,svg,webp}',
          dest: '<%= app.temp %>/img'
        }]
      }
    },

    // PUSH TO GH-PAGES
    buildcontrol: {
      dist: {
        options: {
          dir: '<%= app.dist %>',
          remote: 'git@github.com:chris-pearce/scally-website.git',
          branch: 'gh-pages',
          commit: true,
          push: true,
          connectCommits: false
        }
      }
    }

  });
  // End configuration


  // LOAD NPM TASKS
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
  //grunt.loadNpmTasks('grunt-criticalcss');
  //grunt.loadNpmTasks('grunt-critical');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-svgmin');
  //grunt.loadNpmTasks('grunt-uncss');


  // REGISTER TASKS

  // Serve (default)
  grunt.registerTask('serve', function(target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:dev',
      'jekyll:dev',
      'copy:fonts_dev',
      'copy:images_dev',
      'sass:dev',
      'autoprefixer:dev',
      'uglify:dev',
      'uglify:jekyll_includes',
      'connect:livereload',
      'watch'
    ]);
  });

  // Build
  grunt.registerTask('build', [
    //'critical',
    'clean:dist',
    'jekyll:dist',
    'copy:fonts_dist',
    'imagemin',
    'svgmin',
    'sass:dist',
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

  // Serve (default)
  grunt.registerTask('default', [
    'serve'
  ]);
};