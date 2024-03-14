/**
* VueneM
* author xiaoRui
*/
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  lintOnSave: false, //关闭校验
  productionSourceMap: false,//生产环境是否要生成 sourceMap
  publicPath: "/",//部署应用包时的基本 URL(如果是"./"导致刷新页面出现cannot get/错误)
  outputDir: 'dist', // build 时输出的文件目录
  assetsDir: 'assets',//放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  devServer: {
    port: 2001,//开发运行时的端口
    host: '0.0.0.0',// 开发运行时域名，设置成 0.0.0.0，在同一个局域网下，如果你的项目在运行，同时可以通过你的http://ip:port/...访问你的项目
    https: false, //是否启用 https
    open: false,//是否直接打开浏览器
    proxy: {//配罝后端代理访问的地址
      "/api": {

        target: "http://localhost:2002",
        changeorigin: true,
      }

    },
    client: {
      overlay: false // 关闭全屏错误 uncaught runtime errors:
    }
  },
})
