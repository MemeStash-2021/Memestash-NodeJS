"use strict";

// Node constants
const express = require("express");

// App Constants
const chatRouter = express.Router();

chatRouter.route("/:ouid/chats")
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

chatRouter.route("/:ouid/chats/:tuid")
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

module.exports = chatRouter;