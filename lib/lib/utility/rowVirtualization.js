"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPrefixSum = buildPrefixSum;
exports.findVisibleRange = findVisibleRange;

/**
 * Build a prefix-sum array from heights.
 * prefixSum[i] = sum of heights[0..i-1]. prefixSum.length = heights.length + 1.
 * @param {number[]} heights
 * @returns {number[]}
 */
function buildPrefixSum(heights) {
  var out = new Array(heights.length + 1);
  out[0] = 0;

  for (var i = 0; i < heights.length; i++) {
    out[i + 1] = out[i] + heights[i];
  }

  return out;
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


function findVisibleRange(_ref) {
  var prefixSum = _ref.prefixSum,
      scrollTop = _ref.scrollTop,
      viewportHeight = _ref.viewportHeight,
      overscan = _ref.overscan;
  var rowCount = prefixSum.length - 1;

  if (rowCount <= 0) {
    return {
      first: -1,
      last: -1
    };
  }

  var top = Math.max(0, scrollTop);
  var bottom = top + viewportHeight;
  var first = upperBound(prefixSum, top) - 1;
  var last = upperBound(prefixSum, bottom - 0.0001) - 1;
  first = Math.min(rowCount - 1, Math.max(0, first - overscan));
  last = Math.min(rowCount - 1, Math.max(0, last + overscan));
  if (first > last) first = last;
  return {
    first: first,
    last: last
  };
}

function upperBound(arr, value) {
  var lo = 0;
  var hi = arr.length;

  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (arr[mid] > value) hi = mid;else lo = mid + 1;
  }

  return lo;
}