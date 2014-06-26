/*global require*/

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer');

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

gulp.task('watch', function () {
    var watcherCSS = gulp.watch(['./src/sass/**/*.scss',
                                 './demo/sass/**/*.scss'], ['sass']);
    watcherCSS.on('changed', function (event) {
        console.log('File ' + event.path + ' was ' + event.type +
                    ', running tasks...');
    });
});
