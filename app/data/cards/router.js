// Node constants
const express = require('express')
const mysql = require("mysql");

// App Constants
const db = require('../../config/database.js')
const stmts = require('./statements.js')
const router = express.Router()

// Data Constants
const mock = require('../../mock.js') // TODO: Remove this once all callbacks use database callback.

router.get('', (req, res) => {
    const name = req.query.name;
    const id = req.query.id;
    let json = mock.cards();
    if(id !== undefined){
        json.filter((card) => {
            return card.id === id;

        })
    }
    if(name !== undefined){
        json.filter((card) => {
            return card.name.includes(name);
        })
    }
    res.json(json)
    console.log("200".yellow, "GET /cards".bold, ": ", "OK".bold.green)
})

module.exports = router