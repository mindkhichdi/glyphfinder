import path from 'path'
import { menubar } from 'menubar'
import {
  Menu,
  app,
  globalShortcut,
  ipcMain,
  BrowserWindow,
} from 'electron'
import Store from './Store'
import User from './User'
import Setapp from './Setapp'
import Updater from './Updater'
import { isMac } from '../helpers'

export default new class {
  getShortcut() {
    return Store.get('shortcut').join('+')
  }

  create(windowOptions = {}) {
    return new Promise((resolve, reject) => {
      if (
        this.menubar
        || !Store.get('showMenubar', true)
      ) {
        reject()
        return
      }

      const { titleBarStyle, trafficLightPosition, ...options } = windowOptions
      const icon = isMac ? 'MenuIconTemplate.png' : 'MenuIconTemplate@2x.png'

      this.menubar = menubar({
        index: process.env.WEBPACK_DEV_SERVER_URL
          ? process.env.WEBPACK_DEV_SERVER_URL
          : 'app://./index.html',
        browserWindow: {
          ...options,
          movable: false,
          // alwaysOnTop: isDevelopment,
        },
        /* global __static */
        icon: path.join(__static, icon),
        preloadWindow: true,
        showDockIcon: false,
        tooltip: 'Glyphfinder',
      })

      this.menubar.on('after-create-window', () => {
        const contextMenu = Menu.buildFromTemplate([
          ...(isMac ? [
            { role: 'about' },
            { type: 'separator' },
          ] : []),
          {
            label: 'Preferences',
            click: () => {
              BrowserWindow
                .getAllWindows()
                .forEach(browserWindow => {
                  browserWindow.webContents.send('showPreferences')
                  browserWindow.show()
                })
            },
          },
          { type: 'separator' },
          ...(!Setapp.isActive ? [
            {
              label: 'Check for Updates',
              click(menuItem) {
                Updater.checkForUpdates(menuItem)
              },
            },
          ] : []),
          { type: 'separator' },
          {
            label: 'Quit',
            click: () => {
              this.menubar.app.quit()
            },
          },
        ])

        this.menubar.tray.on('right-click', () => {
          Setapp.reportUsageEvent('user-interaction')
          this.menubar.tray.popUpContextMenu(contextMenu)
        })

        resolve(this.getWindow())
      })

      this.menubar.on('show', () => {
        Setapp.reportUsageEvent('user-interaction')

        // if (isDevelopment) {
        //   this.menubar.window.openDevTools()
        // }
      })

      this.menubar.on('hide', () => {
        // if (isDevelopment) {
        //   this.menubar.window.closeDevTools()
        // }
      })

      this.menubar.on('ready', () => {
        if (!User.isVerified) {
          this.show()
        }
      })

      this.addShortcutListener()

      ipcMain.on('shortcutChanged', () => {
        this.addShortcutListener()
      })

      app.on('will-quit', () => {
        globalShortcut.unregisterAll()
      })
    })
  }

  isWindowVisible(window) {
    return !window.isDestroyed() && window.isVisible()
  }

  getWindow() {
    return this.menubar.window
  }

  show() {
    if (!this.menubar) {
      return
    }

    this.menubar.showWindow()
  }

  hide() {
    if (!this.menubar) {
      return
    }

    this.menubar.hideWindow()
  }

  addShortcutListener() {
    // unregister previously added event listener
    globalShortcut.unregisterAll()

    const shortcut = this.getShortcut()

    globalShortcut.register(shortcut, () => {
      if (this.isWindowVisible(this.menubar.window)) {
        this.hide()
      } else {
        this.show()
      }
    })
  }

}()
