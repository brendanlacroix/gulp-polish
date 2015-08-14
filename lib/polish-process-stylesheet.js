var fs   = require('fs');
var path = require('path');
var Q    = require('kew');

var gonzales = require('gonzales-pe');

module.exports = function(file){
  return {
    name:   path.basename(file.path).split('.')[0],
    cssDOM: gonzales.parse(file.contents.toString('utf8'), { syntax: 'scss' })
  };
};