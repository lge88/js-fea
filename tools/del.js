var gulp = require('gulp');
var del = require('del');
var minimist = require('minimist');
var options = minimist(process.argv.slice(2));
var SRC = __dirname + '/../src/';
var TEST = __dirname + '/../tests/unit/';

gulp.task('del', function(done) {
  var name = options.name;
  var src, test;

  if (name) {
    del([SRC + name + '.js', TEST + name + '.test.js'], done);
  } else {
    console.log('No --name provided, do nothing.');
    done();
  }
});
