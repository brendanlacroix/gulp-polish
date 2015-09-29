var requireDir  = require('require-dir');
var path        = require('path');
var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-polish';

module.exports = function(plugins){
  var rules = {};

  _.each(plugins, function(plugin){
    if (plugin.indexOf('polish-plugin-') !== 0){
      throw new PluginError(PLUGIN_NAME, 'Only modules prefixed with "polish-plugin-" can be used with Polish.');
    }

    var rule = require(path.join(process.cwd(), 'node_modules', plugin)),
        name = plugin.replace('polish-plugin-', '');

    // Only test with rules that have an error message and a test that is a function.
    if (rule.message && rule.test && typeof rule.test === 'function') {
      rules[name] = rule;
      rules[name].name = name;
    }
  });

  return rules;
};