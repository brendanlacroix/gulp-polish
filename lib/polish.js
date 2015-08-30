var getConfig         = require('./polish-get-config'),
    testFile          = require('./polish-test-file'),
    processStylesheet = require('./polish-process-stylesheet');

module.exports = function(file, rules){
  // If there are no rules, there's no need to continue.
  if (!rules || !Object.keys(rules).length) {
    return file;
  }

  var config          = getConfig(file, rules),
      processedStyles = processStylesheet(file),
      testResults     = testFile(file, processedStyles, rules, config);

  file.polish = {};

  if (testResults.length){
    file.polish.success = false;
    file.polish.results = testResults;
  } else {
    file.polish.success = true;
    file.polish.results = [];
  }

  return file;
};