import { buildPrefixSum, findVisibleRange } from './rowVirtualization'

describe('buildPrefixSum', () => {
  test('returns [0] for empty input', () => {
    expect(buildPrefixSum([])).toEqual([0])
  })

  test('cumulative sum with leading zero', () => {
    expect(buildPrefixSum([10, 20, 30])).toEqual([0, 10, 30, 60])
  })

  test('handles single-element height arrays', () => {
    expect(buildPrefixSum([42])).toEqual([0, 42])
  })

  test('handles zero heights', () => {
    expect(buildPrefixSum([0, 10, 0, 20])).toEqual([0, 0, 10, 10, 30])
  })
})

describe('findVisibleRange', () => {
  // prefixSum: [0, 50, 100, 150, 200, 250] => 5 rows of 50px each
  const ps = [0, 50, 100, 150, 200, 250]

  test('renders top window with overscan clamped to 0', () => {
    const range = findVisibleRange({
      prefixSum: ps,
      scrollTop: 0,
      viewportHeight: 100,
      overscan: 2
    })
    expect(range.first).toBe(0)
    expect(range.last).toBe(3)
  })

  test('renders middle window', () => {
    const range = findVisibleRange({
      prefixSum: ps,
      scrollTop: 75,
      viewportHeight: 100,
      overscan: 1
    })
    expect(range.first).toBe(0)
    expect(range.last).toBe(4)
  })

  test('renders bottom window clamped to last index', () => {
    const range = findVisibleRange({
      prefixSum: ps,
      scrollTop: 150,
      viewportHeight: 100,
      overscan: 2
    })
    expect(range.first).toBe(1)
    expect(range.last).toBe(4)
  })

  test('viewport beyond content returns last visible row only', () => {
    const range = findVisibleRange({
      prefixSum: ps,
      scrollTop: 300,
      viewportHeight: 100,
      overscan: 0
    })
    expect(range.first).toBe(4)
    expect(range.last).toBe(4)
  })

  test('empty prefix sum returns -1..-1 (nothing to render)', () => {
    const range = findVisibleRange({
      prefixSum: [0],
      scrollTop: 0,
      viewportHeight: 100,
      overscan: 2
    })
    expect(range.first).toBe(-1)
    expect(range.last).toBe(-1)
  })

  test('variable heights with binary-search lookup', () => {
    // rows: 30, 70, 100, 50  -> cumulative [0, 30, 100, 200, 250]
    const variable = [0, 30, 100, 200, 250]

    // viewport [0, 80] -> row 0 (0-30) + row 1 (30-100) visible
    const top = findVisibleRange({
      prefixSum: variable,
      scrollTop: 0,
      viewportHeight: 80,
      overscan: 0
    })
    expect(top.first).toBe(0)
    expect(top.last).toBe(1)

    // viewport [120, 220] -> row 2 (100-200) + row 3 (200-250)
    const mid = findVisibleRange({
      prefixSum: variable,
      scrollTop: 120,
      viewportHeight: 100,
      overscan: 0
    })
    expect(mid.first).toBe(2)
    expect(mid.last).toBe(3)
  })

  test('overscan never goes negative', () => {
    const range = findVisibleRange({
      prefixSum: ps,
      scrollTop: 0,
      viewportHeight: 50,
      overscan: 100
    })
    expect(range.first).toBe(0)
    expect(range.last).toBe(4)
  })
})
