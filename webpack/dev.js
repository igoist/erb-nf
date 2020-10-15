const merge = require('webpack-merge');
const common = require('./common.js');
const webpack = require('webpack');
const path = require('path');

let bundle;
try {
  bundle = path.resolve(__dirname, '../dist/dll/react-map.json');
} catch (e) {
  bundle = '';
}

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    hot: true,
    inline: true,
    port: 3101,
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      manifest: bundle
    })
  ]
});
