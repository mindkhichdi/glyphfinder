import collect from 'collect.js'
import keymap from 'native-keymap'

const isISOKeyboard = keymap.isISOKeyboard()
const basicKeyMap = keymap.getKeyMap()

// swap Backquote and IntlBackslash
// see: https://github.com/microsoft/vscode/issues/24153
if (isISOKeyboard) {
  const { Backquote, IntlBackslash } = basicKeyMap

  basicKeyMap.IntlBackslash = Backquote
  basicKeyMap.Backquote = IntlBackslash
}

export default new class {

  keymap = Object
    .entries(basicKeyMap)
    .map(([code, data]) => ({
      code,
      ...data,
    }))

  get(symbol) {
    return collect(this.keymap)
      .map(key => {
        const value = key.value === ' ' ? '␣' : key.value

        if (key.value === symbol) {
          return [value]
        }

        if (key.withAltGr === symbol) {
          return ['⌥', value]
        }

        if (key.withShift === symbol) {
          return ['⇧', value]
        }

        if (key.withShiftAltGr === symbol) {
          return ['⇧', '⌥', value]
        }

        return null
      })
      .filter()
      .first()
  }

}()
