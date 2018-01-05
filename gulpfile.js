// NODE MODULE IMPORTS (& environment variable)
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');



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
