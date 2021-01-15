const path = require('path');
const webpack = require('webpack');

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
    entry: './wwwroot/js/modules/app.js',
    output: {
        path: path.join(__dirname, '/wwwroot/js/compat'), filename: '[name].libcompat.js'
    },
    plugins: [
    ]
};
