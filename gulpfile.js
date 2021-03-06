'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');

gulp.task('sass', function () {
  gulp.src('./assets/scss/style.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
  gulp.src('./assets/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('copy-js-vendors', function () {
  return gulp.src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/LykkeFramework/assets/js/vendor/fastclick.min.js',
      './node_modules/LykkeFramework/assets/js/vendor/html5shiv.js',
      './node_modules/LykkeFramework/assets/js/vendor/bootstrap.min.js',
      './node_modules/jquery-inview/jquery.inview.min.js',
      './node_modules/autosize/dist/autosize.min.js'
    ])
    .pipe(gulp.dest('./public/js/vendor'));
});

gulp.task('copy-css-vendors', function () {
  return gulp.src([
      './node_modules/LykkeFramework/assets/vendor/bootstrap-custom.min.css'
    ])
    .pipe(gulp.dest('./public/css/vendor'));
});

gulp.task('copy-scripts', function () {
  return gulp.src([
      './assets/js/**/*.js'
    ])
    .pipe(gulp.dest('./public/js'));
});

gulp.task('copy-fonts', function () {
  return gulp.src([
      './assets/fonts/**/*',
      './node_modules/LykkeFramework/assets/fonts/**/*'
    ])
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('copy-images', function() {
  return gulp.src([
      './assets/img/**/*',
      './node_modules/LykkeFramework/assets/img/**/*'
    ])
    .pipe(gulp.dest('./public/img'));
});

gulp.task('copy-fonts-prod', function () {
  return gulp.src([
      './public/fonts/**/*'
    ])
    .pipe(gulp.dest('./dist/fonts', {}));
});

gulp.task('copy-css-prod', function () {
  return gulp.src([
      './public/css/vendor/*'
    ])
    .pipe(gulp.dest('./dist/css/vendor', {}));
});

gulp.task('usemin', [
  'copy-js-vendors',
  'copy-css-prod',
  'copy-scripts'
], function () {
  return gulp.src('./public/*.html')
    .pipe(usemin({
      js: [uglify()],
      inlinejs: [uglify()]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('imagemin', ['copy-images'], function () {
  return gulp.src([
      './public/img/**/*'
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('copy-favicons', function () {
  return gulp.src([
      './node_modules/LykkeFramework/public/favicon/*'
    ])
    .pipe(gulp.dest('./public/', {}));
});

gulp.task('dev-server', ['dev'], function () {
  connect.server({
    root: 'public',
    livereload: true,
    port: 9016
  });

  console.log('Dev on http://localhost:9016. Press ctrl+c to stop it.');
});

gulp.task('prod-server', ['prod'], function () {
  connect.server({
    root: 'dist',
    livereload: false,
    port: 9017
  });

  console.log('Prod on http://localhost:9017. Press ctrl+c to stop it.');
});

gulp.task('watchcss', function() {
  gulp.src('public/css/*.css')
    .pipe(livereload());
});

gulp.task('watch', ['dev-server'], function () {
  livereload.listen(35729);

  gulp.watch('assets/scss/**/*.scss', ['sass']);
  gulp.watch('public/css/*.css', ['watchcss']);
  gulp.watch('assets/js/**/*.js', ['copy-scripts']);
});

gulp.task('clean', function () {
  return del([
    'dist/*',
    'public/css/*',
    'public/js/*',
    'public/img/*',
    'public/fonts/*'
  ]);
});

gulp.task('dev', function () {
  gulp.start('sass');
  gulp.start('copy-js-vendors');
  gulp.start('copy-css-vendors');
  gulp.start('copy-scripts');
  gulp.start('copy-fonts');
  gulp.start('copy-favicons');
  gulp.start('copy-images');
  gulp.start('usemin');
});

gulp.task('prod', ['dev'], function () {
  gulp.start('usemin');
  gulp.start('copy-css-prod');
});

gulp.task('build', function () {
  gulp.start('dev');
  gulp.start('prod');
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
