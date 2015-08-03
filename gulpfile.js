var gulp = require("gulp"),
    less = require("gulp-less"),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    del = require('del');

var src = "src", build = "build";

//clean
gulp.task("clean",function(){
    del(build);
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
var publish = require("./gulp.publish"),
    apiPath = "docs/html";
publish({
    build:apiPath,
    rootDir : 'api'
});

//运行 publishdoc 发布文档
gulp.task("publishdoc",function(){
    return gulp.src(apiPath+"/kub/core.js.html")
        .pipe(rename(function(path){
            path.basename = "index"
        }))
        .pipe(gulp.dest(function(file){
            file.contents = new Buffer("<script>window.location.href ='core.js.html'; </script>");
            return apiPath+"/kub";
        }))
        .on("end",function(){
            gulp.start("publish");
        });
});

gulp.task("default",["css","js"],function(){

});

gulp.task("watch",["default"],function(){
    gulp.watch([src+"/**/*.less"],function(){
        gulp.start("css")
    });
    gulp.watch([src+"/**/*.js"],function(){
        gulp.start("js");
    });
});

