const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/users')
const { SECRET } = require('../utils/config')
const { info } = require('../utils/logger')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false : await bcrypt.compare(password, user.hashedPass)

    if (!passwordCorrect) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
    const userForToken = {
        username,
        id: user._id,

    }
    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60*60 })
    response
        .status(200)
        .send({ token, username, name: user.name })
})

module.exports = loginRouter