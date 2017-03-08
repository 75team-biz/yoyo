const gulp = require('gulp');
const path = require('path');
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const mixins = require('postcss-mixins');
const defineproperty = require('postcss-define-property');
const cssimport = require('postcss-import');
const cssnano = require('cssnano');
const perfectionist = require('perfectionist');

const processors = [
  cssimport,
  mixins,
  defineproperty,
  cssnext,
  cssnano,
  perfectionist
];

gulp.task('css', function () {
  return gulp.src('./src/**/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist'));
});

/**
 * Custom variables and output
 */
gulp.task('custom', function () {
  // output dir and filename
  const yoyoPath = process.env.npm_package_config_yoyo_path;
  const output = path.relative(
    yoyoPath,
    process.env.npm_package_config_yoyo_output
  ) || './dist/yoyo.css';
  const filename = path.basename(output);
  const dirname = path.dirname(output);

  // custom variables
  var customVars = process.env.npm_package_config_yoyo_vars;
  const defaultImport = `@import 'base/variables.css';`;
  var varsImport =  defaultImport;
  if (customVars) {
    customVars = path.relative(yoyoPath, customVars);
    varsImport += `\n@import '../${customVars}';`;
  }
  return gulp.src('./src/yoyo.css')
    .pipe(replace(defaultImport, varsImport))
    .pipe(postcss(processors))
    .pipe(rename(filename))
    .pipe(gulp.dest(dirname));
});
gulp.task('custom-watch', ['custom'], function () {
  var customVars = process.env.npm_package_config_yoyo_vars;
  const yoyoPath = process.env.npm_package_config_yoyo_path;
  if (!yoyoPath) {
    console.error('No `yoyo_path` found!');
    return;
  }
  const watchFiles = ['./src/**/*.css'];
  if (customVars) {
    customVars = path.relative(yoyoPath, customVars);
    watchFiles.push(customVars);
  }
  gulp.watch(watchFiles, ['custom']);
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
