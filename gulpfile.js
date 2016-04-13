var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    del = require('del'),
    webpack = require('webpack-stream'),
    named = require('vinyl-named'),
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
    return gulp.src([src + '/**/*.js'])
        .pipe(named(function(file) {
            var args = path.parse(file.path),
                basenameParent = args.dir.replace(new RegExp('^' + path.resolve(src) + '\/?'), '');
            return path.join(basenameParent, args.name);
        }))
        .pipe(webpack({
            watch: watch,
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }]
            }
        }))
        .pipe(gulp.dest(build))
});

gulp.task('default', ['clean'], function() {
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
});

//只生成文档
//docker -i src -o docs -x lib,build

//监听文档并生成文档
//docker -i src -o docs -x lib,build -w
