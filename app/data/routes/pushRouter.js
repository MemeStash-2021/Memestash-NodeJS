"use strict";

// Node constants
const express = require("express");

// App Constants
const router = express.Router();
const ws = require("../../config/ws.js");
const mySQL = require("../util/mysql");
const stmts = require("../statements");
const {LogicError} = require("../../errors/error");

router.route("/public")
	.get((req, res) => {
		res.json({
			"publicKey": ws.push.publicKey
		});
	});

router.route("/:ouid")
	.post(((req, res, next) => {
		const ouid = parseInt(req.params.ouid);
		const subBlock = req.body;
		mySQL.execute(stmts.updatePush, [
			subBlock.endpoint,
			subBlock.keys.p256dh,
			subBlock.keys.auth,
			ouid
		])
			.then(() => res.status(200).end())
			.catch(() => next(new LogicError(500, "Internal Server Error")));
	}));
module.exports = router;