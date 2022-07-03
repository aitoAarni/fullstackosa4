const mongoose = require('mongoose')
const config = require('../utils/config')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 3
    },
    name: String,
    hashedPass: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
})


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.hashedPass
    }
})

let name = 'User'
console.log('mode: ', config.MODE)
if (config.MODE === 'test') name = 'UserTest'

module.exports = mongoose.model(name, userSchema)