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
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var lib = require('bower-files') ({
 "overrides" : {
   "bootstrap" : {
     "main": [
       "less/bootstrap.less",
       "dist/css/bootstrap.css",
       "dist/js/bootstrap.js"
     ]
   }
 }
});
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


//GULP TASKS

//take concatenated JS file from tmp/, transpile from ES6, browserify
  //and place in build/js/ directory
gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js']})
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

//'$ gulp jshint'
gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

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
