/*global require, console*/

(function () {
    'use strict';

    var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        prefix = require('gulp-autoprefixer'),
        jshint = require('gulp-jshint');

    gulp.task('sass', function () {
        gulp.src('./src/sass/**/*.scss')
            .pipe(sass())
            .pipe(prefix('last 1 version', '> 1%', 'ie 8'))
            .pipe(gulp.dest('./dist/css'));

        gulp.src('./demo/sass/**/*.scss')
            .pipe(sass())
            .pipe(prefix('last 1 version', '> 1%', 'ie 8'))
            .pipe(gulp.dest('./demo/css'));
    });

    gulp.task('js', function() {
        return gulp.src(['gulpfile.js', './src/js/**/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    gulp.task('watch', function () {
        var watcherCSS = gulp.watch(['./src/sass/**/*.scss',
                                     './demo/sass/**/*.scss'], ['sass']),
            watcherJS = gulp.watch('./src/js/**/*.js', ['js']);
        watcherCSS.on('changed', function (event) {
            console.log('File ' + event.path + ' was ' + event.type +
                        ', running tasks...');
        });
        watcherJS.on('changed', function (event) {
            console.log('File ' + event.path + ' was ' + event.type +
                        ', running tasks...');
        });
    });
}());
