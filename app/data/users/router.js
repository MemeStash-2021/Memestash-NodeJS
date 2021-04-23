//TODO: Export Error Handling to separate file & function. (Maybe look into Express's error handler?)

// Node constants
const express = require("express");

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
	.get((req, res, next) => {
		const name = req.query.name,
			query = (name === undefined) ? stmts.getUsers : stmts.getUsersFiltered,
			args = (name === undefined) ? undefined : ["%" + name + "%"];
		mySQL.fetch(query, args)
			.then(data => {
				res.json(data.map(user => wrapper.simpleUser(user)));
				log.log200(req);
			})
			.catch(() => next(new HTTPError(500, "Internal Server Error")));
	});

router.route("/:ouid")
	.get((req, res, next) => {
		const query = stmts.getUser, args = [parseInt(req.params.ouid)];
		mySQL.fetch(query, args)
			.then(result => {
				if (result.length === 0){
					next(new HTTPError(404, "User not found"));
				} else {
					res.json(wrapper.fullUser(result));
					log.log200(req);
				}
			})
			.catch(() => next(new HTTPError(500, "Internal Server Error")));
	});


//TODO: In real callback, implement logic & parameter checking
router.route("/:ouid/wallet")
	.put(((req, res) => {
		const ouid = parseInt(req.params.ouid);
		res.json({
			id: ouid,
			name: mock.users[0].username,
			wallet: 80000,
			cards: mock.cards()
		});
		log.log200(req);
	}));

module.exports = router;
