/**
 * Created by Adrian on 01.04.2018.
 */

var gulp = require('gulp');

var browserSync = require('browser-sync');

var sass = require('gulp-sass');

gulp.task('server',function () {
   browserSync({
       server: './',
   }) ;

   gulp.watch('./index.html',['reload']);
   gulp.watch('./css/main.scss',['reload','sass']);
});

gulp.task('reload',function () {
    browserSync.reload();
});

gulp.task('default',['server']);

gulp.task('sass',function () {
   return (gulp.src('./css/*.scss'))
       .pipe(sass().on('error',sass.logError))
       .pipe(gulp.dest('./css'))
       .pipe(browserSync.stream());
});