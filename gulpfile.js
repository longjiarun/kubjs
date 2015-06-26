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
        .on("end",function(){
            
        })
        .on("error",function(err){
            err && console.log(err.message);
        });
});

gulp.task("js",function(){
    return gulp.src([src+"/**/*.js"])
        .pipe(gulp.dest(build)) 
        .pipe(uglify())
        /*.pipe(rename(function(path){
            path.basename +=".min";
        }))
        .pipe(gulp.dest(build))*/
        .on("end",function(){
            
        })
        .on("error",function(err){
            err && console.log(err.message);
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

