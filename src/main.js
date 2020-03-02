import Vue from 'vue'
import Bowser from 'bowser'
import Wrapper from '@/components/Wrapper'

Vue.config.productionTip = false

const { os } = Bowser.parse(window.navigator.userAgent)

Vue.filter('uppercase', value => {
  const ignoredCharacters = ['ß']

  if (ignoredCharacters.includes(value)) {
    return value
  }

  return value.toUpperCase()
})

Vue.mixin({
  data() {
    return {
      isWindows: os.name === 'Windows',
      isMac: os.name === 'macOS',
    }
  },
})

new Vue({
  render: h => h(Wrapper),
  mounted() {
    document.documentElement.classList.add(this.isWindows ? 'is-windows' : 'is-mac')
  },
}).$mount('#app')
