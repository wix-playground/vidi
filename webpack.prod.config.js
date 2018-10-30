const path = require('path');

module.exports = {
    mode: 'production',
    context: __dirname,
    output: {
        filename: 'vidi.min.js',
        libraryExport: 'default',
        libraryTarget: 'umd',
        library: 'Vidi'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ts-tools/webpack-loader',
                
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    performance: {
        hints: false
    }
};
