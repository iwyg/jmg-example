var path              = require('path');
var webpack           = require('webpack');

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
    grid: 'grid/index.js',
  },
  output: {
    path: __dirname + '/' + buildDir,
    filename: '[name]/index.js',
    //chunkFilename: '[name]/[name]_[chunkhash].js',
    publicPath: '/',
    sourceMapFilename: '[file].map'
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.scss', '.json'],
    //root: [
    //  path.resolve('./node_modules')
    //],
    alias: {
      modernizr$: path.resolve(__dirname, srcDir + '/modernizr.json')
    },
    modulesDirectories: [
      'web_modules',
      'node_modules',
      path.resolve(__dirname, './node_modules'),
      path.resolve(__dirname, './public/src'),
      path.resolve(__dirname, './public/src/scss'),
      path.resolve(__dirname, './public/src/icons'),
      path.resolve(__dirname, './public/src/modules'),
      path.resolve(__dirname, './public/src/runtime'),
      path.resolve(__dirname, './public/src/components'),
    ],
  },
  module: {
    loaders:[
      // svg icons n stuff
      { test: /\.svg$/,
        loader: 'babel!svg-react?reactDOM=react'
      },
      // simply parse global styles
      {
        test: /public\/src\/.*?\.(.css|.scss)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css'
          +'!postcss'
          +'!sass'
          +'?includePaths[]=node_modules/normalize.css'
          +'&includePaths[]=node_modules/breakpoint-sass/stylesheets'
          +'&includePaths[]=node_modules/susy/sass'
        )
      },
      // namespaced styles
      {
        test: /react-toolbox\/.*\.(.css|.scss)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          //'css'
          'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
          +'!postcss'
          +'!sass'
          //+'!sass?sourceMap'
          +'!toolbox'
        )
      },
      {
        test: /\.jsx?$/,
        exclude: '/node_modules',
        loader: 'babel',
        query: {
          cacheDirectory: true,
          sourceMap: true,
          presets: ['react', 'es2015'],
          //plugins: ['transform-object-rest-spread', 'transform-runtime'],
          plugins: ['transform-object-rest-spread'],
        }
      },
      {
        test: /\modernizr\.json$/,
        loader: 'modernizr'
      },
      //{
      //  test: /\.(scss?|sass)$/,
      //  loader: ExtractTextPlugin.extract('style', 'css?minimize!postcss!sass?'
      //    + 'includePaths[]=public/src/assets'
      //    +'&includePaths[]=public/src/scss'
      //    +'&includePaths[]=node_modules/breakpoint-sass/stylesheets'
      //    +'&includePaths[]=node_modules/reset.scss'
      //    +'&includePaths[]=node_modules/susy/sass'
      //   )
      //},
      //{
      //  test: /\.css$/,
      //  loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      //},
    ]
  },
  toolbox: {
    theme: path.join(__dirname, 'public/src/styles/toolbox-theme.scss')
  },
  postcss: function () { return [autoprefixer];},
  //postcss: function () {
  //  return [autoprefixer, precss];
  //},
  stats: {
    colors: true
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css', {allChunks: true}),
    //new webpack.DefinePlugin({
    //  'process.env.NODE_ENV': JSON.stringify('development')
    //})
  ],
  devtool: [
    'source-map'
  ]
};
