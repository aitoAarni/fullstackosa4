const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')


const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(obj => obj.save())
    await Promise.all(promiseArray)
})


test('right amount of blogs are returned', async () => {
    const response = await api
    .get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
})