module.exports = function(grunt) {
  grunt.initConfig({    

    watch: {
      sass: {
        files: "src/scss/*.scss",
        tasks: ['sass']
        },
      css: {
        files: ['src/css/*.css'],
        tasks: ['postcss'],
        options: {
          spawn: false
        }  
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['eslint', 'uglify'],
        options: {
          spawn: false
        }      
      }
    },

    eslint: {
      options: {
        configFile: 'eslint.json'
      },
      target: ['app/**/*.js']
    },

    sass: {
      dist: {
        files: {
          // destination          // source file
          "src/css/styles.css" : "src/scss/styles.scss"
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'app/scripts/ugly.js': 'src/scripts/sample.js'
        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          // require('pixrem')(), //add fallbacks for rem units
          require('autoprefixer')({browsers: 'last 2 versions'}), // add prefixes from specific browsers
          // require('cssnano')() // minify result
        ]
      },
      dist: {
        src: 'src/css/*.css',
        dest: 'app/css/prefixed.css'
      }
    },

    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            "app/css/*.css",
            "*.html",
            "app/scripts/*.js"
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "./"
          }
        }
      }
    },

    bsReload: {
      css: {
        reload: "prefixed.css"
      },
      all: {
        reload: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.registerTask('default', ['eslint', 'sass', 'uglify', 'postcss', 'browserSync', 'watch']);

};

// broswerSync localhost:3000
