const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = '/';
const srcPath = './src';

const webpackConfig = {
  entry: {
    index: ['react-hot-loader/patch', path.resolve(path.resolve(__dirname, '..'), path.resolve(srcPath, 'index.tsx'))],
    // index: path.resolve(path.resolve(__dirname, '..'), path.resolve(srcPath, 'index.tsx'))
  },

  target: 'electron-renderer',

  resolve: {
    alias: {
      '@Components': path.resolve(path.resolve(__dirname, '..'), 'src/components/'),
      '@Types': path.resolve(path.resolve(__dirname, '..'), 'src/Types.ts'),
      '@Models': path.resolve(path.resolve(__dirname, '..'), 'src/models/'),
      '@Hooks': path.resolve(path.resolve(__dirname, '..'), 'src/hooks/'),
      '@Utils': path.resolve(path.resolve(__dirname, '..'), 'src/util/'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },

  output: {
    filename: '[name].bundle.min.js',
    path: path.resolve(path.resolve(__dirname, '..'), 'dist/'),
    publicPath,
    // hotUpdateChunkFilename: '[id].[hash].hot-update.js'
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(path.resolve(__dirname, '..'), './public/index.html'),
    }),
  ],
};

module.exports = webpackConfig;
