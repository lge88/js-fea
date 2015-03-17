var config = {
  paths: {
    entry: 'src/index.js',
    src: ['src/**/*.js'],
    build: 'build/',
    unit: ['test/unit/*.js'],
    spec: ['test/spec/*.js'],
    docs: 'docs/',
    readme: 'README.md',
    pkg: 'package.json'
  },
  libFile: 'fe.js',
  libMinifiedFile: 'fe.min.js',
  libGlobalVar: 'fe',
  mocha: {
    reporter: 'progress'
  }
};

var gulp = require('gulp'), $ = require('gulp-load-plugins')();
var del = require('del');
var jsdoc = require('gulp-jsdoc');
var ghPages = require('gulp-gh-pages');

require('./tools');

gulp.task('help', $.taskListing);

gulp.task('default', ['lib', 'docs']);

gulp.task('clean', del.bind(null, ['build', 'docs', '**/*tmp', '**/*.log', 'coverage'], {dot: true}));

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
  return gulp.src(config.paths.entry)
    .pipe($.webpack({
      output: {
        filename: config.libFile,
        libraryTarget: 'var',
        library: config.libGlobalVar
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('lib:dist', ['lib:dev'], function() {
  return gulp
    .src(config.paths.build + config.libFile)
    .pipe($.uglify())
    .pipe($.rename(config.libMinifiedFile))
    .pipe(gulp.dest('build'));
});

function loadConfig(fname) {
  return JSON.parse(require('fs').readFileSync(fname));
}

gulp.task('docs', function() {
  var pkgConf = loadConfig(config.paths.pkg);

  var files = config.paths.src.concat([
    config.paths.readme
  ]);

  var infos = {
    name: pkgConf.name,
    description: pkgConf.description,
    version: pkgConf.version,
    licenses: [ pkgConf.license ]
  };

  var templates = {
    path: 'ink-docstrap',
    systemName: infos.name,
    footer: '',
    copyright: 'Li Ge Copyright 2015',
    navType: 'vertical',
    theme: 'cerulean',
    linenums: true,
    collapseSymbols: false,
    inverseNav: true
  };

  var options =   {
    private: false,
    monospaceLinks: true,
    cleverLinks: true,
    outputSourceFiles: true
  };

  // FIXME: the docs exposes local file system :(
  return gulp.src(files)
    .pipe(jsdoc.parser(infos))
    .pipe(jsdoc.generator(config.paths.docs, templates, options));
});

gulp.task('ghpages', ['docs'], function() {
  var pkgConf = loadConfig(config.paths.pkg);
  var path = require('path');
  var files = path.join(config.paths.docs, pkgConf.name, pkgConf.version, '**/*');

  return gulp.src(files)
    .pipe(ghPages());
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
