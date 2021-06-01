//
// gulp process for marc-c starter kit
// last update: 2020/04/27
//

"use strict";

//
// declare packages
//

var fs = require('fs');
var hbs = require('hbs');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var handlebars = require('gulp-handlebars');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');

// register all handlebars partials

function registerPartials (dir) {
    var partialsDir = __dirname + '/src/templates/partials/' + dir;
    var filenames = fs.readdirSync(partialsDir);
    filenames.forEach(function (filename) {
        var matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) { return; }
        var name = matches[1];
        var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
        // if there's a dir, register the partial as dir.name
        // i.e. svg.icon-plus.svg
        hbs.registerPartial((dir ? dir + '.' : '') + name, template);
    });
}

registerPartials('svg');
registerPartials();

// add uglify

//
// production functions
//

// render nunjucks
gulp.task('render', function(){
    return gulp.src('src/templates/*.hbs')
        .pipe(handlebars({
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
