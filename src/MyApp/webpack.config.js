const path = require('path');
const webpack = require('webpack');

module.exports = {
    resolve:
    {
        extensions: ['.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
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
