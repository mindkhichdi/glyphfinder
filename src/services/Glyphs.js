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

      this.items.forEach(glyph => builder.add(glyph))
    })
  }

  buildItems(items) {
    return collect(items)
      .map(glyph => {
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
      .sortBy(glyph => glyph.symbol)
      .toArray()
  }

  search(searchQuery = null) {
    const filteredQuery = searchQuery ? searchQuery.toLowerCase().trim() : ''

    if (filteredQuery === '') {
      return this.items
    }

    return this.idx
      .query(query => {
        // exact match
        query.term(filteredQuery, {
          fields: ['symbol', 'entities', 'alts', 'tags'],
          boost: 10,
        })

        // first chars correct
        query.term(filteredQuery, {
          fields: ['symbol', 'entities', 'tags'],
          boost: 5,
          wildcard: lunr.Query.wildcard.TRAILING,
        })

        // fuzzy
        query.term(filteredQuery, {
          fields: ['symbol', 'entities', 'tags'],
          editDistance: 1,
        })

        query.term(filteredQuery, {
          fields: ['description'],
          wildcard: lunr.Query.wildcard.TRAILING,
        })
      })
      .map(item => ({
        ...this.items.find(glyph => glyph.symbol === item.ref),
        score: item.score,
      }))
  }

}()
