const usersRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const { info } = require('../utils/logger')

usersRouter.post('/', async (request, response) => {
    info('wazzuppi2')
    const { username, name, password } = request.body
    const sameUserName = await User.findOne({ username: username })
    info('smaa uuuseri', sameUserName)
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

module.exports = usersRouter