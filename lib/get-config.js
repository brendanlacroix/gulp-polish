var path = require('path'),
    _    = require('lodash');

module.exports = function getConfig (file, options) {
  var basename = path.basename(file.relative),
      config = [],
      configDir = path.join(process.cwd(), file.path.replace(process.cwd(),''), '../'),
      originalConfigDir = configDir,
      addPluginIfAbsent = function(moduleConfig) {
        var exists = _.find(config, function(plugin) {
          if (typeof plugin.module === 'string') {
            return plugin.module === moduleConfig.module || plugin.module === _.isObject(moduleConfig.module) && moduleConfig.module.name;
          }
        });

        if (Object.keys(moduleConfig).length > 2) {
          exists = _.defaults(exists, moduleConfig);
        }

        if (!exists) {
          config.push(moduleConfig);
        }
      },
      pushToConfig = function(configDir){
        var configPath   = path.join(configDir, '.polish.json'),
            loadedConfig = {},
            fileConfig;

        // Use a try-catch to account for missing configs.
        try {
          loadedConfig = require(configPath);
        } catch (e) {
          loadedConfig = {};
        }

        if (configDir === originalConfigDir) {
          fileConfig = loadedConfig.fileConfig && loadedConfig.fileConfig[basename];

          if (fileConfig && fileConfig.length) {
            _.each(fileConfig, addPluginIfAbsent);
          }
        }

        _.each(loadedConfig.config, addPluginIfAbsent);
      };


  while (configDir !== process.cwd()) {
    pushToConfig(configDir);
    configDir = path.join(configDir, '..');
  }

  pushToConfig(process.cwd());

  _.each(options, addPluginIfAbsent);

  return config;
};