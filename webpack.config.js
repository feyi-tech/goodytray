const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'?'development':'production';


const js = {
  test: /\.js$/,
  exclude: [/node_modules/],
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['react', 'es2015'],
      plugins: ['transform-class-properties']
    }
  }
}
/*
const css = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // you can specify a publicPath here
        // by default it uses publicPath in webpackOptions.output
        publicPath: 'dist/public',
        hmr: process.env.NODE_ENV === 'development',
      },
    },
    'css-loader'
  ]
}
*/
const fonts = {
  test: /\.(woff|ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  exclude: [/node_modules/],
  use: ['file-loader']
}

const serverConfig = {
  mode: devMode,
  target: 'node',
  externals: [nodeExternals()],
  node: {
    __dirname: false
  },
  entry: {
    'index.js': path.resolve(__dirname, 'src/index.js')
  },
  module: {
    rules: [js, fonts]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
  }
}

const clientConfig = {
  mode: devMode,
  target: 'web',
  entry: {
    'multipleRoutes.js': path.resolve(__dirname, 'src/public/multipleRoutes.js')
  },
  module: {
    rules: [js, fonts]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: '[name]'
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs: 'empty'
    
  }
}

module.exports = [serverConfig, clientConfig]
