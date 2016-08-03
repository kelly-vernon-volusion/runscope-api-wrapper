const gulp = require('gulp');
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const fs = require('fs');

gulp.task('default', ['test:unit']);

gulp.task('test:unit', ['build:lint'], () => {
  return gulp.src('test/unit/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('test:integration', ['build:lint'], () => {
  return gulp.src('test/integration/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('build:lint', () => {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('build:babel', (callback) => {
  gulp.src(['src/**/*.js'], {base: './src'})
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .on('end', () => callback());
});
