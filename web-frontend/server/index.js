var express = require('express')
var port = process.env.PORT || 3000
var app = express()


let distPath = process.argv[2] || 'dist'

app.use(express.static(distPath))

app.listen(port)