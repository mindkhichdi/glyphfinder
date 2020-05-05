import { ipcRenderer, remote } from 'electron'
import Vue from 'vue'
import keyboardSymbol from 'keyboard-symbol'
import Wrapper from '@/components/Wrapper'
import Store from '@/services/Store'
import { isMac, uppercase } from './helpers'

const customTitlebar = require('custom-electron-titlebar')

Vue.config.productionTip = false

Vue.filter('key', name => keyboardSymbol(name, isMac ? 'mac' : 'win'))

Vue.filter('uppercase', value => uppercase(value))

Vue.mixin({
  data() {
    return {
      isMac,
      isWindows: !isMac,
      isDarkMode: remote.getCurrentWindow().isDarkMode,
    }
  },
})

new Vue({
  render: h => h(Wrapper),
  mounted() {
    const showMenubar = Store.get('showMenubar')

    document.documentElement.classList.add(this.isWindows ? 'is-windows' : 'is-mac')

    ipcRenderer.on('darkModeChanged', (event, isDarkMode) => {
      this.isDarkMode = isDarkMode
    })

    if (showMenubar) {
      document.documentElement.classList.add('is-menubar')
    }

    if (this.isWindows && !showMenubar) {
      this.titleBar = new customTitlebar.Titlebar({
        icon: './icon.png',
        backgroundColor: customTitlebar.Color.fromHex('#000'),
        itemBackgroundColor: customTitlebar.Color.fromHex('#111'),
        maximizable: false,
      })

      this.titleBar.updateTitle(' ')
    }
  },

  watch: {
    isDarkMode: {
      immediate: true,
      handler() {
        if (this.isDarkMode) {
          document.documentElement.classList.add('is-dark-mode')
        } else {
          document.documentElement.classList.remove('is-dark-mode')
        }
      },
    },
  },

  beforeDestroy() {
    if (this.titleBar) {
      this.titleBar.dispose()
    }
  },
}).$mount('#app')
