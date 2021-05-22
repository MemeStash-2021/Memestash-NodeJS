"use strict";

// Node constants
const express = require("express");

// App Constants
const router = express.Router();
const ws = require("../../config/ws.js");

router.route("/public")
	.get((req, res, next) => {
		res.json({
			"publicKey": ws.push.publicKey
		});
	});

module.exports = router;