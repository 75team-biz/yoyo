const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const cssimport = require('postcss-import');
const cssnano = require('cssnano');
const perfectionist = require('perfectionist');

gulp.task('css', function () {
  const processors = [
    cssimport,
    cssnext,
    cssnano,
    perfectionist
  ];
  return gulp.src('./src/**/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.css', ['css']);
});

gulp.task('default', ['css','watch']);
