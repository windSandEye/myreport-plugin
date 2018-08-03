import * as webpack from 'webpack';
import * as path from 'path';
import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

const buildPath = 'dist';
export default () => ({
  entry: {
    crmhome: './src/filters/crmhome.ts', // 商家中心
    midOffice: './src/filters/mid-office.ts', // 销售中台
    shop: './src/filters/shop.ts',
    dingding: './src/filters/dingding.ts',
    my: './src/entry/my.tsx',
    'download-csv': './src/entry/download-csv.tsx',
    manager: './src/templates/manager/index.ts', // 高管大盘
    canvastree:'./src/entry/canvastree.tsx',
    paymentDataCenterFilter:'./src/filters/payment_ data_center.ts',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'amd',
    path: path.resolve(__dirname, buildPath),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['es2015', { modules: false }], 'stage-1', 'react'],
              plugins: [
                'transform-runtime',
              ],
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'awesome-typescript-loader' },
        ],
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            {
              loader: 'postcss-loader',
              options: {
                plugins() {
                  return [
                    autoprefixer(),
                    // if is mobile
                    // pxtorem({ rootValue: 100, propList: ['*'] }),
                  ];
                },
              },
            },
            // if is mobile
            // { loader: 'less-loader', options: { modifyVars: { hd: '2px' } } },
            { loader: 'less-loader' },
          ],
        }),
      },
    ],
  },
  externals: [{
    'numeral': 'commonjs numeral',
    'lodash': 'commonjs lodash',
    'moment': 'commonjs moment',
    '@alipay/report-engine': 'commonjs @alipay/report-engine',
    'react': 'commonjs react',
    'react-dom': 'commonjs react-dom',
  }],
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development', DEBUG: true }), // 环境变量
    new ExtractTextPlugin({ filename: '[name].css', disable: false }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
