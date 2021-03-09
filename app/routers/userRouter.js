const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    console.log("Endpoint reached!")
})

module.exports = router