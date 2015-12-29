var through      = require('through2'),
    polishCSS    = require('polish-css'),
    gulpReporter = require('./reporter');

function polish (options){
  return through.obj(function(file, enc, cb) {
    var contents = file.contents.toString('utf8'),
        results;

    if (!file.isBuffer()) {
      return cb(null, file);
    }

    results = polishCSS(contents, file.path);

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