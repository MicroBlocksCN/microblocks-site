//
// gulp process for marc-c starter kit
// last update: 2020/04/27
//

"use strict";

//
// declare packages
//

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks-render');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
// add uglify

//
// production functions
//

// render nunjucks
gulp.task('render', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(nunjucks({
            path: ['src/templates/']
        }))
        .pipe(gulp.dest('dist'));
});

// compile sass
gulp.task('sass', function(){
    var postcssPlugins = [
        autoprefixer() // CSS prefixes
    ];
    return gulp.src('src/styles/main.scss')
        .pipe(sass())
        .pipe(postcss(postcssPlugins)) // PostCSS
        .pipe(gulp.dest('dist/assets/styles'));
});

// minify javascript
gulp.task('minifyJS', function(){
    var uglifyOptions = {
        mangle: false
    }
    return gulp.src('src/scripts/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/scripts'));
});

//
// serving functions
//

// run production tasks
gulp.task('compile', gulp.series('render', 'sass', 'minifyJS'));

// browser-sync
gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });
});

// watch for changes
gulp.task('watch', function(){
    gulp.watch('src/templates/**/*.njk', gulp.series('render'));
    gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
    gulp.watch('src/scripts/**/*.js').on('change', gulp.series('minifyJS'));
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("dist/assets/styles/*.css").on('change', browserSync.reload);
    gulp.watch("dist/assets/scripts/*.js").on('change', browserSync.reload);
});

// default task
gulp.task('default', gulp.parallel('watch', 'compile', 'serve'));
