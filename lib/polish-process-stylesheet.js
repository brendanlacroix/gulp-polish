var fs   = require('fs');
var path = require('path');
var Q    = require('kew');

var postcss              = require('postcss');
var postcssInlineComment = require('postcss-inline-comment');
var postcssVariables     = require('postcss-advanced-variables');
var postcssNested        = require('postcss-nested');
var postcssFor           = require('postcss-for');
var postcssSassExtend    = require('postcss-sass-extend');
var postcssConditionals  = require('postcss-conditionals');

var processor = postcss([
  postcssInlineComment,
  postcssVariables,
  postcssNested, 
  postcssFor,
  postcssSassExtend,
  postcssConditionals
]);

module.exports = function(file){
  var promise = new Q.defer(),
      fileContents = file.contents.toString('utf8');

  // Once the file is stored, parse the CSS and store that on the Stylesheet.
  processor.process(fileContents).then(function(data){
    promise.resolve({
      name:   path.basename(file.path).split('.')[0],
      cssDOM: data.root
    });
  });

  return promise;
};