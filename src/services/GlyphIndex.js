import fs from 'fs'
import path from 'path'
import electron from 'electron'
// eslint-disable-next-line
import Worker from 'worker-loader!./GlyphIndexWorker.js'
import Glyphs from './Glyphs'

export default new class {
  constructor() {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')

    this.worker = new Worker()
    this.dbPath = path.join(userDataPath, 'db.json')
    this.progress = 0
  }

  async create() {
    const glyphs = await this.createSupportedGlyphs()
    const searchIndex = this.createSearchIndex(glyphs)

    fs.writeFileSync(this.dbPath, JSON.stringify({
      glyphs,
      searchIndex,
    }))

    this.finishCallback({
      glyphs,
      searchIndex,
    })
  }

  onProgress(callback) {
    this.progressCallback = callback

    return this
  }

  onFinish(callback) {
    this.finishCallback = callback

    return this
  }

  createSearchIndex(glyphs = []) {
    return Glyphs
      .importGlyphs(glyphs)
      .createIndex()
      .exportIndex()
  }

  getDB() {
    try {
      if (!fs.existsSync(this.dbPath)) {
        return null
      }
      return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'))
    } catch (err) {
      console.error(err)
      return null
    }
  }

  createSupportedGlyphs() {
    return new Promise(resolve => {
      this.worker.postMessage('getSupportedGlyphs')

      this.worker.onmessage = event => {
        if (event.data.type === 'progress') {
          this.progressCallback(event.data.value)
        }

        if (event.data.type === 'supportedGlyphs') {
          resolve(event.data.value)
        }
      }
    })
  }
}()
