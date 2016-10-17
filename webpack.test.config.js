var loaders = {
    loaders: [
        {
            test: /\.ts[x]?$/,
            loader: 'ts-loader' // ?transpileOnly=true
        }
    ],
    noParse: /\.min\.js$/
};

var resolve = {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
};

var output = {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
    library: '[name]',
    pathinfo: true
};

module.exports = {
    context: __dirname,
    entry: {
        test: ['./test'],
        webtest: ['mocha!./test']
    },
    devtool: 'inline-source-map',
    output: output,
    resolve: resolve,
    module: loaders
};
