/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', false, () => {
  return gulp.src([
    '**/*.js',
    '!**/node_modules/**',
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);
