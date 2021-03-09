const express = require('express')
const mock = require('../mock.js') // TODO: Remove this once all callbacks use database callbacks
const router = express.Router()

router.get('', (req,res) => {
    res.json(mock.users)
    console.log("\x1b[33m%s\x1b[0m\x1b[4m%s\x1b[0m\x1b[32m\x1b[0m", "200 ", "/users", ": OK")
})

module.exports = router