var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var through     = require('through2');
var path        = require('path');
var chalk       = require('chalk');
var logSymbols  = require('log-symbols');
var polishcss   = require('polish-css');
var reporter    = polishcss.reporter;
var astHelpers  = polishcss.astHelpers;
var getPlugins  = polishcss.getPlugins;

var getConfig = require('./lib/polish-get-config');

var PLUGIN_NAME = 'gulp-polish';

function polish (options){
  return through.obj(function(file, enc, cb) {
    var contents = file.contents.toString('utf8'),
        plugins,
        config,
        results;

    if (!file.isBuffer() || file.contents.toString('utf8').length === 0) {
      return cb(null, file);
    }

    plugins = getPlugins(options.plugins, options.pluginsDirectory);
    config = getConfig(file, plugins);

    options.ignoredPlugins = config;

    results = polishcss(contents, file.path, options);

    file.polish = {};

    if (results.length){
      file.polish.success = false;
      file.polish.results = results;
    } else {
      file.polish.success = true;
      file.polish.results = [];
    }

    return cb(null, file);
  });
}

function gulpReporter (options){
  options = options || {};

  var results = 0;

  return through.obj(function (file, enc, cb) {
    if (!file.polish) {
      return cb(null, file);
    }

    if (file.polish && !file.polish.success) {
      reporter(file.path, file.polish.results);
    }

    results += file.polish.results.length;

    return cb(null, file);
  })
  .on('end', function(){
    if (options.reportTotal) {
      console.log(chalk.yellow(logSymbols.warning + ' Total warnings: ' + results + '\n'));
    }

    results = 0;
  });
}

module.exports = polish;
module.exports.astHelpers = astHelpers;
module.exports.reporter = gulpReporter;