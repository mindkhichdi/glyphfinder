module.exports = {
  lintOnSave: process.env.NODE_ENV === 'production',

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/variables.scss";',
      },
    },
  },

  chainWebpack: config => {
    // required for 'native-ext-loader'
    config.node.set('__dirname', true)

    config
      .output
      .globalObject('(typeof self !== "undefined" ? self : this)')

    config.module
      .rule('node')
      .test(/\.node$/)
      .use('native-ext-loader')
      .loader('native-ext-loader')
      .end()

    config.module
      .rule('worker')
      .test(/\.worker\.js$/i)
      .use('worker-loader')
      .loader('worker-loader')
      .end()

    config.resolve.extensions.prepend('.node')
  },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      chainWebpackMainProcess: config => {
        config.module
          .rule('node')
          .test(/\.node$/)
          .use('native-ext-loader')
          .loader('native-ext-loader')
          .end()

        config.resolve.extensions.add('.js').add('.node')
      },
      builderOptions: {
        appId: process.env.VUE_APP_IS_SETAPP === 'true'
          ? 'com.ueberclub.glyphfinder-setapp'
          : 'com.glyphfinder.app',
        artifactName: '${productName}-${version}-${os}.${ext}', // eslint-disable-line
        // afterSign: 'src/notarize.js',
        productName: 'Glyphfinder',
        mac: {
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist',
          extendInfo: {
            NSUserNotificationAlertStyle: 'alert',
          },
          publish: [
            {
              provider: 'spaces',
              name: 'ueber',
              region: 'fra1',
              channel: 'latest',
              path: '/glyphfinder/mac',
              acl: 'public-read',
            },
          ],
        },
        win: {
          publisherName: 'überdosis GbR',
          publish: [
            {
              provider: 'spaces',
              name: 'ueber',
              region: 'fra1',
              channel: 'latest',
              path: '/glyphfinder/win',
              acl: 'public-read',
            },
          ],
        },
      },
    },
  },
}
