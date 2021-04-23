"use strict";

// Node constants
const express = require("express");

// App Constants
const stmts = require("../statements");
const router = express.Router();
const mySQL = require("../util/mysql.js");
const wrapper = require("../util/wrappers.js");
const {LogicError} = require("../../errors/error");

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.


router.route("/:ouid/cards")
	.get((req, res, next) => {
		const query = stmts.getUserCards, ouid = parseInt(req.params.ouid), args = [ouid];
		mySQL.fetch(query, args)
			.then(result => {
				(result.length === 0)
					? userCheck(ouid).then(userNotExists => {
						(userNotExists)
							? next(new LogicError(404, "User cannot be found"))
							: res.json(wrapper.userCards(ouid, result, true));
					})
					: res.json(wrapper.userCards(ouid, result));
			})
			.catch(()=>next(new LogicError(500, "Internal Server Error")));

		function userCheck(userId) {
			return new Promise(((resolve, reject) => {
				mySQL.fetch(stmts.getUser, [userId])
					.then(data => resolve(data.length === 0))
					.catch(err => reject(err));
			}));
		}
	})
;

//TODO: No checks implemented. Do this when creating the DB Callback
router.route("/:ouid/cards/:cid")
	.put((req, res) => {
		const ouid = parseInt(req.params.ouid), cid = parseInt(req.params.cid);
		res.json({
			userid: ouid,
			count: mock.cards().length,
			cards: mock.cards()
		});
	});

module.exports = router;