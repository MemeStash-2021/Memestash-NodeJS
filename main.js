const mysql = require('mysql')
const express = require('express')
const http = require('http')

const connection = mysql.createConnection({
    host :'localhost',
    user :'node_provider',
    password :'N0desslyExpress1ve',
    database :'memestash'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.end();