const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: __dirname,
    entry: {
        tests: 'mocha-loader!./test'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ts-tools/webpack-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    performance: {
        hints: false
    },
};
