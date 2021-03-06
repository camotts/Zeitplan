const path = require('path');
const glob = require('glob-all');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = glob.sync([
	      path.join(__dirname, '../src/**/*.elm'),
	      path.join(__dirname, '../src/index.js'),
	      path.join(__dirname, '../node_modules/@fullcalendar/**/*.js'),
      ], { nodir: true });

module.exports = () => ({
  output: {
    filename: '[name].[contenthash].js'
  },

  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: {
          loader: 'elm-webpack-loader',
          options: {
            optimize: true,
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
	include: /@fullcalendar.*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
	  {loader: 'css-loader', options: { importLoaders: 1} },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
	exclude: /@fullcalendar.*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
	]
      }
    ]
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          mangle: false,
          compress: {
            pure_funcs: ['F2','F3','F4','F5','F6','F7','F8','F9','A2','A3','A4','A5','A6','A7','A8','A9'],
            pure_getters: true,
            keep_fargs: false,
            unsafe_comps: true,
            unsafe: true,
          },
        },
      }),
      new TerserPlugin({
        extractComments: false,
        terserOptions: { mangle: true },
      }),
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),

    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      cache: true,
    }),

    new OptimizeCSSAssetsPlugin()
  ]
});
