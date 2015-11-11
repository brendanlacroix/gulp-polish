var through      = require('through2'),
    polishCSS    = require('polish-css'),
    gulpReporter = require('./reporter'),
    getConfig    = require('./get-config');

function polish (options){
  return through.obj(function(file, enc, cb) {
    var contents = file.contents.toString('utf8'),
        plugins,
        config,
        results;

    if (!file.isBuffer()) {
      return cb(null, file);
    }

    config = getConfig(file, options);
    results = polishCSS(contents, file.path, config);

    file.polish = {};

    if (results.errors.length || results.warnings.length){
      file.polish.success = false;
      file.polish.errors = results.errors;
      file.polish.warnings = results.warnings;
    } else {
      file.polish.success = true;
      file.polish.errors = [];
      file.polish.warnings = [];
    }

    return cb(null, file);
  });
}

module.exports = polish;
module.exports.reporter = gulpReporter;