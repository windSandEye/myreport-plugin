import * as webpack from 'webpack';
import * as path from 'path';
import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
// import * as pxtorem from 'postcss-pxtorem';

const buildPath = '/dist';
const host = 'localhost';
export default (_env, { port }) => ({
  entry: {
    crmhome: './src/filters/crmhome.ts', // 商家中心
    midOffice: './src/filters/mid-office.ts', // 销售中台
    'download-csv': './src/entry/download-csv.tsx',
    shop: './src/filters/shop.ts',
    dingding: './src/filters/dingding.ts',
    my: './src/entry/my.tsx',
    manager: './src/templates/manager/index.ts', // 高管大盘
    canvastree: './src/entry/canvastree.tsx',
    paymentDataCenterFilter: './src/filters/payment_ data_center.ts',
    familyNumberFilter: './src/filters/family_number.js',
    userPaymentChangeFilter: './src/filters/user_payment_change_filter.js',
    paymentToolsSuccessFilter: './src/filters/payment_tools_success_filter.js',
    explanatoryBar: './src/entry/explanatory-bar.tsx',
    paymentAbnormalFilter: './src/filters/payment_abnormal_filter.js',
    sankeyChart:'./src/entry/sankey.tsx',
    uvFilter:'./src/filters/uv_filter.js',
    pvFilter:'./src/filters/pv_filter.js',
    cardBusiness:'./src/entry/card-business.tsx',
    // cardBusinessFilter:'src/filters/card_business_filter.ts'
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
        test: /\.(tsx|js|ts)?$/,
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
            { loader: 'css-loader' },
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
    numeral: 'commonjs numeral',
    lodash: 'commonjs lodash',
    moment: 'commonjs moment',
    antd: 'commonjs antd',
    '@alipay/report-engine': 'commonjs @alipay/report-engine',
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
  }],
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development', DEBUG: true }), // 环境变量
    new ExtractTextPlugin({ filename: '[name].css', disable: false }),
  ],
  devServer: {
    clientLogLevel: 'none',
    contentBase: __dirname,
    disableHostCheck: true,
    inline: false,
    host,
    https: true,
    port,
    headers: { 'Access-Control-Allow-Origin': '*' },
    publicPath: '/',
  },
});
