define(function (require) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      vinylFile     = require('intern/dojo/node!vinyl-file'),
      polish        = require('intern/dojo/node!../../lib/plugin'),
      getConfig     = require('intern/dojo/node!../../lib/get-config');

  registerSuite({
    name: 'gulp-polish get-config',
    'test that configurations can be passed in via config file': function() {
      var stylesheet = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
          config     = getConfig(stylesheet);

      assert.sameDeepMembers(config, [
        { module: 'polish-no-styling-elements', severity: 1 },
        { module: 'polish-no-styling-ids', severity: 2 },
        { module: 'polish-match-stylesheet-names-to-rules', severity: 2 },
        { module: 'polish-banned-selectors', severity: 2, selectors: ['.this-is-banned', '.so-is-this'] }
      ]);
    },
    'test that configurations can be passed in as part of a gulp task definition': function() {
      var deferred   = this.async(3000),
          stylesheet = vinylFile.readSync('./tests/helpers/css/two-errors-using-task-config.css'),
          config     = [
            { module: 'polish-no-bang-important', severity: 2 }
          ],
          gulpPolish = polish(config);

      gulpPolish.write(stylesheet);

      gulpPolish.once('data', deferred.callback(function(file) {
        assert.notOk(file.polish.success);
        assert.lengthOf(file.polish.errors, 2);
        assert.lengthOf(file.polish.warnings, 0);
      }));
    },
    'test that the severity can be changed without having to reset plugin options': function() {
      var stylesheet = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
          config     = getConfig(stylesheet);

      assert.sameDeepMembers(config, [
        { module: 'polish-no-styling-elements', severity: 1 },
        { module: 'polish-no-styling-ids', severity: 2 },
        { module: 'polish-match-stylesheet-names-to-rules', severity: 2 },
        { module: 'polish-banned-selectors', severity: 2, selectors: ['.this-is-banned', '.so-is-this'] }
      ]);
    },
    'test that configurations closer to the file directory beat out configs closer to the cwd': function() {
      var stylesheet = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
          config     = getConfig(stylesheet);

      assert.sameDeepMembers(config, [
        /* These two differ between the directory's config and the higher-level config */
        { module: 'polish-no-styling-elements', severity: 1 },
        { module: 'polish-banned-selectors', severity: 2, selectors: ['.this-is-banned', '.so-is-this'] },

        /* These are only included here because sameDeepMembers doesn't allow a partial match */
        { module: 'polish-no-styling-ids', severity: 2 },
        { module: 'polish-match-stylesheet-names-to-rules', severity: 2 }
      ]);
    },
    'test that file-level configurations are added before other configs': function() {
      var stylesheet = vinylFile.readSync('./tests/helpers/css/passes-all.css'),
          config     = getConfig(stylesheet);

      assert.strictEqual(config[0].module, 'polish-banned-selectors');
      assert.strictEqual(config[0].severity, 1);

      assert.sameDeepMembers(config, [
        /* These two differ between the directory's config and the higher-level config */
        { module: 'polish-no-styling-elements', severity: 1 },
        { module: 'polish-banned-selectors', severity: 1, selectors: ['.this-is-banned', '.so-is-this'] },

        /* These are only included here because sameDeepMembers doesn't allow a partial match */
        { module: 'polish-no-styling-ids', severity: 2 },
        { module: 'polish-match-stylesheet-names-to-rules', severity: 2 }
      ]);
    }
  });
});
