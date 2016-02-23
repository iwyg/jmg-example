var path              = require('path');
//var webpack           = require('webpack');
var autoprefixer      = require('autoprefixer');
var precss            = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//var modules                = path.resolve(__dirname, './src/js/modules');
//var nodeModules       = path.resolve(__dirname, './node_modules');

var base              = 'public';
var buildDir          = base + '/dist';
var srcDir            = base + '/src';

module.exports = {
  context: path.resolve(__dirname, './' + srcDir + '/'),
  entry: {
    //index: 'index.js',
    grid: 'grid.js',
    //api: 'api.js'
  },
  output: {
    path: __dirname + '/' + buildDir,
    filename: '[name]/index.js',
    publicPath: '/',
    sourceMapFilename: '[name]/index.map'
  },
  resolve: {
    root: [
      path.resolve('./node_modules')
    ],
    alias: {
      modernizr$: path.resolve(__dirname, '/jssrcmodernizr.json')
    },
    modulesDirectories: ['web_modules', 'node_modules', 'public/src']
  },
  module: {
    resolve: {
      extensions: ['', '.jsx', '.js', '.scss'],
    },
    loaders:[
      {
        test: /\.jsx?$/,
        exclude: '/node_modules',
        loader: 'babel'
      },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr'
      }
    ],
  },
  postcss: function () {
    return [autoprefixer, precss];
  },
  stats: {
    colors: true
  },

  plugins: [
    new ExtractTextPlugin('css/main.css')
  ]
};
