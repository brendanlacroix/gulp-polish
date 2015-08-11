var through     = require('through2');
var path        = require('path');
var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

var polish   = require('./lib/polish');
var reporter = require('./lib/polish-error-reporter');
var getRules = require('./lib/polish-get-rules');

var PLUGIN_NAME = 'gulp-polish';

function gulpPolish (options){
  if (!options || !options.rulesDirectory || typeof options.rulesDirectory !== 'string'){
    throw new PluginError(PLUGIN_NAME, 'Rules directory not specified.');
  }

  var rules = getRules(options.rulesDirectory);

  return through.obj(function(file, enc, cb) {
    var stream = this;

    if (!file.isBuffer()) {
      return cb(null, file);
    }

    polish(file, rules).then(function(file){
      return cb(null, file);
    });
  });
}

gulpPolish.reporter = reporter;

module.exports = gulpPolish;