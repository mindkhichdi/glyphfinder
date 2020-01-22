<template>
  <div class="glyph-data">
    {{ glyph.name }}
    <br>
    <template v-if="showShortcut">
      Shortcut: {{ shortcut }}
    </template>
  </div>
</template>

<script>
import Shortcut from '@/services/Shortcut'

export default {
  props: {
    glyph: {
      required: true,
      type: Object,
    },
  },

  computed: {
    shortcut() {
      return Shortcut.get(this.glyph.symbol)
    },

    showShortcut() {
      return this.shortcut && this.shortcut.length > 1
    },
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
