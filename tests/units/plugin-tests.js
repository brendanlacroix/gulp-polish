define(function (require) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      vinylFile     = require('intern/dojo/node!vinyl-file'),
      polish        = require('intern/dojo/node!../../lib/plugin');

  registerSuite({
    name: 'gulp-polish plugin',
    'test that it does not run Polish if the file is not a buffer': function() {
      var deferred   = this.async(3000),
          stylesheet = vinylFile.readSync('./tests/helpers/css/passes-all.css', { buffer: false }),
          gulpPolish = polish();

      gulpPolish.write(stylesheet);

      gulpPolish.once('data', deferred.callback(function(file) {
        assert.equal(file, stylesheet);
        assert.isUndefined(file.polish);
      }));
    },
    'test that it adds a `polish` object to the file that records success and empty error & warning arrays on success': function(){
      var deferred   = this.async(3000),
          stylesheet = vinylFile.readSync('./tests/helpers/css/passes-all.css'),
          gulpPolish = polish();

      gulpPolish.write(stylesheet);

      gulpPolish.once('data', deferred.callback(function(file) {
        assert.ok(file.polish.success);
        assert.lengthOf(file.polish.errors, 0);
        assert.lengthOf(file.polish.warnings, 0);
      }));
    },
    'test that it adds a `polish` object to the file that records errors and warnings': function(){
      var deferred   = this.async(3000),
          stylesheet = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
          gulpPolish = polish();

      gulpPolish.write(stylesheet);

      gulpPolish.once('data', deferred.callback(function(file) {
        assert.isFalse(file.polish.success);
        assert.lengthOf(file.polish.errors, 1);
        assert.lengthOf(file.polish.warnings, 1);
      }));
    },
    'test that it returns the file': function(){
      var deferred   = this.async(3000),
          stylesheet = vinylFile.readSync('./tests/helpers/css/passes-all.css'),
          gulpPolish = polish();

      gulpPolish.write(stylesheet);

      gulpPolish.once('data', deferred.callback(function(file) {
         assert.equal(file, stylesheet);
      }));
    },
    'test that the plugin and reporter are both exported': function() {
      assert.isFunction(polish);
      assert.property(polish, 'reporter');
      assert.lengthOf(Object.keys(polish), 1);
    }
  });
});
