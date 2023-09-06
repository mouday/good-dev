"use strict";
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // 开发环境
  // mode: "production",

  // 打包入口
  entry: {
    background: "./src/background/background.js",
    content: "./src/content/content.js",
    options: "./src/options/options.js",
    popup: "./src/popup/popup.js",
  },

  // 指定输出地址及打包出来的文件名
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]/[name].js",
    // clean: true,
  },

  externals: {
    jquery: "jQuery",
    react: "React",
    "react-dom/client": "ReactDOM",
    antd: "antd",
    "webextension-polyfill": "browser",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/popup/popup.html", to: "popup/popup.html" },
        { from: "src/options/options.html", to: "options/options.html" },
        { from: "public" },
      ],
    }),
  ],

  performance: {
    hints: false,
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, //不将注释提取到单独的文件中
      }),
    ],
  },

  devServer: {
    hot: false,
    liveReload: false,
    devMiddleware: {
      writeToDisk: true,
    },
  },

  watchOptions: {
    ignored: ["**/public", "**/dist", "**/node_modules"],
  },
};
