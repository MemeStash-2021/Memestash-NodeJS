const express = require('express')
const mock = require('../mock.js') // TODO: Remove this once all callbacks use database callbacks
const router = express.Router()

router.get('', (req,res) => {
    res.json(mock.users)
    console.log("200".yellow, "/users".bold, ": ", "OK".bold.green)
})

module.exports = router