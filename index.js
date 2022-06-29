const http = require('http')
const app = require('./app')
const { info, error } = require('./utils/logger')
const config = require('./utils/config')



const server = http.createServer(app)

server.listen(config.PORT, () => {
    info(`Server running on port ${config.PORT}`)
})