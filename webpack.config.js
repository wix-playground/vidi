const path = require('path');

module.exports = {
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
                test: /\.ts[x]?$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        declaration: false
                    }
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
    devtool: 'source-map',
    context: __dirname
};
