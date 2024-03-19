const CopyPlugin = require("copy-webpack-plugin");
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
                test: /.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname)]
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "index.html" }],
        }),
    ],
};

