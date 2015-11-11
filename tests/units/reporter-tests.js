define([
  'require',
  'intern/chai!',
  'intern/dojo/node!sinon-chai',
  'intern/dojo/node!sinon',
  'intern/dojo/node!../../lib/reporter'
], function (require, chai, sinonChai, sinon, reporter) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      vinylFile     = require('intern/dojo/node!vinyl-file'),
      polish        = require('intern/dojo/node!../../lib/plugin');

  chai.use(sinonChai);

  registerSuite(function() {
    var consoleLogStub;

    return {
      name: 'gulp-polish reporter',

      beforeEach: function() {
        consoleLogStub = sinon.stub(console, 'log');
      },
      afterEach: function() {
        consoleLogStub.restore();
      },

      'test that the file is returned if it does not have a polish key': function() {
        var deferred     = this.async(3000),
            stylesheet   = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
            gulpReporter = reporter();

        gulpReporter.write(stylesheet);

        gulpReporter.once('data', deferred.callback(function(file) {
          assert.notOk(file.polish);
          assert.strictEqual(file, stylesheet);
          chai.expect(consoleLogStub).to.not.be.called;
        }));
      },
      'test that the file is returned if polish does not find any errors or warnings': function() {
        var deferred     = this.async(3000),
            stylesheet   = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
            gulpReporter = reporter();

        gulpReporter.write(stylesheet);

        gulpReporter.once('data', deferred.callback(function(file) {
          file.polish = {
            success: false
          };

          assert.strictEqual(file, stylesheet);
          chai.expect(consoleLogStub).to.not.be.called;
        }));
      },
      'test that the total number of warnings and errors is reported': function() {
        var deferred     = this.async(3000),
            stylesheet   = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
            gulpReporter = reporter(),
            gulpPolish   = polish();

        gulpPolish.write(stylesheet);

        gulpPolish.once('data', function(file) {
          gulpReporter.write(file);
          gulpPolish.emit('end');
        });

        gulpPolish.once('end', function() {
          consoleLogStub.reset();
          gulpReporter.emit('end');
        });

        gulpReporter.once('end', deferred.callback(function() {
          chai.expect(consoleLogStub).to.be.calledWithMatch('Total errors: 1');
          chai.expect(consoleLogStub).to.be.calledWithMatch('Total warnings: 1');
        }));
      },
      'test that reporting the total number of warnings and errors can be turned off': function() {
        var deferred     = this.async(3000),
            stylesheet   = vinylFile.readSync('./tests/helpers/css/one-error-one-warning.css'),
            gulpReporter = reporter({ reportTotal: false }),
            gulpPolish   = polish();

        gulpPolish.write(stylesheet);

        gulpPolish.once('data', function(file) {
          gulpReporter.write(file);
          gulpPolish.emit('end');
        });

        gulpPolish.once('end', function() {
          consoleLogStub.reset();
          gulpReporter.emit('end');
        });

        gulpReporter.once('end', deferred.callback(function() {
          chai.expect(consoleLogStub).to.not.be.called;
        }));
      }
    };
  });
});
