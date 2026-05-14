"use strict";

var _rowVirtualization = require("./rowVirtualization");

describe('buildPrefixSum', function () {
  test('returns [0] for empty input', function () {
    expect((0, _rowVirtualization.buildPrefixSum)([])).toEqual([0]);
  });
  test('cumulative sum with leading zero', function () {
    expect((0, _rowVirtualization.buildPrefixSum)([10, 20, 30])).toEqual([0, 10, 30, 60]);
  });
  test('handles single-element height arrays', function () {
    expect((0, _rowVirtualization.buildPrefixSum)([42])).toEqual([0, 42]);
  });
  test('handles zero heights', function () {
    expect((0, _rowVirtualization.buildPrefixSum)([0, 10, 0, 20])).toEqual([0, 0, 10, 10, 30]);
  });
});
describe('findVisibleRange', function () {
  // prefixSum: [0, 50, 100, 150, 200, 250] => 5 rows of 50px each
  var ps = [0, 50, 100, 150, 200, 250];
  test('renders top window with overscan clamped to 0', function () {
    var range = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: ps,
      scrollTop: 0,
      viewportHeight: 100,
      overscan: 2
    });
    expect(range.first).toBe(0);
    expect(range.last).toBe(3);
  });
  test('renders middle window', function () {
    var range = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: ps,
      scrollTop: 75,
      viewportHeight: 100,
      overscan: 1
    });
    expect(range.first).toBe(0);
    expect(range.last).toBe(4);
  });
  test('renders bottom window clamped to last index', function () {
    var range = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: ps,
      scrollTop: 150,
      viewportHeight: 100,
      overscan: 2
    });
    expect(range.first).toBe(1);
    expect(range.last).toBe(4);
  });
  test('viewport beyond content returns last visible row only', function () {
    var range = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: ps,
      scrollTop: 300,
      viewportHeight: 100,
      overscan: 0
    });
    expect(range.first).toBe(4);
    expect(range.last).toBe(4);
  });
  test('empty prefix sum returns -1..-1 (nothing to render)', function () {
    var range = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: [0],
      scrollTop: 0,
      viewportHeight: 100,
      overscan: 2
    });
    expect(range.first).toBe(-1);
    expect(range.last).toBe(-1);
  });
  test('variable heights with binary-search lookup', function () {
    // rows: 30, 70, 100, 50  -> cumulative [0, 30, 100, 200, 250]
    var variable = [0, 30, 100, 200, 250]; // viewport [0, 80] -> row 0 (0-30) + row 1 (30-100) visible

    var top = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: variable,
      scrollTop: 0,
      viewportHeight: 80,
      overscan: 0
    });
    expect(top.first).toBe(0);
    expect(top.last).toBe(1); // viewport [120, 220] -> row 2 (100-200) + row 3 (200-250)

    var mid = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: variable,
      scrollTop: 120,
      viewportHeight: 100,
      overscan: 0
    });
    expect(mid.first).toBe(2);
    expect(mid.last).toBe(3);
  });
  test('overscan never goes negative', function () {
    var range = (0, _rowVirtualization.findVisibleRange)({
      prefixSum: ps,
      scrollTop: 0,
      viewportHeight: 50,
      overscan: 100
    });
    expect(range.first).toBe(0);
    expect(range.last).toBe(4);
  });
});