import Store from './Store'
import { app, isProduction } from '../helpers'

export default new class {
  update() {
    if (isProduction) {
      app.setLoginItemSettings({
        openAtLogin: Store.get('autoStart', true),
        openAsHidden: true,
        path: app.getPath('exe'),
      })
    }
  }
}()
