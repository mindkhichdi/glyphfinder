<template>
  <button class="glyph">
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

<style>

</style>
