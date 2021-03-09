const express = require('express')
const mysql = require('mysql')
const http = require('http')

const app = express();

module.exports = {
    DBcon : mysql.createConnection({
        host :'localhost',
        user :'node_provider',
        password :'N0desslyExpress1ve',
        database :'memestash'
    }),
    app : app,
    server : http.createServer(app),
    express : express
}