const { defineConfig } = require("@vue/cli-service");
//新增
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  // 新增
  configureWebpack: {
    resolve: {
      alias: {},
      fallback: {
        //其他的如果不启用可以用 keyname :false，例如：crypto:false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
    plugins: [new NodePolyfillPlugin()],
  },
  devServer: {
    host: "0.0.0.0", //监听地址
    port: 8090, // 启动端口号
    open: true, // 启动后是否自动打开网页
  },
  transpileDependencies: true,
  //关闭语法检测
  lintOnSave: false,
});
