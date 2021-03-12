const mysql = require('mysql')

module.exports = {
    DBcon : mysql.createConnection({
        host :'localhost',
        user :'node_provider',
        password :'N0desslyExpress1ve',
        database :'memestash'
    })
}