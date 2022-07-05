const mongoose = require('mongoose')
const config = require('../utils/config')
const { info } = require('../utils/logger')

const blog = config.MODE === 'test' ? 'BlogTest' : 'Blog'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 3
    },
    name: String,
    hashedPass: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: blog
    }],
})


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.hashedPass
        info('to string metodi', returnedObject)
    }
})

let name = 'User'
if (config.MODE === 'test') name = 'UserTest'

module.exports = mongoose.model(name, userSchema)