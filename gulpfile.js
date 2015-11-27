// Include Gulp
var gulp = require('gulp');

// Include Plugins
var jade         = require('gulp-jade');
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var sourceMaps   = require('gulp-sourcemaps');
var minifyCSS    = require('gulp-minify-css');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var browserSync  = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var imagemin     = require('gulp-imagemin');
var del          = require('del');
var gulpSequence = require('gulp-sequence').use(gulp);

// Refresh Browser
gulp.task('browserSync', function() {
    browserSync.init({
      // proxy:  { target: 'localhost/project/app'
      server: { baseDir: 'app'
        },
      options: {
          reloadDelay: 250
      },
      notify: false
    });
});

// Jade Compiler
gulp.task('jade', function() {
  gulp.src('app/templates/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
      }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('app/js/src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Images Minify
gulp.task('images', function(tmp) {
    gulp.src(['app/img/*.jpg', 'app/img/*.png', 'app/img/*.jpeg'])
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/img'))
});

// Compile & Concatenate Sass
gulp.task('sass', function() {
    return gulp.src('app/sass/*.sass')
        .pipe(plumber())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('app/js/src/*.js')
        .pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream());
});

// Clean Dist Folder
gulp.task('clean', function () {
  return del([
    'dist/**/*',
  ]);
});

// Watch Files For Changes
gulp.task('watch', function() {
    //gulp.watch('app/library/**/*', browserSync.reload);
    gulp.watch('app/templates/**/*', ['jade']);
    gulp.watch('app/js/src/*.js', ['lint', 'scripts']);
    gulp.watch('app/sass/**/*', ['sass']);
    gulp.watch('app/*.+(html|php)', browserSync.reload);
});

// Move To Dist Folder
gulp.task('dist', function() {
    gulp.src(['app/js/*.js'])
        .pipe(gulp.dest('dist/js/'));
    gulp.src(['app/*.+(html|php)'])
        .pipe(gulp.dest('dist'));
    gulp.src(['app/css/*'])
        .pipe(gulp.dest('dist/css'));
    //gulp.src(['app/library/**/*'])
        //.pipe(gulp.dest('dist/library/'));
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch', 'browserSync']);

// Deploy Task
gulp.task('deploy', gulpSequence('clean', ['dist', 'images']));