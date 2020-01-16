<template>
  <button class="glyph-item">
    {{ glyph.symbol }}
  </button>
</template>

<script>
export default {
  props: {
    glyph: {
      required: true,
      type: Object,
    },
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
