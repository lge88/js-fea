var gulp = require('gulp');
var gutil = require('gulp-util');
var template = require('gulp-template');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var minimist = require('minimist');
var options = minimist(process.argv.slice(2));
var SRC = __dirname + '/../src/';
var TEST = __dirname + '/../tests/unit/';

gulp.task('new', function() {
  var name = options.name;
  var src, test;

  if (name) {
    src = gulp
      .src(__dirname + '/templates/src.js')
      .pipe(template({
        name: name
      }))
      .pipe(rename(name + '.js'))
      .pipe(gulp.dest(SRC));

    test = gulp
      .src(__dirname + '/templates/test.js')
      .pipe(template({
        name: name
      }))
      .pipe(rename(name + '.test.js'))
      .pipe(gulp.dest(TEST));

    return merge(src, test);
  } else {
    console.log('No --name provided, do nothing.');
    return gutil.noop();
  }
});
