const path = require('path');

module.exports = {
  target: 'web',
  entry: {
    // 'inplace-editor': './src/js/inplace-editor.js',
    // 'jspec-editor': './src/js/jspec-editor.js',
    'index': './src/js/index.js',
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public', 'js'),
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devtool: "inline-source-map",
  watchOptions: {
    ignored: /node_modules/
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm-browser.js"
    }
  },
};

