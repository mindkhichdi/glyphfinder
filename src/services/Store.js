import Store from 'electron-store'
import DB from './DB'
import { isMac, app } from '../helpers'

export default new Store({
  // configName: process.env.NODE_ENV === 'development'
  //   ? 'config_dev'
  //   : 'config',
  projectVersion: app.getVersion(),
  migrations: {
    '1.0.0': store => {
      DB.removeAll()
      store.clear()
    },
    '1.1.0': store => {
      if (isMac) {
        store.set('shortcut', ['shift', 'super', 'g'])
      } else {
        store.set('shortcut', ['control', 'shift', 'g'])
      }

      store.set('showMenubar', false)
      store.set('autoStart', false)
      store.set('hideAfterCopy', false)
    },
    '1.1.1': store => {
      store.set('showMenubar', true)
      store.set('autoStart', true)
      store.set('hideAfterCopy', true)
    },
    '1.1.2': () => {
      DB.removeSearchIndex()
    },
  },
})
