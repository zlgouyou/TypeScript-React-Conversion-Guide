module.exports = {
    mode: 'development',
    entry: './src/app.tsx',
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".ts", ".tsx"]
    },
    module: {
        rules: [
            {test: /\.tsx?$/, use: {loader: 'awesome-typescript-loader'}},
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
    },
    devtool: "source-map"
};
