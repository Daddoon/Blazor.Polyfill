const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    resolve:
    {
        extensions: ['.js']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /@babel(?:\/|\\{1,2})runtime|core-js|node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "plugins": [],
                        "presets": [['env',
                            {
                                targets: {
                                    browsers: ["ie 11"]
                                }
                            }
                        ], "es2015"],
                        "sourceType": "module"
                    }
                },
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    entry: {
        'es5module': './wwwroot/es5module_entry.js',
        'es5module.min': './wwwroot/es5module_entry.js'
    },
    output: {
        path: path.join(__dirname, '/wwwroot'), filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};
