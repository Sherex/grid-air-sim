const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { IgnorePlugin } = require('webpack')

module.exports = {
  entry: {
    grid: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: 'Grid Air Sim',
      template: 'src/web/index.html',
      inject: 'head'
    }),
    new IgnorePlugin({ resourceRegExp: /^colors$/ }),
    new CopyPlugin({
      patterns: [
        { from: './src/web/sketch.js', to: './' }
      ]
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'airSim',
    libraryTarget: 'var'
  },
  mode: 'development'
}
