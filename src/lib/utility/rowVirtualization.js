/**
 * Build a prefix-sum array from heights.
 * prefixSum[i] = sum of heights[0..i-1]. prefixSum.length = heights.length + 1.
 * @param {number[]} heights
 * @returns {number[]}
 */
export function buildPrefixSum(heights) {
  const out = new Array(heights.length + 1)
  out[0] = 0
  for (let i = 0; i < heights.length; i++) {
    out[i + 1] = out[i] + heights[i]
  }
  return out
}

/**
 * Find the first/last visible row index given a scroll viewport.
 * Uses binary search on the prefix-sum array.
 * Returns -1..-1 if there are no rows.
 *
 * @param {Object} args
 * @param {number[]} args.prefixSum  Output of buildPrefixSum.
 * @param {number}   args.scrollTop  Distance from top of calendar to viewport top (>=0).
 * @param {number}   args.viewportHeight
 * @param {number}   args.overscan   Extra rows to render above/below visible window.
 * @returns {{first: number, last: number}}
 */
export function findVisibleRange({
  prefixSum,
  scrollTop,
  viewportHeight,
  overscan
}) {
  const rowCount = prefixSum.length - 1
  if (rowCount <= 0) {
    return { first: -1, last: -1 }
  }

  const top = Math.max(0, scrollTop)
  const bottom = top + viewportHeight

  let first = upperBound(prefixSum, top) - 1
  let last = upperBound(prefixSum, bottom - 0.0001) - 1

  first = Math.min(rowCount - 1, Math.max(0, first - overscan))
  last = Math.min(rowCount - 1, Math.max(0, last + overscan))
  if (first > last) first = last

  return { first, last }
}

function upperBound(arr, value) {
  let lo = 0
  let hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (arr[mid] > value) hi = mid
    else lo = mid + 1
  }
  return lo
}
