const reverse = string => string.split('').reverse().join('')
const average = numbers => numbers.length === 0
  ? 0
  : numbers.reduce((sum, number) => sum + number, 0) / numbers.length

module.exports = { reverse, average }
