const { test } = require('node:test')
const assert = require('node:assert/strict')
const { reverse, average } = require('../utils/for_testing')

test('reverse of a string', () => assert.equal(reverse('react'), 'tcaer'))
test('average of numbers', () => assert.equal(average([1, 2, 3, 4]), 2.5))
test('average of empty array', () => assert.equal(average([]), 0))
