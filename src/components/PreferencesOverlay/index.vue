<template>
  <div class="preferences-overlay">
    preferences

    <btn icon="close" @click.native="close" />
  </div>
</template>

<script>
import Btn from '@/components/Btn'
import Event from '@/services/Event'

export default {
  components: {
    Btn,
  },

  methods: {
    close() {
      Event.emit('hidePreferences')
    },
  },
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
