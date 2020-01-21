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
import collect from 'collect.js'
import VirtualList from 'vue-virtual-scroll-list'
import GlyphRow from '@/components/GlyphRow'

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
      item: GlyphRow,
      itemsPerRow: 5,
    }
  },

  computed: {
    count() {
      return this.rows.length
    },

    rows() {
      return collect(this.glyphs)
        .chunk(this.itemsPerRow)
        .toArray()
    },
  },

  methods: {
    getItemprops(itemIndex) {
      return {
        props: {
          glyphs: this.rows[itemIndex],
        },
      }
    },
  },
}
</script>
