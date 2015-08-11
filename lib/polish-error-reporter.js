var through    = require('through2'),
    _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

function printErrors (file, errors){
  if (!errors.length){
    return;
  }

  var output = chalk.underline(file.path) + '\n',
      lineErrors = [],
      fileErrors = [];

  _.each(errors, function (error){
    if (error.data.source) {
      lineErrors.push(error);
    } else {
      fileErrors.push(error);
    }
  });

  _.each(fileErrors, function (error){
    output += table([
      [
        chalk.red(error.rule.message)
      ]
    ]);

    output += '\n';
  });

  _.each(lineErrors, function (error){
    output += table([ 
      [
        chalk.gray('line ' + error.data.source.start.line),
        chalk.gray('col ' + error.data.source.start.column),
        error.data.selector,
        chalk.red(error.rule.message)
      ] 
    ]);

    output += '\n';
  });

  output += chalk.yellow(logSymbols.warning + ' ' + errors.length + ' warnings\n');

  console.log(output);
}

function reporter (){
  return through.obj(function (file, enc, cb) {
    if (!file.isBuffer()) {
      return cb(null, file);
    }

    if (file.polish && !file.polish.success) {
      printErrors(file, file.polish.results);
    }

    return cb(null, file);
  });
}

module.exports = reporter;