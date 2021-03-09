const express = require('express')
const mysql = require('mysql')
const http = require('http')

const exInit = express();

module.exports = {
    DBcon : mysql.createConnection({
        host :'localhost',
        user :'node_provider',
        password :'N0desslyExpress1ve',
        database :'memestash'
    }),
    app : exInit,
    server : http.createServer(exInit)
}