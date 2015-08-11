var fs   = require('fs');
var path = require('path');
var Q    = require('kew');

var postcss             = require('postcss');
var postcssEach         = require('postcss-each');
var postcssFor          = require('postcss-for');
var postcssConditionals = require('postcss-conditionals');
var postcssMixins       = require('postcss-mixins');
var postcssNested       = require('postcss-nested');
var postcssSimpleExtend = require('postcss-simple-extend');
var postcssSimpleVar    = require('postcss-simple-vars');

var processor = postcss([
  postcssEach, 
  postcssFor, 
  postcssConditionals, 
  postcssMixins, 
  postcssNested, 
  postcssSimpleExtend, 
  postcssSimpleVar
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