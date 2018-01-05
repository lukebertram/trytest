
# JavaScript Project Construction

The following sequence should leave you with a gulpfile that has all necessary
tasks defined and appropriately configured .gitignore, .jshintrc, bower.json,
and karma.conf.js files.

1. Export the appropriate modules from JS files and import those modules into
other files (like the "-interface" or frontend files).

2. `$ npm init`

3. Install the following packages
    1. `$ npm i gulp --save-dev`
    2. `$ npm i browserify --save-dev`
    3. `$ npm i vinyl-source-stream --save-dev`
    4. `$ npm i gulp-concat --save-dev`
    5. `$ npm i gulp-uglify --save-dev`
    6. `$ npm i gulp-util --save-dev`
    7. `$ npm i del --save-dev`
    8. `$ npm i jshint --save-dev`
    9. `$ npm i gulp-jshint --save-dev`
    10. `$ npm i browser-sync --save-dev`
    11. `$ npm i -g bower (if not already installed globally)`
    12. `$ npm i bower-files --save-dev`
    13. `$ npm i gulp-sass --save-dev`
    14. `$ npm i gulp-sourcemaps --save-dev`
    15. `$ npm i jasmine --save-dev`
    16. `$ npm i karma --save-dev`
    17. `$ npm i karma-jasmine --save-dev`
    18. `$ npm i jasmine-core --save-dev`
    19. `$ npm i karma-chrome-launcher --save-dev`
    20. `$ npm i karma-cli --save-dev`
    21. `$ npm i karma-browserify --save-dev`
    22. `$ npm i karma-jquery --save-dev`
    23. `$ npm i karma-jasmine-html-reporter --save-dev`
    24. `$ npm i watchify --save-dev`
    25. `$ npm i babelify --save-dev`
    26. `$ npm i babel-preset-es2015 --save-dev`
    27. `$ npm i babel-core --save-dev`

    **_OR_**

    Run the following command in your project dir:

    $ npm i gulp browserify vinyl-source-stream gulp-concat gulp-uglify gulp-util del jshint gulp-jshint browser-sync bower-files gulp-sass gulp-sourcemaps jasmine karma karma-jasmine jasmine-core karma-chrome-launcher karma-cli karma-browserify karma-jquery karma-jasmine-html-reporter watchify babelify babel-preset-es2015 babel-core --save-dev

4. add `{"esversion": 6}` to .jshintrc

5. create local .gitignore file and add the following entries:
  ```
  node_modules/
  build/
  tmp/
  bower_components/
  *.css.map
  .sass-cache/

  ```

6. Initialize bower in the command line with `$ bower init`

7. Install jquery and bootstrap bower modules from command line with the following command: `$ bower install jquery bootstrap --save`

8. `$ node_modules/.bin/jasmine init`

