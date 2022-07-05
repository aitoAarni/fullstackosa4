const User = require('../models/users')
const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const { info } = require('../utils/logger')


usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const sameUserName = await User.findOne({ username: username })
    if (sameUserName) {
        return response.status(400).json({ error: 'username taken' })
    }
    if (password.length < 3) {
        return response.status(400).json({ error: 'password too short' })
    }
    const hashedPass = await bcrypt.hash(password, 10)
    const user = new User({ username, name, hashedPass, })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const content = await User.find({}).populate('blogs')
    response.json(content)
})

module.exports = usersRouter