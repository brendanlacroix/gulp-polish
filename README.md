# gulp-polish

[![Build Status](https://travis-ci.org/brendanlacroix/gulp-polish.svg?branch=master)](https://travis-ci.org/brendanlacroix/gulp-polish) [![codecov.io](https://codecov.io/github/brendanlacroix/gulp-polish/coverage.svg?branch=master)](https://codecov.io/github/brendanlacroix/gulp-polish?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/brendanlacroix/gulp-polish/badges/score.svg)](https://www.bithound.io/github/brendanlacroix/gulp-polish) [![bitHound Dependencies](https://www.bithound.io/github/brendanlacroix/gulp-polish/badges/dependencies.svg)](https://www.bithound.io/github/brendanlacroix/gulp-polish/master/dependencies/npm)

gulp plugin for integrating [Polish](https://github.com/brendanlacroix/polish-css).

## Install
`npm install --save gulp-polish`

## Gulp task
```
var gulp   = require('gulp');
var polish = require('gulp-polish');

gulp.task('polish', function() {
  return gulp.src('./test_stylesheets/**/*.scss')
    .pipe(polish())
    .pipe(polish.reporter());
});
```

## Results

gulp-polish adds the following properties to the file object:

```
file.polish.success = false;  // or true, if there aren't any warnings or errors!

file.polish.errors = [...];   // Every failure with severity 2
file.polish.warnings = [...]; // Every failure with severity 1
```


## Configuring rules

To configure which rules are applied on a per-directory basis, use `.polish.json` files.
The config will inherit from its parents directories. Just create a simple JSON object
that specifies rules to include/exclude by filename.

```
[
  {
    "module"   : "polish-no-styling-elements",
    "severity" : 2 // an error
  },
  {
    "module"   : "polish-no-bang-important",
    "severity" : 1 // a warning
  },
  {
    "module"    : "polish-no-banned-selectors",
    "severity"  : 0 // ignored,
    "selectors" : [".these", "#will", ".be", "#banned"]
  }
]
```


If you want to disable a particular ruleset in a file, you can do an inline config that will apply only
to the next rule in the sheet:

```
/* polish no-styling-ids=false */
#now-this-wont-be-an-error {
  color: green;
}

#but-this-one-will-be {
  color: red;
}
```

## License
This project is licensed under the terms of the MIT license.
