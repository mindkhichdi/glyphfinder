import collect from 'collect.js'
import lunr from 'lunr'
import data from '@/data.yaml'

export default new class {

  constructor() {
    this.items = this.buildItems(data)

    this.idx = lunr(builder => {
      builder.pipeline.remove(lunr.trimmer)
      builder.pipeline.remove(lunr.stemmer)
      builder.pipeline.remove(lunr.stopWordFilter)

      builder.ref('symbol')
      builder.field('symbol')
      builder.field('entities')
      builder.field('tags')
      builder.field('alts')
      builder.field('description')

      this.items.forEach(glyph => {
        builder.add(glyph)
      })
    })
  }

  buildItems(items) {
    return items.map(glyph => {
      const unfilteredTags = glyph.tags
      const [tags, alts] = collect(unfilteredTags)
        .partition(item => {
          const isWord = /^\w{2,}$/.test(item) // min 2 letters
          const isWordWithHyphens = /^((?:\w+-)+\w+)$/.test(item)

          return isWord || isWordWithHyphens
        })
        .toArray()

      return {
        ...glyph,
        unfilteredTags,
        tags,
        alts,
      }
    })
  }

  search(searchQuery = null) {
    if (searchQuery === null) {
      return this.items
    }

    return this.idx
      .query(query => {
        // exact match
        query.term(searchQuery, {
          fields: ['symbol', 'entities', 'alts', 'tags'],
          boost: 3,
        })

        // first chars correct
        query.term(searchQuery, {
          fields: ['symbol', 'entities', 'tags'],
          boost: 2,
          wildcard: lunr.Query.wildcard.TRAILING,
        })

        // fuzzy
        query.term(searchQuery, {
          fields: ['symbol', 'entities', 'tags'],
          editDistance: 1,
          boost: 1,
        })

        query.term(searchQuery, {
          fields: ['description'],
          wildcard: lunr.Query.wildcard.TRAILING,
        })
      })
      .map(item => ({
        ...data.find(glyph => glyph.symbol === item.ref),
        score: item.score,
      }))
  }

}()
