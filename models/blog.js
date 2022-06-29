const mongoose = require('mongoose')
const config = require('../utils/config')


const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})


blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

let name = 'Blog'
console.log('mode: ', config.MODE)
if (config.MODE === 'test') name = 'BlogTest'

module.exports = mongoose.model(name, blogSchema)