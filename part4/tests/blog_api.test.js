require('dotenv').config()
const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)
const initialBlogs = [
  { title: 'First blog', author: 'Author One', url: 'https://one.example', likes: 5 },
  { title: 'Second blog', author: 'Author Two', url: 'https://two.example', likes: 3 }
]
let token

before(async () => {
  if (!process.env.TEST_MONGODB_URI) throw new Error('TEST_MONGODB_URI is required')
  await mongoose.connect(process.env.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret123', 10)
  const user = await new User({ username: 'tester', name: 'Test User', passwordHash, blogs: [] }).save()
  const login = await api.post('/api/login').send({ username: 'tester', password: 'secret123' })
  token = login.body.token
  for (const blog of initialBlogs) {
    const saved = await new Blog({ ...blog, user: user._id }).save()
    user.blogs = user.blogs.concat(saved._id)
  }
  await user.save()
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

test('blogs are returned as JSON', async () => {
  await api.get('/api/blogs').expect(200).expect('Content-Type', /application\\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.equal(response.body.length, initialBlogs.length)
})

test('blog has id property instead of _id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok(response.body[0].id)
  assert.equal(response.body[0]._id, undefined)
})

test('new blog can be created with a valid token', async () => {
  const newBlog = { title: 'New blog', author: 'Tester', url: 'https://new.example', likes: 8 }
  const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)
  assert.equal(response.body.title, newBlog.title)
  assert.equal(response.body.likes, 8)
  const blogsAtEnd = await api.get('/api/blogs')
  assert.equal(blogsAtEnd.body.length, initialBlogs.length + 1)
})

test('likes defaults to zero when omitted', async () => {
  const response = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'No likes field', author: 'Tester', url: 'https://zero.example' })
    .expect(201)
  assert.equal(response.body.likes, 0)
})

test('blog creation without token is rejected', async () => {
  await api.post('/api/blogs')
    .send({ title: 'No auth', author: 'Nobody', url: 'https://noauth.example' })
    .expect(401)
})

test('blog without title or url is rejected', async () => {
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
    .send({ author: 'Tester' }).expect(400)
})

test('a user can delete their own blog', async () => {
  const blogs = await api.get('/api/blogs')
  await api.delete(`/api/blogs/${blogs.body[0].id}`)
    .set('Authorization', `Bearer ${token}`).expect(204)
})

test('a user cannot delete another user blog', async () => {
  const passwordHash = await bcrypt.hash('another123', 10)
  const other = await new User({ username: 'another', passwordHash }).save()
  const blog = await new Blog({ title: 'Other blog', author: 'Other', url: 'https://other.example', user: other._id }).save()
  await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${token}`).expect(403)
})

test('users are returned and password hash is not exposed', async () => {
  const response = await api.get('/api/users').expect(200)
  assert.equal(response.body[0].username, 'tester')
  assert.equal(response.body[0].passwordHash, undefined)
})

test('a user can be created', async () => {
  const response = await api.post('/api/users')
    .send({ username: 'newuser', name: 'New User', password: 'pass123' })
    .expect(201)
  assert.equal(response.body.username, 'newuser')
  assert.equal(response.body.passwordHash, undefined)
})

test('user creation rejects short username and password', async () => {
  await api.post('/api/users').send({ username: 'ab', password: '123' }).expect(400)
})

test('login succeeds with correct credentials', async () => {
  const response = await api.post('/api/login')
    .send({ username: 'tester', password: 'secret123' }).expect(200)
  assert.ok(response.body.token)
})

test('login fails with incorrect password', async () => {
  await api.post('/api/login').send({ username: 'tester', password: 'wrong' }).expect(401)
})
