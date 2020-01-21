<template>
  <div class="glyph-list">
    <virtual-list
      :size="50"
      :remain="8"
      :item="item"
      :itemcount="count"
      :itemprops="getItemprops"
    />
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import GlyphItem from '@/components/GlyphItem'

export default {
  components: {
    VirtualList,
  },

  props: {
    glyphs: {
      type: Array,
      default: () => ([]),
    },
  },

  data() {
    return {
      item: GlyphItem,
    }
  },

  computed: {
    count() {
      return this.glyphs.length
    },
  },

  methods: {
    getItemprops(itemIndex) {
      return {
        props: {
          glyph: this.glyphs[itemIndex],
        },
      }
    },
  },
}
</script>
