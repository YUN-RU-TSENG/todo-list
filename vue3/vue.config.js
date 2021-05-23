module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/todo-list/" : "/",
  css: {
    loaderOptions: {
      /**
       * 該 css 配置 prependData 可以將想要共享的 scss 變數、mixin 檔案傳入，webpack 便會在所有 scss 導入該變數、mixin。
       * reference: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
       */
      scss: {
        // 配置 sass-loader 8 版本以下為設置：additionalData，使用 8（含）以上版本則設置：prependData
        prependData: '@import "~@/assets/style/main.scss";'
      }
    }
  }
};
