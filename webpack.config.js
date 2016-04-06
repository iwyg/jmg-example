var path              = require('path');
var webpack           = require('webpack');

var process           = require('process');
var autoprefixer      = require('autoprefixer');
var precss            = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var base              = 'public';
var buildDir          = base + '/dist';
var srcDir            = base + '/src';

module.exports = {
  context: path.resolve(__dirname, './' + srcDir + '/'),
  entry: {
    index: 'index/index.js',
    playground: 'playground/index.js',
  },
  output: {
    path: __dirname + '/' + buildDir,
    filename: '[name]/index.js',
    //chunkFilename: '[name]/[name]_[chunkhash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.scss', '.json'],
    root: [
      path.resolve('./node_modules')
    ],
    alias: {
      modernizr$: path.resolve(__dirname, srcDir + '/modernizr.json')
    },
    modulesDirectories: [
      'web_modules',
      'node_modules',
      path.resolve(__dirname, './node_modules'),
      path.resolve(__dirname, './node_modules/prismjs'),
      path.resolve(__dirname, './node_modules/prismjs/components'),
      path.resolve(__dirname, './public/src'),
      path.resolve(__dirname, './public/src/scss'),
      path.resolve(__dirname, './public/src/icons'),
      path.resolve(__dirname, './public/src/fonts'),
      path.resolve(__dirname, './public/src/modules'),
      path.resolve(__dirname, './public/src/runtime'),
      path.resolve(__dirname, './public/src/components'),
    ],
  },
  module: {
    loaders:[
      //// fonts
      {
        test   : /fonts?\/.*\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader : 'file-loader?name=../dist/[path][name].[ext]'
      },

      {
        test    : /images?\/.*\.(jpe?g|png|gif)(\?[a-z0-9]+)?$/,
        loaders : [
          'file?name=../dist/[path][name].[ext]',
          'image-webpack?bypassOnDebug=false&optimizationLevel=7&interlaced=false&progressive=true&quality=30'
        ]
      },
      //{
      //  test   : /fonts?\/.*\.(ttf|eot|svg|woff(2))(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //  loader : 'file-loader?name=/dist/[path][name].[ext]'
      //},
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
          +'!sass?config=sassLoader'
          +'!toolbox?includePaths[]=public/src/styles'
        )
      },
      // namespaced styles
      {
        test: /react-toolbox\/.*\.(.css|.scss)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
          +'!postcss'
          +'!sass?config=sassLoader'
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
          presets: ['react', 'es2015', 'stage-0'],
          //plugins: ['transform-object-rest-spread', 'transform-runtime'],
          plugins: ['transform-object-rest-spread'],
        }
      },
      {
        test: /\modernizr\.json$/,
        loader: 'modernizr'
      },
    ]
  },
  toolbox: {
    theme: path.join(__dirname, 'public/src/styles/toolbox-theme.scss')
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './public/src/styles'),
      path.resolve(__dirname, './public/src/fonts'),
      path.resolve(__dirname, './public/src/fonts/roboto'),
      path.resolve(__dirname, './node_modules/normalize.css'),
      path.resolve(__dirname, './node_modules/breakpoint-sass/stylesheets'),
      path.resolve(__dirname, './node_modules/susy/sass'),
      path.resolve(__dirname, './node_modules/react-toolbox/lib'),
      path.resolve(__dirname, './node_modules/react-toolbox/app'),
      path.resolve(__dirname, './node_modules/react-toolbox/components'),
    ]
  },
  postcss: function () {
    return [autoprefixer, precss];
  },
  stats: {
    colors: true
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css', {allChunks: true}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ])
  ],
};
