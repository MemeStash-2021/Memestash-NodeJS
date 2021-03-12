const mysql = require('mysql')
let conn;

module.exports = {
    config : connect,
    conn: conn
}

function connect(){
    conn = mysql.createConnection({
        host :'localhost',
        port: 3306,
        user :'node_provider',
        password :'N0desslyExpress1ve',
        database :'memestash'
    })
}