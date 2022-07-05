const config = require('./config')

const info = (...params) => {
    if (config.MODE === 'tesst') return
    console.log(...params)
}

const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}