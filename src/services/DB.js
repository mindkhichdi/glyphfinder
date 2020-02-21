import fs from 'fs'
import path from 'path'
import { app, remote } from 'electron'

export default new class {

  constructor() {
    this.userDataPath = (app || remote.app).getPath('userData')
    this.glyphsPath = path.join(this.userDataPath, 'glyphs.json')
    this.searchIndexPath = path.join(this.userDataPath, 'search-index.json')
  }

  glyphsExists() {
    return fs.existsSync(this.glyphsPath)
  }

  saveGlyphs(glyphs = []) {
    fs.writeFileSync(this.glyphsPath, JSON.stringify(glyphs))
  }

  glyphs() {
    try {
      if (!this.glyphsExists()) {
        return null
      }
      return JSON.parse(fs.readFileSync(this.glyphsPath, 'utf8'))
    } catch (err) {
      console.error(err)
      return null
    }
  }

  removeGlyphs() {
    fs.unlinkSync(this.glyphsPath)
  }

  searchIndexExists() {
    return fs.existsSync(this.searchIndexPath)
  }

  saveSearchIndex(glyphs = []) {
    fs.writeFileSync(this.searchIndexPath, JSON.stringify(glyphs))
  }

  searchIndex() {
    try {
      if (!this.searchIndexExists()) {
        return null
      }
      return JSON.parse(fs.readFileSync(this.searchIndexPath, 'utf8'))
    } catch (err) {
      console.error(err)
      return null
    }
  }

  removeSearchIndex() {
    fs.unlinkSync(this.searchIndexPath)
  }

  removeAll() {
    this.removeGlyphs()
    this.removeSearchIndex()
  }

}()
