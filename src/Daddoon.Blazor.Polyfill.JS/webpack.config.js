const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    resolve: { extensions: ['.ts', '.js'] },
    devtool: 'inline-source-map',
    module: {
        rules: [{ test: /\.ts?$/, loader: 'ts-loader' }]
    },
    entry: {
        'blazor.polyfill': './src/Boot.ts',
        'blazor.polyfill.min': './src/Boot.ts'
    },
    output: {
        path: path.join(__dirname, '/dist'), filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};
