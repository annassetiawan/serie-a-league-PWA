const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const CopyPlugin = require('copy-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
 
module.exports = merge(common, {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                 MiniCssExtractPlugin.loader, // extact css into files
                "css-loader", //turn css into bundle js
             ]
            },
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
     new MiniCssExtractPlugin({
         filename: "[name].css"
     }),
     new CopyPlugin({
         patterns:[
             {
                from: 'src/service-worker.js',
             },
             {
                from: 'src/push.js',
             },
             {
                from: 'src/manifest.json',
             },
             {
                from: 'src/assets/',
                to:'assets'
             },
         ]
     })
 ]
 })