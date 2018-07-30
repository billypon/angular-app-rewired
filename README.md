## Usage

ng-rewired.js of your project root:

```javascript
var stylusLoader = require('stylus-loader');

module.exports = {
  getStylesConfig: function (config) {
    config.plugins.push(new stylusLoader.OptionsPlugin({
      default: {
        include: [__dirname + '/node_modules']
      }
    }));
  }
}
```

modify script in package.json(ng -> ng-rewired):

```javascript
"scripts": {
  "start": "ng-rewired serve",
  "build": "ng-rewired build --prod"
}
```

call ng-rewired-configs in shell, will show you all support configs for ng-rewired.js.
