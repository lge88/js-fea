var config = {
  paths: {
    src: ['src/**/*.js'],
    tests: ['tests/**/*.js']
  }
};

var gulp = require('gulp'), $ = require('gulp-load-plugins')();
var del = require('del');

gulp.task('default', ['lib']);

gulp.task('clean', del(['build']));

gulp.task('test', ['test:unit', 'test:spec']);

gulp.task('test:unit', function() {
  // TODO: test:unit
});

gulp.task('test:spec', function() {
  // TODO: test:spec

});

gulp.task('lib', ['lib:dev', 'lib:dist']);

gulp.task('lib:dev', function() {
  return gulp
    .src(config.paths.src)
    .pipe($.sourcemaps.init())
    .pipe($.concat('fea.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('build'));
});

gulp.task('lib:dist', function() {
  return gulp
    .src(config.paths.src)
    .pipe($.concat('fea.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('bump:patch', function() {
  return gulp.src('package.json')
    .pipe($.bump())
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function() {
  return gulp.src('package.json')
    .pipe($.bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function() {
  return gulp.src('package.json')
    .pipe($.bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});
