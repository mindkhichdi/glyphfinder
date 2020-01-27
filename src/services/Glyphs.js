import FlexSearch from 'flexsearch'
import collect from 'collect.js'
import data from '../data/data.json'

export default new class {

  constructor() {
    this.index = new FlexSearch({
      cache: true,
      doc: {
        id: 'symbol',
        field: {
          signs: {
            tokenize: this.tokenize.bind(this),
          },
          words: {
            tokenize: this.tokenize.bind(this),
          },
        },
      },
    })

    const formattedData = data.map(item => {
      const [words, signs] = collect(item.tags.match(/\S+/g) || [])
        .partition(str => this.isWord(str) || this.isWordWithHyphens(str))
        .toArray()

      return {
        ...item,
        signs: [
          item.symbol,
          ...signs,
        ].join(' '),
        words: [
          ...words,
          item.entities,
          item.category,
          item.name,
        ].join(' '),
      }
    })

    this.index.add(formattedData)
  }

  isWord(value) {
    return /^[a-zA-Z0-9]+$/.test(value)
  }

  isWordWithHyphens(value) {
    return /^((?:\w+-)+\w+)$/.test(value)
  }

  tokenize(value) {
    const words = value.match(/\S+/g) || []

    return words
      .map(word => {
        if (this.isWordWithHyphens(word)) {
          return word.split('-')
        }

        return word
      })
      .flat()
      .map(word => {
        if (word.length === 1) {
          return [word]
        }

        const tokens = []

        for (let i = 0; i < word.length; i += 1) {
          tokens.push(word.slice(0, i + 1))
        }

        return tokens
          .filter(token => {
            if (this.isWord(token)) {
              return token.length > 1
            }

            return true
          })
      })
      .flat()
  }

  search(query = null) {
    const filteredQuery = query ? query.toLowerCase().trim() : ''

    if (filteredQuery === '') {
      return data
    }

    return this.index.search({
      query: filteredQuery,
      limit: 100000,
    })
  }

}()
