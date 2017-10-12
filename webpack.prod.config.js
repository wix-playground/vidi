const path = require('path');

module.exports = {
    entry: {
        vidi: './src/minified-entry'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
        libraryTarget: 'umd',
        library: 'Vidi'
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
        extensions: ['.ts', '.js']
    },
    performance: {
        hints: false
    },
    context: __dirname
};
