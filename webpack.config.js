const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader'],
    publicPath: '/dist'
});
const cssConfig = isProd ? cssProd : cssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    entry: {
        app: './src/app',
        contact: './src/contact',
        vendor: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: './js/[name].bundle.js'
    },
    module: {
      rules: [
          {
              test: /\.scss$/,
              use: cssConfig
          },
          {
              test: /\.js$/,
              exclude: /node_module/,
              use: 'babel-loader'
          },
          {
              test: /\.(jpe?g|png|gif|svg)$/i,
              use: [
                  //'file-loader?name=[name].[ext]?[hash]&publicPath=./&outputPath=images/',
                  'file-loader?name=images/[name].[ext]',
                  'image-webpack-loader'
              ]
          },
          {
              test: /\.(woff2?|svg)$/,
              use: 'url-loader?limit=10000&name=fonts/[name].[ext]'
          },
          {
              test: /\.(ttf|eot)$/,
              use: 'file-loader?name=fonts/[name].[ext]'
          },
          {
              test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
              use: 'imports-loader?jQuery=jquery'
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
            filename: 'index.html',
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Content Page',
            hash: true,
            excludeChunks: ['app'],
            filename: 'contact.html',
            template: './src/contact.html'
        }),
        new ExtractTextPlugin({
            filename: './css/[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
        // new PurifyCSSPlugin({
        //     // Give paths to parse for rules. These should be absolute!
        //     paths: glob.sync(path.join(__dirname, 'src/*.html')),
        // })
    ]
}
