var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var gonzales    = require('gonzales-pe');

var PLUGIN_NAME = 'gulp-polish';

function parseCommentRules (comment) {
  comment = comment.content.replace('polish', '').trim().replace(/=/g,':').split(' ');
  comment = comment.map(function(comm){
    var config = comm.split(':');
    config[1] = config[1] === 'false' ? false : true;
    return config;
  });
  comment = _.object(comment);
  return comment;
}

function readComment (comment, level) {
  if (comment.content.trim().indexOf('polish') !== 0) {
    return;
  }

  var commentIndex = _.indexOf(level.content, comment),
      adjacentRule;

  commentIndex++;

  /* Continue while an adjacent rule hasn't been found and there are unchecked nodes */
  while (!adjacentRule && level.content[commentIndex]) {
    if ( level.content[commentIndex].is('ruleset') ){
      adjacentRule = level.content[commentIndex];
    }

    commentIndex++;
  }

  if ( adjacentRule ){
    adjacentRule.ruleConfig = parseCommentRules(comment);
  }
}

module.exports = function(file, syntax){
  var filetype = path.extname(file.path).replace('.','').toLowerCase(),
      ast;

  if (!_.contains(['css','scss','sass','less'], filetype)){
    throw new PluginError(PLUGIN_NAME, 'Only files with the following extensions can be polished: css, scss, sass, less.');
  }

  ast = {
    name:   path.basename(file.path).split('.')[0],
    cssDOM: gonzales.parse(file.contents.toString('utf8'), { syntax: filetype })
  };

  ast.cssDOM.traverseByTypes(['multilineComment', 'singlelineComment'], function (comment, index, level, parent){
    readComment(comment, level);
  });

  return ast;
};