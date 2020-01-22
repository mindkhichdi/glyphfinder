module.exports = {
  // devServer: {
  //   overlay: {
  //     warnings: false,
  //     errors: false,
  //   },
  // },

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/variables.scss";',
      },
    },
  },

  chainWebpack: config => {
    const nodeLoader = process.env.NODE_ENV === 'development'
      ? 'node-loader'
      : 'native-ext-loader'

    config.module
      .rule('node')
      .test(/\.node$/)
      .use(nodeLoader)
      .loader(nodeLoader)
      .end()

    config.resolve.extensions.prepend('.node')
  },
}
