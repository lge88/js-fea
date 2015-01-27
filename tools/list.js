var gulp = require('gulp');
var fs = require('fs');
var SRC = __dirname + '/../src/';

gulp.task('list', function(done) {
  fs.readdir(SRC, function(err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files = files.map(function(f) {
      return /(.*)\.js$/.exec(f);
    }).filter(function(match) {
      return match !== null;
    }).map(function(match) {
      return match[1];
    }).join('\n');

    console.log(files);
    done();
  });
});
