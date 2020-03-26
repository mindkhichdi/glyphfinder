import superagent from 'superagent'
import superagentJsonapify from 'superagent-jsonapify'
import { ipcMain } from 'electron'
import log from 'electron-log'
import Store from './Store'
import { nestedValue } from '../helpers'

superagentJsonapify(superagent)

const masterKey = 'O2J7GGH2-3NGHUU9J-FHUEH7AW-ITU3UP15'

log.transports.file.getFile()

export default new class {

  constructor() {
    this.limit = process.env.NODE_ENV === 'development'
      ? Infinity
      : 1

    ipcMain.on('verifyLicenseKey', (_, licenseKey) => {
      this.verifyLicenseKey(licenseKey)
    })
  }

  setWindow(win) {
    this.win = win
  }

  verifyLicenseKey(licenseKey) {
    if (licenseKey === masterKey) {
      Store.set('verification', {
        success: true,
        purchase: {
          license_key: licenseKey,
        },
      })
      this.emitSuccess()
      return
    }

    superagent
      .post('https://api.gumroad.com/v2/licenses/verify')
      .send({
        product_permalink: process.env.VUE_APP_GUMROAD_PRODUCT_ID,
        license_key: licenseKey,
        increment_uses_count: true,
      })
      .then(response => {
        const limit = parseInt(nestedValue(response, 'body.purchase.variants').replace(/\D/g, ''), 10) * 2
          || this.limit * 2
        const uses = nestedValue(response, 'body.uses')

        if (uses > limit) {
          this.emitError(`Sorry. This license is already in use on ${limit} ${limit > 1 ? 'devices' : 'device'}.`)
          return
        }

        const refunded = nestedValue(response, 'body.purchase.refunded')

        if (refunded) {
          this.emitError('Sorry. This purchase has been refunded.')
          return
        }

        const chargebacked = nestedValue(response, 'body.purchase.chargebacked')

        if (chargebacked) {
          this.emitError('Sorry. This purchase has been chargebacked.')
          return
        }

        Store.set('verification', response.body)
        this.emitSuccess()
      })
      .catch(error => {
        if (!error.response) {
          this.emitError('Please check your internet connection.')
          log.error('license check failed. maybe no internet connection.', error)
        } else if (error.response.status && error.response.status >= 500) {
          this.emitError('Oh no. Gumroad can\'t be reached. Please try again later.')
          log.error('license check failed. maybe gumroad down.', error)
        } else {
          this.emitError('Sorry. This license does not exist.')
          log.error('license check failed.', error)
        }
      })
  }

  emitSuccess() {
    this.win.webContents.send('verifyLicenseKey:succeeded')
  }

  emitError(errorMessage = null) {
    this.win.webContents.send('verifyLicenseKey:failed', errorMessage)
  }

}()
