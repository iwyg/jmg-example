
var base = require('./webpack.config');
var LiveReloadPlugin = require('webpack-livereload-plugin');

var config = {
  output: base.output || {},
  devtool: [
    'eval-source-map'
  ],
  devServer: {
  contentBase: 'dist/',
    hot: true,
    inline: true
  }
};

base.plugins.push(
  new LiveReloadPlugin({
    appendScriptTag: true
  })
);

config.output.sourceMapFilename = '[file].map';

module.exports = Object.assign({}, base, config);
