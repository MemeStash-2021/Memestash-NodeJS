//TODO: Export Error Handling to separate file & function. (Maybe look into Express's error handler?)

// Node constants
const express = require("express");

// App Constants
const stmts = require("./statements.js");
const router = express.Router();
const mySQL = require("../util/mysql.js");
const wrapper = require("../util/wrappers.js");

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

router.route("")
	.get((req, res) => {
		const name = req.query.name,
			query = (name === undefined) ? stmts.getUsers : stmts.getUsersFiltered,
			args = (name === undefined) ? undefined : ["%" + name + "%"];
		mySQL.fetch(query, args)
			.then(data => {
				res.json(data.map(user => wrapper.simpleUser(user)));
				console.log("200".yellow, "GET /users".bold, ": ", "OK".bold.green);
			})
			.catch(error => {
				throw error;
			});
	});

router.route("/:ouid")
	.get((req, res) => {
		const query = stmts.getUser, args = [parseInt(req.params.ouid)];
		mySQL.fetch(query, args)
			.then(result => {
				(result.length === 0)
					? res.status(404).json({message: "Unable to find user"})
					: res.json(wrapper.fullUser(result));
			})
			.catch(err => {
				if (err) throw err;
			});
	});

router.route("/:ouid/cards")
	.get((req, res) => {
		const query = stmts.getUserCards, ouid = parseInt(req.params.ouid), args = [ouid];
		mySQL.fetch(query, args)
			.then(result => {
				if (result.length === 0) {
					userCheck(ouid).then((userNotExists) => {(userNotExists) 
						? res.status(404).json({message: "The user could not be found"})
						: res.json(wrapper.userCards(ouid, result, true));
					}).catch((err) => {
						throw err;
					});
				} else {
					res.json(wrapper.userCards(ouid, result));
				}
			})
			.catch(err => {
				throw err;
			});

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
		console.log("200".yellow, `GET /users/${ouid}/wallet`.bold, ": ", "OK".bold.green);
	}));

router.route("/:ouid/chats")
	.get(((req, res) => {
		let json = [];
		for (let i = 0; i < 5; i++) {
			json.push({
				correspondent: {
					id: 1,
					name: `user ${i}`
				},
				latestMessage: {
					message: "This is a example message",
					date: "2021-03-25T16:58:27.363Z",
					sender: `user ${i}`,
					senderId: i
				}
			});
		}
		res.json(json);
	}));

router.route("/:ouid/chats/:tuid")
	.get(((req, res) => {
		const ouid = parseInt(req.params.ouid), tuid = parseInt(req.params.tuid);
		let json = [];
		for (let i = 0; i < 10; i++) {
			json.push({
				message: "This is a example message",
				date: `2021-03-2${5 - i}T17:13:20.599Z`,
				sender: (i % 2 === 0) ? "Mori" : "Ruiner",
				senderId: (i % 2 === 0) ? ouid : tuid
			});
		}
		res.json(json);
	}))
// TODO: Don't forget to implement the actual query parameters
	.patch((req, res) => {
		const ouid = parseInt(req.params.ouid), tuid = parseInt(req.params.tuid), message = req.body.message;
		let json = [];
		for (let i = 0; i < 10; i++) {
			json.push({
				message: (i === 0) ? message : "This is a example message",
				date: `2021-03-2${5 - i}T17:13:20.599Z`,
				sender: (i % 2 === 0) ? "Mori" : "Ruiner",
				senderId: (i % 2 === 0) ? ouid : tuid
			});
		}
		res.json({
			user: {
				id: ouid,
				name: "Ruiner"
			},
			correspondent: {
				id: tuid,
				name: "Mori"
			},
			messages: json
		});
	})
	.put(((req, res) => {
		const ouid = parseInt(req.params.ouid), tuid = parseInt(req.params.tuid), message = req.body.message;
		res.json({
			user: {
				id: ouid,
				name: "Ruiner"
			},
			correspondent: {
				id: tuid,
				name: "Mori"
			},
			messages: {
				message: message,
				date: "2021-03-25T17:13:20.599Z",
				sender: "Mori",
				senderId: ouid
			}
		});
	}));

module.exports = router;
