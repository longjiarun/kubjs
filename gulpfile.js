var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    del = require('del'),
    webpack = require('webpack-stream'),
    named = require('vinyl-named'),
    htmlmin = require('gulp-htmlmin'),
    template = require('gulp-underscore-template'),
    replace = require('gulp-replace'),
    path = require('path');

var src = 'src',
    build = 'build',
    watch = true;

//clean
gulp.task('clean', function() {
    del.sync(build);
});

//css
gulp.task('css', function() {
    return gulp.src([src + '/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest(build))
});

//js
gulp.task('js', function() {
    //[src + '/**/*.js' , '!' + src + '/js/tpl/**/*']
    return gulp.src(src + '/js/kub.js')
        .pipe(named(function(file) {
            var args = path.parse(file.path),
                basenameParent = args.dir.replace(new RegExp('^' + path.resolve(src) + '\/?'), '');
            return path.join(basenameParent, args.name);
        }))
        .pipe(webpack({
            watch: watch,
            module: {
                loaders: []
            }
        }))
        .pipe(gulp.dest(build))
});

gulp.task('tpl', function() {
    return gulp.src(src + '/js/tpl/html/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(template({
            name:function(file){
                return 'tpl'
            }
        }))
        .pipe(replace("exports['tpl']",'module.exports'))
        .pipe(gulp.dest(src + '/js/tpl'))
});

gulp.task('default', ['clean','tpl'], function() {
    watch = false;
    gulp.start('css', 'js');
});

gulp.task('watch', ['default'], function() {
    gulp.watch([src + '/**/*.less'], function() {
        gulp.start('css');
    });

    gulp.watch([src + '/**/*.js'], function() {
        gulp.start('js');
    });

    gulp.watch([src + '/js/tpl' + '/html/*.html'], function() {
        gulp.start('tpl');
    });
});

//只生成文档
//docker -i src -o docs -x lib,build

//监听文档并生成文档
//docker -i src -o docs -x lib,build -w
