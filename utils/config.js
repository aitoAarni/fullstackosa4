/* eslint-disable no-undef */
require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let MODE = process.env.NODE_ENV

module.exports = {
    MONGODB_URI,
    PORT,
    MODE
}