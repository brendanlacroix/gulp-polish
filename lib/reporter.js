var through     = require('through2'),
    chalk       = require('chalk'),
    logSymbols  = require('log-symbols'),
    polishCSS   = require('polish-css'),
    reporter    = polishCSS.reporter;

module.exports = function gulpPolishReporter (options){
  options = options || { reportTotal: true };

  var errors   = 0,
      warnings = 0;

  return through.obj(function (file, enc, cb) {
    if (!file.polish) {
      return cb(null, file);
    }

    if (file.polish && !file.polish.success) {
      reporter(file.path, file.polish.errors, file.polish.warnings);
      errors += file.polish.errors.length;
      warnings += file.polish.warnings.length;
    }

    return cb(null, file);
  })
  .on('end', function(){
    var output = '';

    if (options.reportTotal) {
      output += chalk.red(logSymbols.error + ' Total errors: ' + errors + '     ');
      output += chalk.yellow(logSymbols.warning + ' Total warnings: ' + warnings + '\n');
      console.log(output);
    }

    errors = 0;
    warnings = 0;
  });
};
