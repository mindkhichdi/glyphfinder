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
    '0.3.0': () => {
      DB.removeSearchIndex()
    },
    '1.0.0': store => {
      DB.removeAll()
      store.clear()
    },
  },
})
