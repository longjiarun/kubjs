 var gulp = require("gulp"),
     uglify = require('gulp-uglify'),
     del = require('del');

 var src = "src",
     build = "build";

 gulp.task("clean", function() {
     del.sync(build);
 });

 gulp.task("copy", ["clean"], function() {
     return gulp.src([src + "/**/*.html"])
         .pipe(gulp.dest(build + "/static/"));
 });

 gulp.task("js", ["copy"], function() {
     return gulp.src([src + "/**/*.js"])
         .pipe(uglify())
         .pipe(gulp.dest(build + "/static/"));
 });

 gulp.task("default", function() {
     gulp.start("js");
 });