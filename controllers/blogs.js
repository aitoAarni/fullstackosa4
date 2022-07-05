const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')
const { MODE } = require('../utils/config')
const { info } = require('../utils/logger')
const { userExtractor } = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    if (!body.title && !body.url) {
        response.status(400).end()
        return
    }
    const user = await User.findById(request.user)
    const blog = new Blog({ ...body, user: user.id })


    const savedBlog = await blog.save()
    const str = JSON.stringify(savedBlog)
    user.blogs = user.blogs.concat(JSON.parse(str).id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (request.user === blog.user) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
})

blogsRouter.put('/:id', async (requst, response) => {
    const blog = await Blog.findById(requst.params.id)
    blog.likes = requst.body.likes
    const responseBlog = await Blog.findByIdAndUpdate(requst.params.id, blog, { new: true })
    response.json(responseBlog)
})

module.exports = blogsRouter