var loaders = {
    loaders: [
        {
            test: /\.ts[x]?$/,
            loader: 'ts-loader'
        }
    ],
    noParse: /\.min\.js$/
};

var resolve = {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
};

var output = {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: '[name]',
    pathinfo: true
};

module.exports = {
    context: __dirname,
    entry: {
        vidi: ['./src']
    },
    output: output,
    resolve: resolve,
    module: loaders
};
