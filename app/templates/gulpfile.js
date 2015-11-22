var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var browserify = require('browserify');
var concat = require('gulp-concat');
var esdoc = require('gulp-esdoc');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var size = require('gulp-size');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var browserSync = require('browser-sync');
var del = require('del');
var through2 = require('through2');

gulp.task('vendors', function () {
  return gulp.src([
      './node_modules/normalize.css/normalize.css'
    ])
    .pipe(rename({
        prefix: '_'
    }))
    .pipe(gulp.dest('./src/styles/vendor'));
});

gulp.task('sass', function () {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass())
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(postcss([
      require('autoprefixer-core')({
        browsers: ['last 1 version']
      })
    ]))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('styles', ['sass'], function () {
  // console.log(chalk.yellow('minifying and concatenating CSS...'));
  return gulp.src(['./src/styles/vendor/*.css', './tmp/*.css'])
    // uncss is slow, we should move this to a production build script
    // .pipe(uncss({
    //     html: ['./www/**/*.html', './www/**/*.php']
    // }))
    .pipe(nano())
    .pipe(concat('main.min.css'))
    .pipe(size({
      title: 'styles'
    }))
    .pipe(gulp.dest('./www/styles'))
    .pipe(browserSync.stream());
});

gulp.task('doc', function () {
  return gulp.src('src/scripts')
    .pipe(esdoc({ 
      destination: "./docs" 
    }));
});

gulp.task('lint', function () {
  // console.log(chalk.yellow('linting scripts...'));
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

gulp.task('test', function () {
  // console.log(chalk.yellow('linting scripts...'));
  return gulp.src('./test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'nyan', 
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('browserify', function() {
  return gulp.src('./src/scripts/app.js')
    .pipe(through2.obj(function (file, enc, next) { // workaround for https://github.com/babel/babelify/issues/46
      browserify({
        entries: file.path,
        debug: true
      })
      .bundle(function(err, res) {
        if (err) { 
          return next(err); 
        }
        file.contents = res;
        next(null, file);
      });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('scripts', ['doc', 'lint', 'test', 'browserify'], function () {
  // console.log(chalk.yellow('minifying and concatenating scripts...'));
  return gulp.src(['./tmp/*.js'])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(size({
      title: 'scripts'
    }))
    .pipe(gulp.dest('./www/scripts'));
});

gulp.task('images', function () {
  // console.log(chalk.yellow('compressing images...'));
  return gulp.src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./www/images'));
});

gulp.task('fonts', function () {
  // console.log(chalk.yellow('copying fonts...'));
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('./www/fonts'));
});

gulp.task('extras', function () {
  // console.log(chalk.yellow('copying extra files...'));
  return gulp.src('src/*.*', {
      dot: true
    })
    .pipe(gulp.dest('www'));
});

gulp.task('clean', function () {
  // console.log(chalk.yellow('wiping tmp folder...'));
  // delete anything in the tmp folder
  del('./tmp/*');
});
 
gulp.task('serve', ['clean', 'vendors', 'styles', 'scripts', 'images', 'fonts', 'extras'], function () {

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['www']
    }
  });

  gulp.watch(['./src/styles/**/*.scss', '!src/styles/sprites/*.scss'], ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/fonts/**/*', ['fonts']);
  gulp.watch('./src/*.*', ['extras']);

  // watch for changes
  gulp.watch([
    './www/*.html',
    './www/scripts/**/*.js',
    './www/images/**/*',
    './www/fonts/**/*'
  ]).on('change', browserSync.reload);


});

