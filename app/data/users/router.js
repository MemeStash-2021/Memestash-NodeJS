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

// Data Constants
const mock = require("../../mock.js"); // TODO: Remove this once all callbacks use database callback.

router.route("")
	.get((req, res) => {
		const name = req.query.name, connection = mysql.createConnection(db.config),
			query = (name === undefined) ? stmts.getUsers : stmts.getUsersFiltered;
		connection.connect((conErr) => {
			if (conErr) throw conErr;
			connection.query(query, (name === undefined) ? undefined : "%" + name + "%", (err, rows) => {
				if (err) throw err;
				res.json(rows.map(user => {
					delete user.password;
					delete user.email;
					delete user.wallet;
					return user;
				}));
				console.log("200".yellow, "GET /users".bold, ": ", "OK".bold.green);
				connection.end();
			});
		});
	})
	.put(((req, res) => {
		const connection = mysql.createConnection(db.config), name = req.body.username, email = req.body.email,
			query = stmts.addUser;
		connection.connect((conErr) => {
			if (conErr) throw conErr;
			bcrypt.hash(req.body.password, saltRounds).then(hash => {
				connection.query(query, [name, email, hash], (err, rows) => {
					//TODO: Fix the error handling and let Validator do most of the work!
					if (err) {
						if (err.errno === 1062) {
							console.log("409".bold.red, "PUT /users".bold, ": ", "Username was already taken");
							res.status(409).send("This user already exists");
						} else {
							throw err;
						}
						connection.end();
					} else {
						res.status(201).json({
							id: rows.insertId,
							name: name
						});
						console.log("201".yellow, "PUT /users".bold, ": ", "Created".bold.green);
						connection.end();
					}
				});
			}).catch(err => {
				console.log("500".bold.red, "PUT /users".bold.white.bgRed, `The password was not able to be encrypted: ${err}`.bold.white.bg);
				res.status(500).send("Internal server error");
			});
		});
	}));

router.route("/:ouid")
	.get((req, res) => {
		const ouid = parseInt(req.params.ouid), query = stmts.getUser, connection = mysql.createConnection(db.config);
		connection.connect((conErr) => {
			if (conErr) throw conErr;
			connection.query(query, [ouid], (err, rows) => {
				if (err) throw err;
				if (rows.length === 0) return res.status(404).json({message: "Unable to find user"});
				res.json({
					id: rows[0].user_id,
					name: rows[0].username,
					wallet: rows[0].wallet,
					cards: rows.map(result => {
						return {
							id: result.id,
							name: result.name,
							image: result.picture,
							description: result.description,
							cost: result.price
						};
					})
				});
				console.log("200".yellow, `GET /users/${ouid}`.bold, ": ", "OK".bold.green);
				connection.end();
			});
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
		const ouid = parseInt(req.params.ouid), connection = mysql.createConnection(db.config);
		connection.connect((conErr) => {
			if (conErr) throw conErr;
			connection.query(stmts.getUserCards, [ouid], (err, rows) => {
				if (rows.length === 0) {
					connection.end();
					userCheck(ouid).then((userNotExists) => {
						if (userNotExists) {
							res.status(404).json({message: "The user could not be found"});
						} else {
							res.json({
								userid: ouid,
								count: rows.length,
								cards: []
							});
						}
					}).catch((err) => {
						throw err;
					});
				} else {
					res.json({
						userid: ouid,
						count: rows.length,
						cards: rows.map(result => {
							return {
								id: result.id,
								name: result.name,
								image: result.picture,
								description: result.description,
								cost: result.price
							};
						})
					});
					connection.end();
				}
			});
		});

		function userCheck(userId) {
			return new Promise(((resolve, reject) => {
				const checkConnection = mysql.createConnection(db.config);
				checkConnection.connect((err) => {
					if (err) reject(err);
					checkConnection.query(stmts.getUser, [userId], (checkErr, checkRows) => {
						if (checkErr) reject(checkErr);
						resolve(checkRows.length === 0);
					});
				});
			}));
		}
	});

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
			name : mock.users[0].username,
			wallet: 80000,
			cards: mock.cards()
		});
		console.log("200".yellow, `GET /users/${ouid}/wallet`.bold, ": ", "OK".bold.green);
	}));

router.route("/:ouid/chats")
	.get(((req, res) => {
		let json = [];
		for(let i = 0; i<5; i++){
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

module.exports = router;
