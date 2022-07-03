const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')
const { info } = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = await request.body
    if (!body.title && !body.url) {
        response.status(400).end()
        return
    }
    info('userId 123: ', body.userId)
    const user = await User.findById(body.userId)
    const blog = new Blog({ ...body, user: user.id })
    info('user123: ', user)

    const savedBlog = await blog.save()
    info('savedBlog12: ', savedBlog.toJSON())
    const blogJson = savedBlog.toJSON()
    user.blogs.concat(blogJson.id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (requst, response) => {
    const blog = await Blog.findById(requst.params.id)
    blog.likes = requst.body.likes
    const responseBlog = await Blog.findByIdAndUpdate(requst.params.id, blog, { new: true })
    response.json(responseBlog)
})

module.exports = blogsRouter