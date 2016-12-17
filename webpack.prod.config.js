var loaders = {
    loaders: [
        {
            test: /\.ts[x]?$/,
            loader: 'ts-loader?logLevel=warn' // &transpileOnly=true
        }
    ],
    noParse: /\.min\.js$/
};

var resolve = {
    extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
};

var output = {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'Vidi'
};

module.exports = {
    context: __dirname,
    entry: {
        vidi: ['./src/minified-entry']
    },
    output: output,
    resolve: resolve,
    module: loaders
};
