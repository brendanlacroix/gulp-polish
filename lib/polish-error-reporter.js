var through    = require('through2'),
    _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

var astHelpers = require('./polish-ast-helpers');

function printErrors (file, errors){
  if (!errors.length){
    return;
  }

  var output = chalk.underline(file.path) + '\n',
      lineErrors = [],
      fileErrors = [];

  _.each(errors, function (error){
    if (error.data.rule) {
      lineErrors.push(error);
    } else {
      fileErrors.push(error);
    }
  });

  _.each(fileErrors, function (error){
    var message; 

    if (_.isFunction(error.rule.message)) {
      message = error.rule.message(error);
    } else {
      message = error.rule.message;
    }

    output += table([
      [
        chalk.gray('File warning: '),
        chalk.red(message)
      ]
    ]);

    output += '\n';
  });

  _.each(lineErrors, function (error){
    var selector = astHelpers.getSelector(error.data.rule),
        message;

    if (_.isFunction(error.rule.message)) {
      message = error.rule.message(error);
    } else {
      message = error.rule.message;
    }

    if (selector.length > 50) {
      selector = selector.slice(0, 50);
      selector += '...';
    }

    output += table([ 
      [
        chalk.gray('line ' + error.data.rule.start.line),
        chalk.gray('col ' + error.data.rule.start.column),
        selector,
        chalk.red(message)
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