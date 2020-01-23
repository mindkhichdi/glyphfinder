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
            tokenize: str => str.split(' '),
          },
          words: {
            tokenize: 'forward',
          },
        },
      },
      split: ' ',
      tokenize: this.tokenize,
    })

    const formattedData = data.map(item => {
      const [words, signs] = collect(item.tags.match(/\S+/g) || [])
        .partition(str => {
          const isWord = /^[a-zA-Z]+$/.test(str)
          const isWordWithHyphens = /^((?:\w+-)+\w+)$/.test(str)
          return isWord || isWordWithHyphens
        })
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

  // tokenize(value) {
  //   const words = value.match(/\S+/g) || []

  //   return words
  //     .map(word => {
  //       const isWordWithHyphens = /^((?:\w+-)+\w+)$/.test(word)

  //       if (isWordWithHyphens) {
  //         return word.split('-')
  //       }

  //       return word
  //     })
  //     .flat()
  //     .map(word => {
  //       const tokens = []

  //       for (let i = 0; i < word.length; i += 1) {
  //         tokens.push(word.slice(0, i + 1))
  //       }

  //       return tokens
  //     })
  //     .flat()
  // }

  search(query = null) {
    const filteredQuery = query ? query.toLowerCase().trim() : ''

    if (filteredQuery === '') {
      return data
    }

    return this.index.search({
      query: filteredQuery,
      limit: 100000,
    })
    // return this.index.search([{
    //   field: 'signs',
    //   query: filteredQuery,
    //   bool: 'and',
    // }, {
    //   field: 'words',
    //   query: filteredQuery,
    //   bool: 'or',
    // }])
  }

}()
