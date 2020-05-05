import { nativeTheme, BrowserWindow} from 'electron'
import Store from './Store'

export default new class {
  init() {
    this.set()
    nativeTheme.on('updated', this._handleUpdate.bind(this))
  }

  set() {
    const preference = Store.get('darkMode')

    this.isDarkMode = true
    // this.isDarkMode = preference === 'system'
    //   ? nativeTheme.shouldUseDarkColors
    //   : preference === 'true'

    BrowserWindow
      .getAllWindows()
      .forEach(browserWindow => {
        browserWindow.isDarkMode = this.isDarkMode
      })
  }

  _handleUpdate() {
    this.set()

    BrowserWindow
      .getAllWindows()
      .forEach(browserWindow => {
        browserWindow.webContents.send('darkModeChanged', this.isDarkMode)
      })
  }
}
