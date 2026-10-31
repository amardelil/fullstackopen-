const { test } = require('node:test')
const assert = require('node:assert/strict')
const helper = require('../utils/list_helper')

const blogs = [
  { title: 'Canonicalization', author: 'Edsger W. Dijkstra', likes: 10 },
  { title: 'Type wars', author: 'Robert C. Martin', likes: 2 },
  { title: 'How to program', author: 'Robert C. Martin', likes: 3 },
  { title: 'The best', author: 'Edsger W. Dijkstra', likes: 5 },
  { title: 'Clean code', author: 'Robert C. Martin', likes: 7 }
]

test('dummy returns one', () => assert.equal(helper.dummy(blogs), 1))
test('total likes', () => assert.equal(helper.totalLikes(blogs), 27))
test('favorite blog', () => assert.deepEqual(helper.favoriteBlog(blogs), blogs[0]))
test('most blogs', () => assert.deepEqual(helper.mostBlogs(blogs), { author: 'Robert C. Martin', blogs: 3 }))
test('most likes', () => assert.deepEqual(helper.mostLikes(blogs), { author: 'Edsger W. Dijkstra', likes: 15 }))
