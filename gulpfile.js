var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    del = require('del'),
    webpack = require('webpack-stream'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    template = require('gulp-compile-template'),
    banner = require('gulp-banner'),
    eslint = require('gulp-eslint'),
    postcssClean = require('postcss-clean'),
    named = require('vinyl-named'),
    path = require('path'),
    exec = require('child_process').execSync,
    pkg = require('./package.json');

var src = 'src',
    build = 'build',
    dist = 'dist',
    static = 'static',
    compress = true;

var staticPath = path.join(build, static);

var comment = '/*! Kub Mobile JavaScript Components Library v<%= pkg.version%>. (https://github.com/longjiarun/kubjs)*/\n';

//clean
gulp.task('clean', function() {
    del.sync(build);
    del.sync(dist);
});

//less
gulp.task('less', function() {
    var target = path.join(dist, 'css');

    var stream = gulp.src([src + '/less/kub.less'])
        .pipe(less())
        .pipe(banner(comment, {
            pkg: pkg
        }))

    //output unmin css
    stream = stream.pipe(gulp.dest(target));

    //min css
    compress && (stream = stream.pipe(cleancss()));

    //rename css
    stream = stream.pipe(rename(function(path) {
        path.basename += '.min';
    }))

    //output min css
    stream = stream.pipe(gulp.dest(target));

    //output build
    stream = stream.pipe(rename(function(path) {
        path.basename = 'index';
    }))

    return stream.pipe(gulp.dest(staticPath));
});

//js
gulp.task('js',['tpl'], function() {
    var target = path.join(dist, 'js');

    var stream = gulp.src([src + '/js/kub*.js'])
        .pipe(named(function(file) {
            var args = path.parse(file.path),
                basenameParent = args.dir.replace(new RegExp('^' + path.resolve(src + '/js') + '\/?'), '');

            return path.join(basenameParent, args.name);
        }))
        .pipe(webpack({
            module: {
                loaders: [{
                    test: /\.less$/,
                    loader: 'small-style?{"insertAt":"top"}!postcss!less'
                }]
            },
            postcss: function() {
                return [postcssClean()];
            }
        }))
        .pipe(banner(comment, {
            pkg: pkg
        }))

    //output unmin css
    stream = stream.pipe(gulp.dest(target));

    //min css
    compress && (stream = stream.pipe(uglify()));

    //rename css
    stream = stream.pipe(rename(function(path) {
        path.basename += '.min';
    }))

    //add banner
    compress && (stream = stream.pipe(banner(comment, {
        pkg: pkg
    })))

    //output min css
    stream = stream.pipe(gulp.dest(target));

    //output build
    stream = stream.pipe(rename(function(path) {
        path.basename = path.basename.replace('.min','').replace('kub','index');
    }))

    return stream.pipe(gulp.dest(staticPath));
});

//tpl
gulp.task('tpl', function() {
    var target = path.join(src, 'js/tpl');

    return gulp.src([src + '/js/tpl/html/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(template({
            underscore: {
                variable: 'data'
            }
        }))
        .pipe(gulp.dest(target))
});

//eslint
gulp.task('eslint', function() {
    var source = [path.join(src, 'js/**/*.js'), '!' + path.join(src, 'js/tpl/**/*.js')];
    return gulp.src(source)
        .pipe(eslint())
        .pipe(eslint.format());
});

//只生成文档
//docker -i src/js -o build/pages/docs -x tpl

//监听文档并生成文档
//docker -i src/js -o build/pages/docs -x tpl -w

gulp.task('docs', function(cb) {
    var target = path.join(build, 'pages/docs', 'v' + pkg.version),
        source = path.join(src, 'js');
    try {
        exec('docker -i ' + source + ' -o ' + target + ' -x tpl');
        cb();
    } catch (e) {
        console.log(e.message);
        process.exit(0);
    }
});

gulp.task('default', ['clean'], function() {
    gulp.start('less', 'js');
});


//发布到CDN
gulp.task('publish', ['default'], function() {
    gulp.start('docs');
});

gulp.task('watch', ['default'], function() {
    compress = false;
    gulp.watch([src + '/**/*.less'], function() {
        gulp.start('less');
    });

    gulp.watch([src + '/**/*.js'], function() {
        gulp.start('js');
    });

    gulp.watch([src + '/**/*.html'], function() {
        gulp.start('tpl');
    });
});
