#!/usr/bin/env node

var find = require('module-find')();
var angular = find('@angular/cli');

var args = process.argv.slice(2);
var bin = 'ng';
var cmd = args[0];
var args = args.slice(1);

var rewiredConfig = process.cwd() + '/ng-rewired.js';
if (require('fs').existsSync(rewiredConfig)) {
  switch (cmd) {
    case 'start':
    case 'build':
    case 'serve':
    case 'test':
    case 'e2e':
      rewiredConfig = require(rewiredConfig);
      var webpackConfigs = require(angular + '/models/webpack-configs');
      for (var x in webpackConfigs) {
        if (rewiredConfig[x]) {
          rewireWebpackConfig(webpackConfigs, x);
        }
      }
      break;
  }
}

require(angular + '/bin/ng');

function rewireWebpackConfig(webpackConfigs, x) {
  var webpackConfig = webpackConfigs[x];
  webpackConfigs[x] = function () {
    var config = webpackConfig.apply(this, arguments);
    return rewiredConfig[x](config) || config;
  }
}
