var fs   = require('fs');
var path = require('path');
var _    = require('lodash');

var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

var gonzales = require('gonzales-pe');

var PLUGIN_NAME = 'gulp-polish';

module.exports = function(file, syntax){
  var filetype = path.extname(file.path).replace('.','').toLowerCase();

  if (!_.contains(['css','scss','sass','less'], filetype)){
    throw new PluginError(PLUGIN_NAME, 'Only files with the following extensions can be polished: css, scss, sass, less.');
  }

  return {
    name:   path.basename(file.path).split('.')[0],
    cssDOM: gonzales.parse(file.contents.toString('utf8'), { syntax: filetype })
  };
};