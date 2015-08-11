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
// Anything you want to include for rule-writing.
var _ = require('lodash');

// Error message to display when this rule isn't followed
module.exports.message = 'Classes beginning with `.js-` should not be styled. Only use them as Javascript hooks.';

// Test that returns errors in an array.
module.exports.test = function(stylesheet, file){
  var rules = _.where(stylesheet.cssDOM.nodes, { type: 'rule' }),
      errors = [];

  _.each(rules, function(rule){
    if (rule.selector.indexOf('.js-') !== -1){
      errors.push(rule);
    }
  });

  return errors;
}
```

File-level rules:
```
var _ = require('lodash');

module.exports.message = 'Stylesheets should be named to match their top-level rule.';

module.exports.test = function(file){
  var filename = file.name,
      rules = _.where(file.cssDOM.nodes, { type: 'rule' }),
      errors = [];

  filename = filename.indexOf('_') === 0 ? filename.replace('_','') : filename;
  filename = filename.replace('_','-');
  filename = '.' + filename;

  // If the test doesn't pass, push the whole file instead of a node
  if (filename !== rules[0].selector) {
    errors.push(file);
  }

  return errors;
};
```

All rules need to export both a `message` and a `test`.

Whatever you push into the `errors` array is stored on the result in the `data` object. If you push a 
rule (or any node from the CSS DOM), the line and column numbers will be reported for any broken rules.

If you want to report a broken rule for the whole file (say, your filename breaks conventions), 
push the passed in `stylesheet` argument to the `errors` array instead.

The `file` argument passed into `test()` is an object: 
```
file = {
  name: '_file_name.scss',
  cssDOM: {...}
}
``` 

Where cssDOM is the parsed CSS file returned by PostCSS. 
See PostCSS's [documentation](https://github.com/postcss/postcss/blob/43ae5e3338b8c9a7de7ba0cda586db5e9f83b35b/docs/api.md) 
to figure out how to navigate the object for use in your tests.

  
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
    data: { 
      nodes: {...},
        type: 'rule',
        parent: {...},
        source: {...},
        before: '\n\n',
        between: ' ',
        selector: '.some-selector-that-broke-the-rules',
        semicolon: true,
        after: '\n',
        lastEach: 9,
        indexes: {} 
  }
}];
```

`file.polish.results.data` is a node returned by PostCSS. 
See PostCSS's [documentation](https://github.com/postcss/postcss/blob/43ae5e3338b8c9a7de7ba0cda586db5e9f83b35b/docs/api.md) 
to figure out how to navigate the object.


## Todo
- Tests!

  
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