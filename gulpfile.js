// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('postcss-cssnext'),
    precss = require('precss'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    browserSync = require('browser-sync'),
    livereload = require('gulp-livereload');

// Styles
gulp.task('styles', function() {

    var processors = [
        cssnext({flexbox: true, browsers: ['last 2 versions' ,'iOS 6', 'iOS 7']}),
        precss
    ];

    return gulp.src('sass/**/*.scss')
        .pipe(sourcemaps.init())    
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(minifycss({processImport: false}))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload())
        .pipe(notify({ message: 'Styles task complete' }));

});

// Scripts
gulp.task('scripts', gulp.series(function() {
    return gulp.src('js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
}));

// Images
gulp.task('images', gulp.series(function() {
    return gulp.src('ui/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
}));

// Clean
gulp.task('clean', gulp.series(function(done) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], done);
    done();
}));

// Default task
// gulp.task('default', ['clean'], function() {
//     gulp.start('styles', 'scripts', 'images');
// });

gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts', 'images'),
    function (done) { done(); }  
));

// Watch
gulp.task('watch', function(done) {

    // Watch .scss files
    gulp.watch('sass/**/*.scss', gulp.series('styles'));

    // Watch .js files
    gulp.watch('js/**/*.js', gulp.series('scripts'));

    // Watch image files
    gulp.watch('ui/**/*', gulp.series('images'));

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

    done();

});