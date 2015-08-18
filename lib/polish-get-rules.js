var requireDir  = require('require-dir');
var path        = require('path');
var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-polish';

module.exports = function(directory){
  var rules = {},
      ruleFiles;

  try {
    // Require the entire rules directory
    ruleFiles = requireDir(path.join(process.cwd(), directory));
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new PluginError(PLUGIN_NAME, 'Missing module in one of your rules: ' + e.message);
    } else {
      throw new PluginError(PLUGIN_NAME, 'Rules directory not found');
    }
  }

  // Only test with rules that have an error message and a test that is a function.
  _.each(ruleFiles, function(rule, name){
    if (rule.message && rule.test && typeof rule.test === 'function') {
      rules[name] = rule;
      rules[name].name = name;
    }
  });

  return rules;  
};