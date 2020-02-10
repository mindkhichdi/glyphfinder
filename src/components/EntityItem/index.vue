<template>
  <button class="entity" @click="copyToClipboard">
    {{ entity }}
  </button>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  props: {
    entity: {
      required: true,
      type: String,
    },
  },

  computed: {
    fullName() {
      return `&${this.entity};`
    },
  },

  methods: {
    copyToClipboard() {
      const copied = copy(this.fullName)

      if (copied) {
        console.log('copied', this.fullName)
      } else {
        console.log('copy failed')
      }
    },
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
