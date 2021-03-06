//TODO: Export Error Handling to separate file & function. (Maybe look into Express's error handler?)

// Node constants
const express = require("express");

// App Constants
const stmts = require("../statements");
const userRouter = express.Router();
const mySQL = require("../util/mysql.js");
const wrapper = require("../util/wrappers.js");
const {LogicError} = require("../../errors/error");

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

userRouter.route("")
	.get((req, res, next) => {
		const name = req.query.name,
			query = (name === undefined) ? stmts.getUsers : stmts.getUsersFiltered,
			args = (name === undefined) ? undefined : ["%" + name + "%"];
		mySQL.execute(query, args)
			.then(data => res.json(data.map(user => wrapper.simpleUser(user))))
			.catch(() => next(new LogicError(500, "Internal Server Error")));
	});

userRouter.route("/:ouid")
	.get((req, res, next) => {
		const query = stmts.getUser, args = [parseInt(req.params.ouid)];
		mySQL.execute(query, args)
			.then(result => (result.length === 0)
				? next(new LogicError(404, "User not found"))
				: res.json(wrapper.fullUser(result))
			)
			.catch(() => next(new LogicError(500, "Internal Server Error")));
	});


//TODO: In real callback, implement logic & parameter checking
userRouter.route("/:ouid/wallet")
	.put(((req, res) => {
		const ouid = parseInt(req.params.ouid);
		res.json({
			id: ouid,
			name: mock.users[0].username,
			wallet: 80000,
			cards: mock.cards()
		});
	}));

module.exports = userRouter;
