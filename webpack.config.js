const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: './src/app.js',
        contact: './src/contact.js'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].bundle.js'
    },
    module: {
      rules: [
          {
              test: /\.scss$/,
              use: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
              test: /\.js$/,
              exclude: /node_module/,
              use: 'babel-loader'
          }
      ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true,
        stats: "errors-only",
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            // minify: {
            //     collapseWhitespace: true
            // },
            hash: true,
            excludeChunks: ['contact'],
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Content Page',
            hash: true,
            chunks: ['contact'],
            filename: 'contact.html',
            template: './src/contact.html'
        }),
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: true,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}
