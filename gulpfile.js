var gulp = require("gulp"),
    less = require("gulp-less"),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    del = require('del');

var src = "src", build = "build";

//clean
gulp.task("clean",function(){
    del.sync(build);
});

//copy
gulp.task("copy",["clean"],function(){
    return gulp.src([src+"/**/*"])
        .pipe(gulp.dest(build));
});

gulp.task("css",function(){
    return gulp.src([src+"/**/*.less"])
        .pipe(less())
        .pipe(gulp.dest(build))
        .pipe(minifyCss())
        .on("end",function(){

        })
        .on("error",function(err){
            err && console.log(err.message);
        });
});

gulp.task("js",function(){
    return gulp.src([src+"/**/*.js"])
        //.pipe(uglify())
        .pipe(gulp.dest(build))
        .on("end",function(){

        })
        .on("error",function(err){
            err && console.log(err.message);
        });
});

gulp.task("doc",function(){
    gulp.src(build+"/**.js")
      .pipe(jsdoc("docs"))
});

var markdox = require("gulp-markdox");

//只生成文档
//docker -i src/js -o docs/html/kub -x lib

//监听文档并生成文档
//docker -i src/js -o docs/html/kub -x lib -w
gulp.task("doc", function(){
    del("docs/markdown",function(){
        gulp.src([build+"/js/**/*.js","!/js/lib/*.js"])
            .pipe(markdox())
            .pipe(rename(function(path){
                path.extname = ".md";
            }))
            .pipe(gulp.dest("docs/markdown"));
    });
});

//发布文档

gulp.task("default",["clean"],function(){
    gulp.start("css","js");
});

gulp.task("watch",["default"],function(){
    gulp.watch([src+"/**/*.less"],function(){
        gulp.start("css")
    });
    gulp.watch([src+"/**/*.js"],function(){
        gulp.start("js");
    });
});
