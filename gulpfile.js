var gulp = require("gulp"),
    less = require("gulp-less"),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    del = require('del');

var src = "src",
    build = "build";

//clean
gulp.task("clean", function() {
    del.sync(build);
});

gulp.task("css", function() {
    return gulp.src([src + "/**/*.less"])
        .pipe(less())
        .pipe(gulp.dest(build))
        .on("end", function() {

        })
        .on("error", function(err) {
            err && console.log(err.message);
        });
});

gulp.task("js", function() {
    return gulp.src([src + "/**/*.js"])
        .pipe(gulp.dest(build))
        .on("end", function() {

        })
        .on("error", function(err) {
            err && console.log(err.message);
        });
});

gulp.task("default", ["clean"], function() {
    gulp.start("css", "js");
});

gulp.task("watch", ["default"], function() {
    gulp.watch([src + "/**/*.less"], function() {
        gulp.start("css")
    });
    gulp.watch([src + "/**/*.js"], function() {
        gulp.start("js");
    });
});

//只生成文档
//docker -i src -o docs -x lib

//监听文档并生成文档
//docker -i src -o docs -x lib -w
