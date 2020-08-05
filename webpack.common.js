const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
 
module.exports = {
   entry: "./src/app.js",
   output: {
       path: path.resolve(__dirname, "dist"),
       filename: "bundle.js"
   },
   module: {
    rules: [
        
        {
         test: /\.html$/,
         use: ['html-loader']
        },
        {
         test: /\.(svg|png|jpg|gif)$/,
         use: [
         {
             loader:'file-loader',
             options:{
                 name:'[name].[ext]',
                 outputPath:'imgs'
             }
         },
         {
             loader: 'image-webpack-loader',
         }
     ]
        }
    ]
   },
   plugins: [
       new HtmlWebpackPlugin({
           template: "./src/index.html",
           filename: "index.html",
           favicon: "./src/assets/favicon-16x16-dunplab-manifest-6626.png"
       }),
       new HtmlWebpackPlugin({  
        filename: 'nav.html',
        template: './src/nav.html'
      }),
       new HtmlWebpackPlugin({  
        filename: '/pages/saved.html',
        template: './src/pages/saved.html'
      }),
       new HtmlWebpackPlugin({  
        filename: '/pages/schedules.html',
        template: './src/pages/schedules.html'
      }),
       new HtmlWebpackPlugin({  
        filename: '/pages/standings.html',
        template: './src/pages/standings.html'
      }),
       new HtmlWebpackPlugin({  
        filename: '/pages/teams.html',
        template: './src/pages/teams.html'
      }),
       
   ]
}