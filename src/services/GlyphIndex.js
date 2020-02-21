// eslint-disable-next-line
import Worker from 'worker-loader!./GlyphIndexWorker.js'
import PromiseWorker from 'promise-worker'
import Glyphs from './Glyphs'
import DB from './DB'

export default new class {
  constructor() {
    this.worker = new Worker()
    this.promiseWorker = new PromiseWorker(this.worker)
    this.progress = 0
  }

  async create() {
    const glyphs = await this.createSupportedGlyphs()

    const searchIndex = await this.promiseWorker.postMessage({
      type: 'createSearchIndex',
      glyphs,
    })

    DB.saveGlyphs(glyphs)
    DB.saveSearchIndex(searchIndex)

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
