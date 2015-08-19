# gulp-polish

Make your stylesheets perfect. Add an extra coat of polish.

# Overview

Every engineer and every company has a different idea of what good stylesheets look like. Beauty's subjective.
So stop letting someone else write your linter. Make up your own rules.

With gulp-polish, you can! 

Spend less time reviewing pull requests. Make learning your rules simpler for new additions to the team. Keep
your code more consistent and more reliable... 

Or don't. You're the boss.

_gulp-polish works with CSS, SCSS, Sass, and Less._

  
## Install
`npm install --save gulp-polish`


## Gulp task
```
var gulp   = require('gulp');
var polish = require('gulp-polish');

gulp.task('polish', function() {
  return gulp.src('./test_stylesheets/**/*.scss')
    .pipe(polish({
      rulesDirectory: './rules'    // Path to your rules directory
    }))
    .pipe(polish.reporter());
});
```

You can write your own reporter (check out the Results section below), but if you want to just use the 
default (which prints to the console), pipe it through `polish.reporter()` as well.


## Results

gulp-polish adds the following properties to the file object:

```
file.polish.success = true; // or false

// The config used to test the file
file.polish.config = { ruleOne: true, ruleTwo: false }

file.polish.results = [...]; // An array of errors (see below)
```

An error looks like this:
```
{
  file: '/Absolute/path/to/the/file.scss',
  rule: {
    name: 'rule-name',
    message: 'Do not break this rule!'
  },
  data: { ... } // An error you create in your rules (see Writing Rules).
}
```

The gonzales-pe AST object is [documented here](https://github.com/tonyganch/gonzales-pe/tree/dev#astmapfunction).


## Writing rules

Rules must export both a `message` and a `test`.

**`message` can be either a string or a function.** If a function, it will be called with the entire error object by `polish.reporter()`.

**`test` must be a function.** It must return an array of objects you compose within your linter. Each object you push into the returned array will be used to generate an error.

`test` is passed one object when it is called that includes the AST and file name:

```
{
  name: 'your-stylesheet',
  cssDOM: { ... }
}
```

You can return failures from your rule in one of two formats. The object you create will be stored on the error under the `data` key (see Results).

- **AST node-level failure** 
  
  If you have found an issue with one of the AST nodes, make an object and shove that     node under a `rule` key.
  
  ```
  {
    rule: { ... },
    message: ''      // message isn't treated in any special way, but you
                     // can use it to pass text from your linter into the
                     // message function, should choose to use it.
  }
  ```
  
  If you push this object to `test`'s returned array, it will be printed with a line  
  and column number for where that node starts.
  
  
- **File-level failure** 
  
  If you have found an issue with the whole file, make an object and shove the `file`    
  argument passed into your test function under a `file` key.
  
  ```
  {
    file: file,
    message: ''      // message isn't treated in any special way, but you
                     // can use it to pass text from your linter into the
                     // message function, should choose to use it.
  }
  ```
  
  If you push this object to `test`'s returned array, it'll report without line and 
  column numbers and simply say "File warning: " before your error message.
  

## Sample rules


**AST node-level failure**

```
var _ = require('lodash');

module.exports = {
  message: 'Border should not be set explicitly. Use the "@include border" mixin.',
  test: function(file){
    var errors = [];

    file.cssDOM.traverseByType('ruleset', function(rule){
      rule.forEach('block', function (block){
        block.forEach('declaration', function (declaration){
          declaration.forEach('property', function (property){
            var ident = property.contains('ident') && property.first('ident');

            if (ident.content !== 'border') {
              return;
            }
            
            errors.push({
              rule: rule
            });
          });
        });
      });
    });

    return errors;
  }
};
```

**File-level failure** 
```
var _          = require('lodash');
var pluralize  = require('pluralize');
var polish     = require('gulp-polish');
var astHelpers = polish.astHelpers;

module.exports = {
  message: function(error){
    return 'Stylesheets should be named to match their top-level rule. Expected filename to match "' + error.data.message + '".';
  },
  test: function(file){
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
  }
}
```


  
## Configuring rules

To configure which rules are applied on a per-directory basis, use `.polish.json` files. The config will inherit from its parents directories. Just create a simple JSON object that specifies rules to include/exclude by filename.

```
{
  "no-js-styles": false,
  "no-styling-elements": false
}
```



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