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

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

router.route("")
	.put((async (req, res) => {
		//TODO: Fix the error handling and let Validator do most of the work!
		let hash = await bcrypt.hash(req.body.password, saltRounds).then(result => {return result;})
			.catch(err => {
				console.log("500".bold.red, "PUT /users".bold.white.bgRed, `The password was not able to be encrypted: ${err}`.bold.white.bg);
				res.status(500).send("Internal server error");
			});
		const query = stmts.addUser, args = [req.body.username, req.body.email, hash];
		mySQL.fetch(query, args)
			.then(data => {
				res.status(201).json(wrapper.userCreated(data, req.body.username));
				console.log("201".yellow, "PUT /users".bold, ": ", "Created".bold.green);
			})
			.catch(err => {
				if (err.errno === 1062) {
					console.log("409".bold.red, "PUT /users".bold, ": ", "Username was already taken");
					res.status(409).send("This user already exists");
				} else {
					throw err;
				}
			});
	}));

router.route("/:ouid")//TODO: Mock doesn't have any authorization checks. Don't forget to implement this in DB Callback
	.patch((req, res) => {
		const ouid = parseInt(req.params.ouid);
		const user = mock.users.filter(user => user.userId === ouid);
		if (("username" in req.body || "newPassword" in req.body) && "password" in req.body) {
			switch (user.length) {
			case 1:
				console.log("200".green, `GET /users/${ouid}`.bold, ": ", "OK".bold.green);
				return res.json(user);
			case 0:
				console.log("404".red, `GET /users/${ouid}`.bold, ": ", "User was not found");
				return res.status(404).send(`The user with ID ${ouid} does not exist.`);
			default:
				console.log("500".bold.red, `GET /users/${ouid}`.bold, ": ", "Internal Server Error".bold.bgRed.white, "Server return non-compliant data: Data Integrity may be at risk!".bgRed.white);
				return res.status(500).send("Internal Server Error");
			}
		} else {
			console.log("400".red, "PUT /users".bold, ": ", "Malformed request");
			return res.status(400).send("The request body is incorrect");
		}
	});

module.exports = router;