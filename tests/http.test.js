const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { info } = require('../utils/logger')
const helper = require('./test_helper')


const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(obj => obj.save())
    await Promise.all(promiseArray)
})


test('with get to /api/blogs right amount of blogs are returned', async () => {
    const response = await api
        .get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('id field is right', async () => {
    const response = await api
        .get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('post method for /api/blogs works', async () => {
    const blog = {
        title: 'some tippies for programs',
        author: 'slayer Masa',
        url: 'Classified',
        likes: 666
    }
    await api
        .post('/api/blogs')
        .send(blog)
    const response = await api.get('/api/blogs')
    const contents = response.body
    expect(contents).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents.map(content => {
        return (
            {
                title: content.title,
                author: content.author,
                url: content.url,
                likes: content.likes
            })
    })).toContainEqual(blog)
})

test('if likes aren\'t given its value is zero', async () => {
    const blog = {
        title: 'some tippies for programs',
        author: 'slayer Masa',
        url: 'Classified',
    }
    await api
        .post('/api/blogs')
        .send(blog)
    const response = await api.get('/api/blogs')
    const contents = response.body
    blog.likes = 0
    expect(contents.map(content => {
        return (
            {
                title: content.title,
                author: content.author,
                url: content.url,
                likes: content.likes
            })
    })).toContainEqual(blog)
})

test('if content in post doesn\'t include title or url fields, status code 400', async () => {
    const blog = { author: 'spede' }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
})

test('Deleting blogs work', async () => {
    const response = await api.get('/api/blogs')
    const originalContent = response.body
    const id = originalContent[0].id
    await api
        .delete(`/api/blogs/${id}`)
    const content = await api.get('/api/blogs')
    expect(content.body).toEqual(expect.not.arrayContaining(originalContent))
})

test('Updating blogs work', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    const updatedBlog = await api
        .put(`/api/blogs/${id}`)
        .send({ ...response.body[0], likes: 123123123 })
    expect(updatedBlog.body.likes).toEqual(123123123)
})