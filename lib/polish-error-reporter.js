var through    = require('through2'),
    _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

var astHelpers = require('./polish-ast-helpers');

var MAX_SELECTOR_LENGTH = 30;

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
    var selector = astHelpers.getConcatSelector(error.data.rule),
        message;

    if (_.isFunction(error.rule.message)) {
      message = error.rule.message(error);
    } else {
      message = error.rule.message;
    }

    if (selector.length > MAX_SELECTOR_LENGTH) {
      selector = selector.slice(0, MAX_SELECTOR_LENGTH);
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

function totalReporter (total){
  console.log(chalk.yellow(logSymbols.warning + ' Total warnings: ' + total + '\n'));
}

function reporter (options){
  options = options || {};

  var results = 0;

  return through.obj(function (file, enc, cb) {
    if (!file.isBuffer() || !file.polish) {
      return cb(null, file);
    }

    if (file.polish && !file.polish.success) {
      printErrors(file, file.polish.results);
    }

    results += file.polish.results.length;

    return cb(null, file);
  }).on('end', function(){
    if (options.reportTotal) {
      totalReporter(results);
    }

    results = 0;
  });
}

module.exports = reporter;