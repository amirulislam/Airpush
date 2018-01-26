const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js', './styles/style.scss'
  ],
  output: {
    path: path.join(__dirname, '../server/dist/public/assets'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,       
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015', 'stage-1']
          },           
        }
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
        { from: './img', to: 'img' }
    ]),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'styles/style.css',
      allChunks: true,
    })
  ]
};
