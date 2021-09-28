const express = require('express')
const app = express()
const host = '127.0.0.1'
const port = 4545
const http = require('http').createServer(app)

const postApi = require('./api/post')

app.use(express.json())
app.use('/api/v1/posts', postApi)

app.get('/', (req, res) => {
    res.status(200).send({
        server_status: 'api server running',
        date: new Date().toString()
    })
})

http.listen(port, host, () => {
    console.log(`server runing at http://${host}:${port}/`);
})

module.exports = http
