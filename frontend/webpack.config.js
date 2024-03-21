const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    entry: "./index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    mode: "development",
    experiments: {
        asyncWebAssembly: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname)]
            },
            {
                test: /.css$/,
                use: ["style-loader", "css-loader"],
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
        }),
    ],
};

