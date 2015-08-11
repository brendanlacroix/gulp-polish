var fs   = require('fs');
var path = require('path');
var _    = require('lodash');

module.exports = function(file, rules){
  var configDir     = path.join(file.path.replace(process.cwd(),''), '../'),
      defaultConfig = {},
      config        = {},
      mergeConfig   = function(configDir){
        var configPath   = path.join(configDir, '.polish'),
            loadedConfig = {};

        // Use a try-catch to account for missing configs.
        try {
          loadedConfig = require(path.join(process.cwd(), configPath));
        } catch (e) {
          loadedConfig = {};
        }

        // Create the config by merging it with each parent directory's config.
        // Rule configs in higher directories are overwritten by those configs
        // nearer to the file.
        return _.extend(loadedConfig, config);
      };

  while (configDir !== '/') {
    config = mergeConfig(configDir);
    configDir = path.join(configDir, '..');
  }

  // Make an object with all rules enabled.
  Object.keys(rules).forEach(function(ruleName){
    defaultConfig[ruleName] = true;
  });

  // Merge one last time to capture the top-level directory's config
  config = _.extend(defaultConfig, mergeConfig(configDir));

  return config;  
};