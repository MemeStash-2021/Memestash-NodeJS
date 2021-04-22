//TODO: Export Error Handling to separate file & function. (Maybe look into Express's error handler?)

// Node constants
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;


// App Constants
const db = require("../../config/database.js");
const stmts = require("./statements.js");
const router = express.Router();
const caller = require("../util/mysql.js");

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

router.route("")
	.get(async (req, res) => {
		const name = req.query.name,
			query = (name === undefined) ? stmts.getUsers : stmts.getUsersFiltered,
			args = (name === undefined) ? undefined : ["%" + name + "%"];
		caller.mySQLFetch(query, args)
			.then(data => {
				res.json(data.map(user => {
					delete user.password;
					delete user.email;
					delete user.wallet;
					return user;
				}));
			})
			.catch(error => {
				throw error;
			});
		console.log("200".yellow, "GET /users".bold, ": ", "OK".bold.green);
	})
	.put((async (req, res) => {
		//TODO: Fix the error handling and let Validator do most of the work!
		let hash = await bcrypt.hash(req.body.password, saltRounds)
			.then(result => {
				return result;
			})
			.catch(err => {
				console.log("500".bold.red, "PUT /users".bold.white.bgRed, `The password was not able to be encrypted: ${err}`.bold.white.bg);
				res.status(500).send("Internal server error");
			});
		const query = stmts.addUser, args = [req.body.username, req.body.email, hash];
		caller.mySQLFetch(query, args)
			.then(data => {
				res.status(201).json({
					id: data.insertId,
					name: req.body.username
				});
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

router.route("/:ouid")
	.get((req, res) => {
		const query = stmts.getUser, args = [parseInt(req.params.ouid)];
		caller.mySQLFetch(query, args)
			.then(result => {
				(result.length === 0)
					? res.status(404).json({message: "Unable to find user"})
					: res.json({
						id: result[0].user_id,
						name: result[0].username,
						wallet: result[0].wallet,
						cards: result.map(card => {
							return {
								id: card.id,
								name: card.name,
								image: card.picture,
								description: card.description,
								cost: card.price,
								views: card.views,
								likes: card.likes
							};
						})
					});
			})
			.catch(err => {
				if (err) throw err;
			});
	})

//TODO: Mock doesn't have any authorization checks. Don't forget to implement this in DB Callback
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

router.route("/:ouid/cards")
	.get((req, res) => {
		const query = stmts.getUserCards, ouid = parseInt(req.params.ouid), args = [ouid];
		caller.mySQLFetch(query, args)
			.then(result => {
				if (result.length === 0) {
					userCheck(ouid).then((userNotExists) => {
						if (userNotExists) {
							res.status(404).json({message: "The user could not be found"});
						} else {
							res.json({
								userid: ouid,
								count: result.length,
								cards: []
							});
						}
					}).catch((err) => {
						throw err;
					});
				} else {
					res.json({
						userid: ouid,
						count: result.length,
						cards: result.map(card => {
							return {
								id: card.id,
								name: card.name,
								image: card.picture,
								description: card.description,
								cost: card.price,
								views: card.views,
								likes: card.likes
							};
						})
					});
				}
			})
			.catch(err => {
				throw err;
			});

		function userCheck(userId) {
			return new Promise(((resolve, reject) => {
				caller.mySQLFetch(stmts.getUser, [userId])
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
