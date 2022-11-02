const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭ESlint
  lintOnSave: false,
  configureWebpack: {
    externals: {
      'element-ui': 'ELEMENT',
      'vue': 'Vue',
      'axios': 'axios',
      'echarts': 'echarts',
    }
  }
})
