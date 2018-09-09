module.exports = {
    mode: 'development',
    entry: './src/app.jsx',
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {test: /\.(t|j)sx?$/, use: {loader: 'awesome-typescript-loader'}},
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
    },
    devtool: "source-map"
};
