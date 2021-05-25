const merge = require('webpack-merge');
const common = require('./common.js');
const webpack = require('webpack');
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');

let arr = [];
let bundle;

const handleBundleName = (bundleName) => {
  try {
    bundle = path.resolve(__dirname, bundleName);
  } catch (e) {
    bundle = '';
  }
};

for (let i = 0; i < common.length; i++) {
  let plugins = [];

  if (i === 0) {
    handleBundleName('../dist/dll/react-map.json');

    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else if (i === 1) {
    handleBundleName('../dist/dll/reactForPinit-map.json');
  }

  plugins.push(
    new webpack.DllReferencePlugin({
      manifest: bundle,
    }),
  );

  let obj = {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins,
  };

  if (i === 0) {
    obj.devServer = {
      contentBase: './dist',
      // host: '0.0.0.0',
      host: 'localhost',
      hot: true,
      inline: true,
      port: 3101,
      // quiet: true,
      publicPath: '/',
    };
  } else if (i === 1) {
    obj.devServer = {
      contentBase: './dist',
      disableHostCheck: true,
      host: 'localhost',
      hot: false,
      inline: true,
      port: 3101,
      publicPath: '/',
    };
  }

  arr.push(merge(common[i], obj));
}

// 最近 Pinit 暂停更新
arr.pop();

module.exports = arr;
