var config = {
  paths: {
    src: ['src/**/*.js'],
    unit: ['test/unit/*.js'],
    spec: ['test/spec/*.js']
  },
  mocha: {
    reporter: 'progress'
  }
};

var gulp = require('gulp'), $ = require('gulp-load-plugins')();
var del = require('del');

require('./tools');

gulp.task('help', $.taskListing);

gulp.task('default', ['lib']);

gulp.task('clean', del(['build', '**/*tmp*', '**/*.log'], {dot: true}));

gulp.task('test', ['unit', 'spec']);

gulp.task('unit', function(cb) {
  gulp.src(config.paths.src)
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      gulp
        .src(config.paths.unit, {read: false})
        .pipe($.mocha(config.mocha))
        .pipe($.istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('spec', function() {
  gulp
    .src(config.paths.spec, {read: false})
    .pipe($.mocha(config.mocha));
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
