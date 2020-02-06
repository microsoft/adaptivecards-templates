const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (env, argv) => {

  return {
    mode: "development",
    entry: {
      "AdaptiveUIFabric": "./src/index.tsx",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
    },
    resolve: {
      root: [__dirname, "/src/"],
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [{
          test: /\.tsx?$/,
          use: { loader: 'ts-loader' },
          include: [
            path.resolve(__dirname, 'src')
          ], 
          exclude: /(node_modules|__tests__)/
        },
        {
          test: /\.scss$|\.css$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        },
        {
          test: /\.(jpg|png|woff|eot|ttf|svg|gif)$/,
          use: [
            "file-loader"
              ]
          }
      ]
    },
    plugins: [
      new CopyPlugin([{
        from: "node_modules/adaptivecards-designer/dist/*",
        to: "ACDesigner/",
        flatten: true
      }]),
      new MonacoWebpackPlugin({
        languages: ['json']
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 5000,
      historyApiFallback: true
    },
  }
}
