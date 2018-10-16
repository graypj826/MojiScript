const reduceWhile = require('../reduceWhile')
const range = require('../range')

describe('list/reduceWhile', () => {
  const isEven = num => num % 2 === 0
  const add = x => y => x + y
  const predicate = acc => () => acc <= 2
  const asyncAdd = x => y => Promise.resolve(x).then(add(y))
  const largePredicate = acc => () => acc <= 6
  const asyncWhenEvenAdd = x => y => isEven(y) ? asyncAdd(x)(y) : add(x)(y)

  function* iterator() {
    yield 1
    yield 2
    yield 3
  }

  test('sync array', () => {
    const expected = 3
    const actual = reduceWhile(predicate)(add)(0)([ 1, 2, 3 ])
    expect(actual).toBe(expected)
  })

  test('sync array with always true predicate calculates normally', () => {
    const expected = 6
    const actual = reduceWhile(largePredicate)(add)(0)([ 1, 2, 3 ])
    expect(actual).toBe(expected)
  })

  test('async array', () => {
    expect.assertions(1)
    const expected = 3
    const actual = reduceWhile(predicate)(asyncAdd)(0)([ 1, 2, 3 ])
    return expect(actual).resolves.toBe(expected)
  })

  test('async array with always true predicate calculates normally', () => {
    expect.assertions(1)
    const expected = 6
    const actual = reduceWhile(largePredicate)(asyncAdd)(0)([ 1, 2, 3 ])
    return expect(actual).resolves.toBe(expected)
  })

  test('sync iterable', () => {
    const expected = 3
    const actual = reduceWhile(predicate)(add)(0)(iterator())
    expect(actual).toBe(expected)
  })

  test('async iterable', () => {
    expect.assertions(1)
    const expected = 3
    const actual = reduceWhile(predicate)(asyncAdd)(0)(iterator())
    return expect(actual).resolves.toBe(expected)
  })

  test('async infinity', () => {
    expect.assertions(1)
    const expected = 3
    const actual = reduceWhile(predicate)(asyncAdd)(0)(range(0)(Infinity))
    return expect(actual).resolves.toBe(expected)
  })

  test('async iterable mixed', () => {
    expect.assertions(1)
    const expected = 3
    const actual = reduceWhile(predicate)(asyncWhenEvenAdd)(0)([ 1, 2, 3 ])
    return expect(actual).resolves.toBe(expected)
  })

  test('async iterable mixed', () => {
    expect.assertions(1)
    const expected = 3
    const actual = reduceWhile(predicate)(asyncWhenEvenAdd)(0)(range(0)(4))
    return expect(actual).resolves.toBe(expected)
  })
})
