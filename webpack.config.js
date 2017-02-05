const path = require('path');

module.exports = {
    entry: {
        test: './test',
        webtest: 'mocha-loader!./test'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts[x]?$/,
                loader: 'ts-loader',
                options: {
                    logLevel: 'warn'
                    // transpileOnly: true

                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    performance: {
        hints: false
    },
    devtool: 'inline-source-map',
    context: __dirname
};
