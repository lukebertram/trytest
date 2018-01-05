// NODE MODULE IMPORTS (& environment variable)
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');


//GULP TASKS

//take concatenated JS file from tmp/, transpile from ES6, browserify
  //and place in build/js/ directory
gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['.tmp/allConcat.js']})
    .transform(babelify.configure({
      presets: ["es2015"]
    }))
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'))
});

//'$ gulp concatInterface' - gather all interface files from js/,
  //concatenate them and place in tmp/ directory
gulp.task('concatInterface', function(){
  return gulp.src(['js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

//'$ gulp minifyScripts'
gulp.task('minifyScripts', ['jsBrowserify'], function(){
  return gulp.src('build/js/app.js')
    .pipe(uglify())
    .pipe(gulp.des('./build/js'));
});

//'$ gulp clean'
gulp.task('clean', function(){
  return del(['build', 'tmp']);
});
