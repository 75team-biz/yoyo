const gulp = require('gulp');
const rename = require("gulp-rename");
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const mixins = require('postcss-mixins');
const defineproperty = require('postcss-define-property');
const cssimport = require('postcss-import');
const cssnano = require('cssnano');
const perfectionist = require('perfectionist');

gulp.task('css', function () {
  const processors = [
    cssimport,
    mixins,
    defineproperty,
    cssnext,
    cssnano,
    perfectionist
  ];
  return gulp.src('./src/**/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function () {
  const processors = [
    cssnano
  ];
  return gulp.src('./dist/yoyo.css')
    .pipe(postcss(processors))
    .pipe(rename('yoyo.min.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.css', ['css', 'uglify', 'resource']);
});

gulp.task('resource', function () {
    gulp.src(['./resource/imgs/**/*']).pipe(gulp.dest('./dist/imgs'));
});

gulp.task('default', ['css', 'uglify', 'resource', 'watch']);
