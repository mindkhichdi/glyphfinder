import FlexSearch from 'flexsearch'
import data from '../generator/dist/data.json'

export default new class {

  constructor() {
    this.index = new FlexSearch({
      doc: {
        id: 'symbol',
        field: [
          'symbol',
          'name',
          'tags',
        ],
      },
      tokenize(str) {
        const words = str.match(/\S+/g) || []

        return words
          .map(word => {
            const isWordWithHyphens = /^((?:\w+-)+\w+)$/.test(word)

            if (isWordWithHyphens) {
              return word.split('-')
            }

            return word
          })
          .flat()
          .map(word => {
            const tokens = []

            for (let i = 0; i < word.length; i += 1) {
              tokens.push(word.slice(0, i + 1))
            }

            return tokens
          })
          .flat()
      },
    })

    this.index.add(data)

    console.log(this.index.info())
  }

  // getRows(glyphs = [], count) {
  //   return collect(glyphs)
  //     .chunk(count)
  //     .toArray()
  // }

  search(query = null) {
    const filteredQuery = query ? query.toLowerCase().trim() : ''

    if (filteredQuery === '') {
      return data
    }

    return this.index.search(filteredQuery, {
      limit: 100000,
    })
  }

}()
