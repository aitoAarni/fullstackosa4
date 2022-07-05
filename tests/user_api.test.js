const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const { info } = require('../utils/logger')

const helper = require('./user_test_helper')
const mongoose = require('mongoose')

var users



const api = supertest(app)

const initializeUsers = async () => {
    const pass = await bcrypt.hash('password', 10)
    users = helper.users.map(user => {
        return {
            username: user.username,
            name: user.name,
            hashedPass: pass
        }
    })
}

initializeUsers()

beforeEach(async () => {
    await User.deleteMany({})
    const userObjects = users
        .map(user => new User(user))
    await User.insertMany(userObjects)
})


test('Too short username returns error', async () => {
    const content = await api
        .get('/api/users')
    const usersLength = content.body.length
    const user = helper.faultyUsers[0]
    await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect((res) => {
            res.text
                .includes('is shorter than the minimum allowed length')
        })
    const usersAfter = await api
        .get('/api/users')
    expect(usersAfter.body).toHaveLength(usersLength)
})


test('Not unique usernmae returns error', async () => {
    const content = await api
        .get('/api/users')
    const initialLength = content.body.length

    const user = helper.faultyUsers[1]
    await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect((res) => {
            res.text.error === 'username taken'
        })
    const usersAfter = await api
        .get('/api/users')
    expect(usersAfter.body).toHaveLength(initialLength)
})

test('Password is not too short', async () => {
    const content = await api
        .get('/api/users')
    const initialLength = content.body.length

    const user = helper.faultyUsers[2]
    await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect((res) => {
            res.text.error === 'password too short'
        })
    const usersAfter = await api
        .get('/api/users')
    expect(usersAfter.body).toHaveLength(initialLength)
})

afterAll (() => {
    mongoose.connection.close()
})