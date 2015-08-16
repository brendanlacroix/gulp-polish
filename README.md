# gulp-polish

Enforce CSS rules as you see fit!

  
## Install
`npm install --save gulp-polish`


## Gulp task
```
var gulp   = require('gulp');
var polish = require('gulp-polish');

gulp.task('polish', function() {
  return gulp.src('./test_stylesheets/**/*.scss')
    .pipe(polish({
      rulesDirectory: 'rules'
    }))
    .pipe(polish.reporter());
});
```

You can write your own reporter (check out the Results section below), but 
if you want to just use the default, pipe it through `polish.reporter()` as well.


## Writing rules

CSS-level rules:
```
var _ = require('lodash');

module.exports.message = 'Border should not be set explicitly. Use the @include border mixin.';

module.exports.test = function(file){
  var errors = [],
      rules = [];

  file.cssDOM.traverseByType('ruleset', function(rule){
    rules.push(rule);
  });

  _.each(rules, function(rule){
    rule.forEach('block', function (block){
      block.forEach('declaration', function (declaration){
        declaration.forEach('property', function (property){
          var ident = property.contains('ident') && property.first('ident');

          if (ident.content === 'border') {
            errors.push(rule);
          }
        });
      });
    });
  });

  return errors;
};
```

File-level rules:
```
var _         = require('lodash');
var pluralize = require('pluralize');

var polish     = require('gulp-polish');
var astHelpers = polish.astHelpers;

module.exports.message = function(string){
  return 'Stylesheets should be named to match their top-level rule. Expected filename to match "' + string + '".';
};

module.exports.test = function(file){
  var filename = file.name.trim(),
      rule     = file.cssDOM.contains('ruleset') && file.cssDOM.first('ruleset'),
      errors   = [],
      className,
      pluralClassName,
      pluralFilename;

  if (!rule) {
    return errors;
  }

  className = astHelpers.getConcatSelector(rule);

  filename = filename.indexOf('_') === 0 ? filename.replace('_','') : filename;
  filename = filename.replace(/_/g,'-');
  filename = filename.replace(' ','-');
  filename = '.' + filename;

  pluralFilename  = pluralize(filename);
  pluralClassName = pluralize(className);

  if (pluralFilename !== pluralClassName) {
    errors.push({
      file: file,
      message: className
    });
  }

  return errors;
};
```

All rules need to export both a `message` and a `test`.

`message` can be either a string or a function. The function will be called with the entire error object.

Whatever you push into the `errors` array is stored on the result in the `data` object. If you push a 
rule (or any node from the CSS DOM), the line and column numbers will be reported for any broken rules.

If you want to report a broken rule for the whole file (say, your filename breaks conventions), push an object
in the format:
```
{
  file: file,
  message: 'some message'
}
```
(That `message` key is useful for passing something to the `message` function).


The `file` argument passed into `test()` is an object: 
```
file = {
  name: '_file_name.scss',
  cssDOM: {...}
}
``` 

`file.polish.results.data` is a JSON AST returned by [gonzales-pe](https://github.com/tonyganch/gonzales-pe/tree/dev#astmapfunction). 
See gonzales-pe's documentation to figure out how to navigate the object.

  
## Options

- `rulesDirectory`
  - The path to the directory containing your rules.

- `.polish.json`
  - Add a `.polish.json` to any subdirectory to overwrite parent directory config and selectively run certain rules.

  
## Results
Adds the following properties to the file object:
```
file.polish.success = true; // or false

// The config used to test the file
file.polish.config = { ruleOne: true, ruleTwo: false }

file.polish.results = [{
  file: '/Absolute/path/to/the/file.scss',
    rule: {
      name: 'rule-name',
        message: 'Do not break this rule!'
    },
    data: { ... }
}];
```

`file.polish.results.data` is a JSON AST returned by [gonzales-pe](https://github.com/tonyganch/gonzales-pe/tree/dev#astmapfunction). 
See gonzales-pe's documentation to figure out how to navigate the object.


## Todo
- Tests!
- Inline comments work 50% of the time. Need to fix that PostCSS plugin or make sure it doesn't error
  
## License

The MIT License (MIT)

Copyright (c) 2015 Brendan LaCroix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.