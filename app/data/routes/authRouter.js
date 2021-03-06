"use strict";

// Node constants
const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// App Constants
const stmts = require("../statements");
const authRouter = express.Router();
const mySQL = require("../util/mysql.js");
const wrapper = require("../util/wrappers.js");
const {LogicError} = require("../../errors/error");

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

authRouter.route("")
	.put((async (req, res, next) => {
		let hash = await bcrypt.hash(req.body.password, saltRounds)
			.then(result => {return result;})
			.catch(() => next(new LogicError(500, "Internal Server Error")));
		const query = stmts.addUser, args = [req.body.username, req.body.email, hash];
		mySQL.execute(query, args)
			.then(data => res.status(201).json(wrapper.userCreated(data, req.body.username)))
			.catch(err => (err.errno === 1062)
				? next(new LogicError(409, "This user already exists"))
				: next(new LogicError(500, "Internal Server Error"))
			);
	}));

authRouter.route("/:ouid")//TODO: Mock doesn't have any authorization checks. Don't forget to implement this in DB Callback
	.patch((req, res, next) => {
		const ouid = parseInt(req.params.ouid);
		const user = mock.users.filter(user => user.userId === ouid);
		if (("username" in req.body || "newPassword" in req.body) && "password" in req.body) {
			switch (user.length) {
			case 1:
				return res.json(user);
			case 0:
				next(new LogicError(404, "User Not Found"));break;
			default:
				next(new LogicError(500, "Internal Server Error")); break;
			}
		} else {
			next(new LogicError(400, "Malformed body"));
		}
	});

module.exports = authRouter;