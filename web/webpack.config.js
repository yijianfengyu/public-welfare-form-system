const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
module.exports = (webpackConfig) => {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
      options: {
        modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
        javascriptEnabled: true,
      },
    }],
    // ...other rules
  }],
    webpackConfig.module.loaders[0].exclude.push(/\.ejs$/)
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[hash].js' // http://webpack.github.io/docs/configuration.html#output-chunkfilename

  // ClassnameHash
  const cssLoaderOption = {
    importLoaders: 1,
    modules: true,
    localIdentName: '[hash:base64:5]',
  }
  const cssLoaders = webpackConfig.module.loaders[3].loader.split('!')
  webpackConfig.module.loaders[3].loader = cssLoaders.map(item => {
    if (item.startsWith('css')) {
      return `css?${JSON.stringify(cssLoaderOption)}`
    }
    return item
  }).join('!')

  // PreLoaders
  // webpackConfig.module.preLoaders = [{
  //   test: /\.js$/,
  //   enforce: 'pre',
  //   loader: 'eslint',
  // }]


  // Alias
  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    utils: `${__dirname}/src/utils`,
    config: `${__dirname}/src/utils/config`,
    enums: `${__dirname}/src/utils/enums`,
  }
  var timestamp2 = (new Date()).valueOf();
  webpackConfig.output.filename = '[hash]' + timestamp2 + '.js'
  webpackConfig.output.chunkFilename = '[chunkhash].async.js'
  webpackConfig.plugins[3] = new ExtractTextPlugin('[contenthash:20]' + timestamp2 + '.css')    // 注 2
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: 'ejs!src/index.ejs',    // 注 3
      inject: false,
      minify: {collapseWhitespace: true},
      production: true,
    }),
    new WebpackMd5Hash()
  )
  /**webpackConfig.externals={
    'BMap':'BMap'
  }**/
  return webpackConfig
}
