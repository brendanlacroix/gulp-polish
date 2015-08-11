var _    = require('lodash');
var path = require('path');

module.exports = function(file, stylesheet, rules, config) {
  var errors         = [],
      directoryRules = _.filter(rules, function(value, key){
        return config[key];
      });

  _.each(directoryRules, function(rule){
    var failures = rule.test(stylesheet);

    if (!failures || !failures.length || !_.isArray(failures)){
      return;
    }

    _.each(failures, function(failure){
      errors.push({
        file: file.path,
        rule: _.pick(rule, ['name','message']),
        data: failure
      });
    });
  });

  return errors;
};