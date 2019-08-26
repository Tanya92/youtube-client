const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: './assets/', to: './assets' },
    ]),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({}),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
};
