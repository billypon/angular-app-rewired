#!/usr/bin/env node

var fs = require('fs');

var find = require('module-find')();
var angular = find('@angular/cli');

var args = process.argv.slice(2);
var bin = 'ng';
var cmd = args[0];
var args = args.slice(1);

if (!angular) {
  throw new Error('there\'s no local anguar cli in your project');
}

var rewiredConfig = process.cwd() + '/ng-rewired.js';
var webpackConfigs = lookupWebpackConfig();

if (!fs.existsSync(webpackConfigs)) {
  throw new Error('can\'t find webpack config of angular cli');
}

if (fs.existsSync(rewiredConfig)) {
  switch (cmd) {
    case 'start':
    case 'build':
    case 'serve':
    case 'test':
    case 'e2e':
      rewiredConfig = require(rewiredConfig);
      webpackConfigs = require(webpackConfigs);
      for (var x in webpackConfigs) {
        if (rewiredConfig[x]) {
          rewireWebpackConfig(webpackConfigs, x);
        }
      }
      break;
  }
}

require(angular + '/bin/ng');

function lookupWebpackConfig() {
  var paths = [
    process.cwd() + '/node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs',
    angular + '/models/webpack-configs'
  ];
  for (var i in paths) {
    if (fs.existsSync(paths[i])) {
      return paths[i];
    }
  }
}

function rewireWebpackConfig(webpackConfigs, x) {
  var webpackConfig = webpackConfigs[x];
  webpackConfigs[x] = function () {
    var config = webpackConfig.apply(this, arguments);
    return rewiredConfig[x](config) || config;
  }
}
