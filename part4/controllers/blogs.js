const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) { next(error) }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const body = request.body
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title and url are required' })
    }
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: request.user._id
    })
    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()
    response.status(201).json(await savedBlog.populate('user', { username: 1, name: 1 }))
  } catch (error) { next(error) }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(404).end()
    if (blog.user.toString() !== request.user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    request.user.blogs = request.user.blogs.filter(id => id.toString() !== blog._id.toString())
    await request.user.save()
    response.status(204).end()
  } catch (error) { next(error) }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body
    const updated = await Blog.findByIdAndUpdate(
      request.params.id,
      { title: body.title, author: body.author, url: body.url, likes: body.likes },
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })
    if (!updated) return response.status(404).end()
    response.json(updated)
  } catch (error) { next(error) }
})

module.exports = blogsRouter
