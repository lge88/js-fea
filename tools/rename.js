var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var minimist = require('minimist');
var options = minimist(process.argv.slice(2));
var SRC = __dirname + '/../src/';
var TEST = __dirname + '/../tests/unit/';

gulp.task('rename', function() {
  var from = options.from, to = options.to;
  var src, test;

  if (from && to) {
    src = gulp
      .src(SRC + '/' + from + '.js')
      .pipe(rename(to + '.js'))
      .pipe(gulp.dest(SRC));

    test = gulp
      .src(TEST + '/' + from + '.test.js')
      .pipe(rename(to + '.test.js'))
      .pipe(gulp.dest(TEST));

    return merge(src, test);
  } else {
    console.log('No --from or --to provided, do nothing.');
    return gutil.noop();
  }
});
