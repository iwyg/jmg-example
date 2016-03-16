
var base = require('./webpack.config');

var config = {
  output: base.output || {},
  devtool: [
    'source-map'
  ],
  devServer: {
  contentBase: 'dist/',
    hot: true,
    inline: true
  }
};

config.output.sourceMapFilename = '[file].map';

module.exports = Object.assign({}, base, config);