9. in package.JSON add the following **(unless you're going to use Karma)**:
    ```
    "scripts": {
      "test": "jasmine"
    }
    ```
10. `$ karma init` in the project directory

11. Add the following to karma.conf.js (includes Babelify transform for Browserify):
    ```
    module.exports = function(config) {
      config.set({
        basePath: '',
        frameworks: ['jquery-3.2.1', 'jasmine', 'browserify'],
        files: [
          'js/*.js',
          'spec/*-spec.js',
        ],
        exclude: [
        ],
        preprocessors: {
          'js/*.js': [ 'browserify'],
          'spec/*.js': ['browserify'],
        },
        plugins: [
          'karma-jquery',
          'karma-browserify',
          'karma-jasmine',
          'karma-chrome-launcher',
          'karma-jasmine-html-reporter'
        ],

        browserify: {
          debug: true,
          transform: [ [ 'babelify', {presets: ["es2015"]} ] ]
        },

        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
      })
    }
    ```

12. Add the following to package.JSON:
    ```
    "scripts" : {
      "test" : "karma start karma.conf.js"
    }
    ```

13. Add the following tasks to gulpfile:

    1. Import `gulp`, `browserify`, `viny-source-stream`, and `babelify` at top of gulp file:
        ```
        var gulp = require('gulp');
        var browserify = require('browserify');
        var babelify = require('babelify');
        var source = require('vinyl-source-stream');
        ```
      Add `jsBrowserify` task to gulpfile:
        ```
        gulp.task('jsBrowserify', ['concatInterface'], function() {
          return browserify({ entries: ['.tmp/allConcat.js']})
            .transform(babelify.configure({
              presets: ["es2015"]
            }))
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest('./build/js'))
        });
        ```
    2. Import `gulp-concat` at top of file:
      ```
      var concat = require('gulp-concat');
      ```
      Add `concatInterface` task to gulpfile:
      ```
      gulp.task('concatInterface', function(){
        return gulp.src(['js/*-interface.js'])
          .pipe(concat('allConcat.js'))
          .pipe(gulp.dest('./tmp'));
        });
      ```

    3. Import `gulp-uglify`, `gulp-util`, `del` and set `buildProduction` var at top of file:
      ```
      var uglify = require('gulp-uglify');
      var utilities = require('gulp-util');
      var buildProduction = utilities.env.production;
      var del = require('del');
      ```
      Add `minifyScripts` and `clean` task to gulpfile:
      ```
      gulp.task('minifyScripts', ['jsBrowserify'], function() {
        return gulp.src('build/js/app.js')
          .pipe(uglify())
          .pipe(gulp.dest('./build/js'));
      });

      gulp.task('clean', function(){
        return del(['build', 'tmp']);  
      });
      ```

    4. Import `gulp-jshint` at top of file:
      ```
      var jshint = require('gulp-jshint');
      ```
      Add `jshint` task to gulpfile:
      ```
      gulp.task('jshint', function(){
        return gulp.src(['js/*.js'])
          .pipe(jshint())
          .pipe(jshint.reporter('defualt'));
      });
      ```

    5. Import `browser-sync`, `bower-files`, `gulp-sass` and `gulp-sourcemaps` at top of gulpfile:
      ```
      var browserSync = require('browser-sync').create();
      var lib = require('bower-files') ({
        "overrides":{
          "main": [
            "less/bootstrap.less",
            "dist/css/bootstrap.css",
            "dist/js/bootstrap.js"
          ]
        }
      });
      var sass = require('gulp-sass');
      var sourcemaps = require('gulp-sourcemaps');
      ```
      Add Bower tasks `bower`,`bowerJS`, and `bowerCSS` as well as `cssConcat`, `build` and `cssBuild` to gulpfile:
      ```
      gulp.task('bower', ['bowerJS', 'cssConcat']);

      gulp.task('bowerJS', function() {
        return gulp.src(lib.ext('js').files)
          .pipe(concat('vendor.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('./build/js'));
      });

      gulp.task('bowerCSS', function(){
        return gulp.src(lib.ext('css').files)
          .pipe(concat('vendor.css'))
          .pipe(gulp.dest('./build/css'));
      });

      gulp.task('cssConcat', ['bowerCSS', 'cssBuild'], function() {
        return gulp.src(['./build/css/vendor.css', './build/css/main.css'])
          .pipe(concat('build.css'))
          .pipe(gulp.dest('./build/css'))
          .pipe(browserSync.stream());
      });

      gulp.task('cssBuild', function() {
        return gulp.src('./scss/main.scss')
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('./build/css'))
      });

      gulp.task('build', ['clean'], function(){
        if (buildProduction) {
          gulp.start('minifyScripts');
        } else {
          gulp.start('jsBrowserify');
        }
        gulp.start('bower');
      });
      ```

    6. Add `serve` task and subtasks to gulpfile:
      ```
      gulp.task('serve', function() {
        browserSync.init({
          server: {
            baseDir: "./",
            index: "index.html"
          }
        });

        gulp.watch(['js/*.js'], ['jsBuild']);
        gulp.watch(['bower.json'], ['bowerBuild']);
        gulp.watch(['*.html'], ['htmlBuild']);
        gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['cssConcat']);

      });

      gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
        browserSync.reload();
      });

      gulp.task('bowerBuild', ['bower'], function(){
        browserSync.reload();
      });

      gulp.task('htmlBuild', function(){
        browserSync.reload();
      });
      ```
