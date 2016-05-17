/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
 
// Load plugins
var gulp = require('../../node_modules/gulp'),
    sass = require('../../node_modules/gulp-ruby-sass'),
    autoprefixer = require('../../node_modules/gulp-autoprefixer'),
    minifycss = require('../../node_modules/gulp-minify-css'),
    jshint = require('../../node_modules/gulp-jshint'),
    uglify = require('../../node_modules/gulp-uglify'),
    imagemin = require('../../node_modules/gulp-imagemin'),
    rename = require('../../node_modules/gulp-rename'),
    concat = require('../../node_modules/gulp-concat'),
    notify = require('../../node_modules/gulp-notify'),
    cache = require('../../node_modules/gulp-cache'),
    livereload = require('../../node_modules/gulp-livereload'),
    del = require('../../node_modules/del');
    browserSync = require('../../node_modules/browser-sync');
 
// Styles
gulp.task('styles', function() {
  return sass('sass/style.scss', { style: 'compact' })
    .on('error', function (err) {
      console.error('Error', err.message);
      notify({ message: 'errors!' })
    })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(''))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});


 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('ui/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});



 
// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('sass/**/*.scss', ['styles']);
 
  // Watch .js files
  gulp.watch('js/**/*.js', ['scripts']);
 
  // Watch image files
  gulp.watch('ui/**/*', ['images']);
 
  // Create LiveReload server
  livereload.listen();
 
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
 
});