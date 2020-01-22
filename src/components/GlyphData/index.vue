<template>
  <div class="glyph-data">
    {{ glyph.name }}
  </div>
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
