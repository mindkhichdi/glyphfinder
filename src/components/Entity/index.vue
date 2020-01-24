<template>
  <button class="entity" @click="copyToClipboard">
    {{ name }}
  </button>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  props: {
    name: {
      required: true,
      type: String,
    },
  },

  computed: {
    fullName() {
      return `&${this.name};`
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
