import fs from 'fs'
import path from 'path'
import electron from 'electron'
// eslint-disable-next-line
import Worker from 'worker-loader!./GlyphIndexWorker.js'
import PromiseWorker from 'promise-worker'
import Glyphs from './Glyphs'

export default new class {
  constructor() {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')

    this.worker = new Worker()
    this.promiseWorker = new PromiseWorker(this.worker)
    this.dbPath = path.join(userDataPath, 'db.json')
    this.progress = 0
  }

  async create() {
    const glyphs = await this.createSupportedGlyphs()

    const searchIndex = await this.promiseWorker.postMessage({
      type: 'createSearchIndex',
      glyphs,
    })

    fs.writeFileSync(this.dbPath, JSON.stringify({
      glyphs,
      searchIndex,
    }))

    Glyphs
      .importGlyphs(glyphs)
      .importIndex(searchIndex)

    this.finishCallback()
  }

  onProgress(callback) {
    this.progressCallback = callback

    return this
  }

  onFinish(callback) {
    this.finishCallback = callback

    return this
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
