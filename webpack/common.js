const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const publicPath = '/';
const srcPath = './src';

const webpackConfig = [
  {
    entry: {
      index: ['react-hot-loader/patch', path.resolve(path.resolve(__dirname, '..'), path.resolve(srcPath, 'index.tsx'))],
      // index: path.resolve(path.resolve(__dirname, '..'), path.resolve(srcPath, 'index.tsx'))
    },
  },
  {
    entry: {
      // pinit: path.resolve(path.resolve(__dirname, '..'), path.resolve(srcPath, 'pages/Pinit/index.tsx')),
      pinit2: path.resolve(path.resolve(__dirname, '..'), path.resolve(srcPath, 'pages/Pinit/index2.tsx')),
    },
    // externals: {
    //   app: 'app',
    // },
    resolve: {
      alias: {
        '@PComponents': path.resolve(path.resolve(__dirname, '..'), 'src/pages/Pinit/components/'),
        '@PModels': path.resolve(path.resolve(__dirname, '..'), 'src/pages/Pinit/models/'),
        '@PUtils': path.resolve(path.resolve(__dirname, '..'), 'src/pages/Pinit/utils/'),
      },
    },
    target: 'web',
  },
];

let arr = [];

for (let i = 0; i < webpackConfig.length; i++) {
  let obj = {
    resolve: {
      alias: {
        '@Components': path.resolve(path.resolve(__dirname, '..'), 'src/components/'),
        '@Types': path.resolve(path.resolve(__dirname, '..'), 'src/Types.ts'),
        '@Models': path.resolve(path.resolve(__dirname, '..'), 'src/models/'),
        '@Hooks': path.resolve(path.resolve(__dirname, '..'), 'src/hooks/'),
        '@Utils': path.resolve(path.resolve(__dirname, '..'), 'src/utils/'),
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
  };

  if (i === 0) {
    obj.target = 'electron-renderer';

    obj.plugins = [
      new HtmlWebpackPlugin({
        template: path.resolve(path.resolve(__dirname, '..'), './public/index.html'),
      }),
    ];
  }

  arr.push(merge(webpackConfig[i], obj));
}

module.exports = arr;
