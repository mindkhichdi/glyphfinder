<template>
  <div class="glyph-list">
    <virtual-list
      :start="0"
      :size="50"
      :remain="8"
      :item="rowComponent"
      :itemcount="rowsCount"
      :itemprops="getItemProps"
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
      rowComponent: GlyphRow,
      itemsPerRow: 5,
    }
  },

  computed: {
    rowsCount() {
      return this.rows.length
    },

    rows() {
      return collect(this.glyphs)
        .chunk(this.itemsPerRow)
        .toArray()
    },
  },

  methods: {
    getItemProps(itemIndex) {
      return {
        props: {
          glyphs: this.rows[itemIndex],
        },
      }
    },
  },
}
</script>
