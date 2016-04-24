var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    del = require('del'),
    webpack = require('webpack-stream'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    template = require('gulp-underscore-tpl'),
    path = require('path');

var src = 'src',
    build = 'build',
    static = 'static',
    staticPath = path.join(build,static),
    watch = true,
    min = true;

//clean
gulp.task('clean', function() {
    del.sync(build);
});

//css
gulp.task('css', function() {
    var stream = gulp.src([src + '/css/kub.less'])
        .pipe(less())
        .pipe(rename(function (path) {
            path.basename = 'index';
        }))

    min && (stream = stream.pipe(cleancss()));

    return stream.pipe(gulp.dest(staticPath));
});

//js
gulp.task('js', function() {
    var stream = gulp.src(src + '/js/kub.js')
        .pipe(webpack({
            watch: watch
        }))
        .pipe(rename(function (path) {
            path.basename = 'index';
        }))

    min && (stream = stream.pipe(uglify()));

    return stream.pipe(gulp.dest(staticPath));
});

//tpl
gulp.task('tpl', function() {
    return gulp.src(src + '/js/tpl/html/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(template({
            variable:'data'
        }))
        .pipe(gulp.dest(src + '/js/tpl'))
});

gulp.task('default', ['clean','tpl'], function() {
    watch = false;
    gulp.start('css', 'js');
});

gulp.task('watch', ['default'], function() {
    min = false;
    gulp.watch([src + '/**/*.less'], function() {
        gulp.start('css');
    });

    gulp.watch([src + '/**/*.js'], function() {
        gulp.start('js');
    });

    gulp.watch([src + '/**/*.html'], function() {
        gulp.start('tpl');
    });
});

//只生成文档
//docker -i src -o docs -x lib,build

//监听文档并生成文档
//docker -i src -o docs -x lib,build -w
