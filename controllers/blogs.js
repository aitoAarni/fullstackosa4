const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { info } = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = await request.body
    info(body)
    if (!body.title && !body.url) {
        response.status(400).end()
        return
    }
    const blog = new Blog(body)

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
})

module.exports = blogsRouter