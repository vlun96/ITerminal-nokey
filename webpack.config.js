const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {

  return {
    mode: 'none',
    devtool: false,
    entry: './index.js',
    output: {
      filename: './terminal.js',
      path: path.resolve(__dirname, './dist'),
    },
    devServer: {
      contentBase: './dist',
      port: 8080,
      hot: true,
    },
    resolve: {
      fallback: {
        "fs": false
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './static/template.html',
        title: 'ITerminal v1.4.5',
      }),
    ],
    module: {
      rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, ],
    },

  }
};