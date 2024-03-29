'use strict'
var path = require('path') // node自带的文件路径工具
var config = require('../config') // 配置文件
var ExtractTextPlugin = require('extract-text-webpack-plugin') // 提取css的插件

/** @method assertsPath  生成静态资源的路径(判断开发环境和生产环境,为config文件中index.js文件中定义assetsSubDirectory)
 * @param  {String}    _path 相对于静态资源文件夹的文件路径
 * @return {String}          静态资源完整路径
 */
exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  //nodeJs path提供用于处理文件路径的工具;path.posix提供对路径方法的POSIX(可移植性操作系统接口)特定实现的访问(可跨平台); path.posix.join与path.join一样，不过总是以 posix 兼容的方式交互
  return path.posix.join(assetsSubDirectory, _path)
}

/**@method cssLoaders  生成处理css的loaders配置,使用css-loader和postcssLoader,通过options.usePostCSS属性来判断是否使用postcssLoader中压缩等方法
 * @param  {Object} option = {sourceMap: true,// 是否开启 sourceMapextract: true // 是否提取css}生成配置
 * @return {Object} 处理css的loaders配置对象
 */
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  /**@method generateLoaders  生成 ExtractTextPlugin对象或loader字符串
   * @param  {Array}        loaders loader名称数组
   * @return {String|Object}        ExtractTextPlugin对象或loader字符串
   */
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    // ExtractTextPlugin提取css(当上面的loaders未能正确引入时,使用vue-style-loader)
    if (options.extract) { // 生产环境中，默认为true
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else { //返回vue-style-loader连接loaders的最终值
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(), //需要css-loader 和 vue-style-loader
    postcss: generateLoaders(), //需要css-loader、postcssLoader 和 vue-style-loader
    less: generateLoaders('less'), //需要less-loader 和 vue-style-loader
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }), //需要sass-loader 和 vue-style-loader
    scss: generateLoaders('sass'), //需要sass-loader 和 vue-style-loader
    stylus: generateLoaders('stylus'), //需要stylus-loader 和 vue-style-loader
    styl: generateLoaders('stylus') //需要stylus-loader 和 vue-style-loader
  }
}

/**@method styleLoaders 生成 style-loader的配置
 * @param  {Object}     options 生成配置
 * @return {Array}      style-loader的配置
 */
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  //将各种css,less,sass等综合在一起得出结果输出output
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
