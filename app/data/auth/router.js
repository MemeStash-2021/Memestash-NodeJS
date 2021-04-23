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

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

router.route("")
	.put((async (req, res) => {
		//TODO: Fix the error handling and let Validator do most of the work!
		let hash = await bcrypt.hash(req.body.password, saltRounds).then(result => {return result;})
			.catch(err => {
				res.status(500).send("Internal server error");
				log.log500(req);
			});
		const query = stmts.addUser, args = [req.body.username, req.body.email, hash];
		mySQL.fetch(query, args)
			.then(data => {
				res.status(201).json(wrapper.userCreated(data, req.body.username));
				log.log201(req);
			})
			.catch(err => {
				if (err.errno === 1062) {
					res.status(409).send("This user already exists");
					log.log409(req, "Username was already taken");
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
				log.log200(req);
				return res.json(user);
			case 0:
				log.log404(req, "User was not found");
				return res.status(404).send(`The user with ID ${ouid} does not exist.`);
			default:
				log.log500(req);
				return res.status(500).send("Internal Server Error");
			}
		} else {
			log.log400(req);
			return res.status(400).send("The request body is incorrect");
		}
	});

module.exports = router;