"use strict";

// Node constants
const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// App Constants
const stmts = require("./statements.js");
const router = express.Router();
const mySQL = require("../util/mysql.js");
const wrapper = require("../util/wrappers.js");
const log = require("../util/logger");
const {HTTPError} = require("../../errors/error");

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

router.route("")
	.put((async (req, res, next) => {
		//TODO: Fix the error handling and let Validator do most of the work!
		let hash = await bcrypt.hash(req.body.password, saltRounds)
			.then(result => {return result;})
			.catch(() => next(new HTTPError(500, "Internal Server Error")));
		const query = stmts.addUser, args = [req.body.username, req.body.email, hash];
		mySQL.fetch(query, args)
			.then(data => {
				res.status(201).json(wrapper.userCreated(data, req.body.username));
				log.log201(req);
			})
			.catch(err => (err.errno === 1062)
				? next(new HTTPError(409, "This user already exists"))
				: next(new HTTPError(500, "Internal Server Error"))
			);
	}));

router.route("/:ouid")//TODO: Mock doesn't have any authorization checks. Don't forget to implement this in DB Callback
	.patch((req, res, next) => {
		const ouid = parseInt(req.params.ouid);
		const user = mock.users.filter(user => user.userId === ouid);
		if (("username" in req.body || "newPassword" in req.body) && "password" in req.body) {
			switch (user.length) {
			case 1:
				log.log200(req);
				return res.json(user);
			case 0:
				next(new HTTPError(404, "User Not Found"));break;
			default:
				next(new HTTPError(500, "Internal Server Error")); break;
			}
		} else {
			next(new HTTPError(400, "Malformed body"));
		}
	});

module.exports = router;