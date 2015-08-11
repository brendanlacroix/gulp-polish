var Q = require('kew');

var getConfig  = require('./polish-get-config');
var testFile   = require('./polish-test-file');
var processCSS = require('./polish-process-stylesheet');

module.exports = function(file, rules){
  // If there are no rules, there's no need to continue.
  if (!Object.keys(rules).length) {
    return;
  }

  var config       = getConfig(file, rules),
      processedCSS = processCSS(file),
      promise      = new Q.defer(),
      testResults;

  file.polish = {};

  processedCSS.then(function(stylesheet){
    testResults = testFile(file, stylesheet, rules, config);

    if (testResults.length){
      file.polish.results = testResults;
      file.polish.success = false;
    } else {
      file.polish.success = true;
    }

    promise.resolve(file);
  });

  return promise;
};