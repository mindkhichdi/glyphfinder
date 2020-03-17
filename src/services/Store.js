import Store from 'electron-store'
import { app, remote } from 'electron'
import DB from './DB'

export default new Store({
  // configName: process.env.NODE_ENV === 'development'
  //   ? 'config_dev'
  //   : 'config',
  projectVersion: (app && app.getVersion)
    ? app.getVersion()
    : remote.app.getVersion(),
  migrations: {
    '1.0.0': store => {
      DB.removeAll()
      store.clear()
    },
    '1.1.0': store => {
      store.set('shortcut', ['Meta', 'Shift', 'g'])
      store.set('showMenubar', true)
      store.set('autoStart', true)
    },
  },
})
