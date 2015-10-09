var fs   = require('fs');
var path = require('path');
var _    = require('lodash');

module.exports = function getConfig (file, plugins){
  var configDir      = path.join(file.path.replace(process.cwd(),''), '../'),
      filename       = path.basename(file.relative, path.extname(file.relative)),
      defaultConfig  = {},
      config         = {},
      ignoredPlugins = [],
      mergeConfig    = function(configDir){
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
        return _.extend({}, loadedConfig, config);
      };

  while (configDir !== '/') {
    config = mergeConfig(configDir);
    configDir = path.join(configDir, '..');
  }

  // Make an object with all plugins enabled.
  Object.keys(plugins).forEach(function(ruleName){
    defaultConfig[ruleName] = true;
  });

  // Merge one last time to capture the top-level directory's config
  config = _.extend({}, defaultConfig, mergeConfig(configDir));

  if (config.fileConfigs && config.fileConfigs[filename]){
    config = _.extend({}, config, config.fileConfigs[filename]);
  }

  _.each(_.keys(config), function(plugin) {
    if (!config[plugin]) {
      ignoredPlugins.push(plugin);
    }
  });

  return ignoredPlugins;
};
