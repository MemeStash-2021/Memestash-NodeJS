"use strict";

// Node constants
const express = require("express");

// App Constants
const stmts = require("../statements");
const router = express.Router();
const mySQL = require("../util/mysql.js");
const wrapper = require("../util/wrappers.js");
const {LogicError} = require("../../errors/error");


router.route("/:ouid/cards")
	.get((req, res, next) => {
		const query = stmts.getUserCards, ouid = parseInt(req.params.ouid), args = [ouid];
		mySQL.execute(query, args)
			.then(result => {
				(result.length === 0)
					? userCheck(ouid).then(userNotExists => {
						(userNotExists)
							? next(new LogicError(404, "User cannot be found"))
							: res.json(wrapper.userCards(ouid, result, true));
					})
					: res.json(wrapper.userCards(ouid, result));
			})
			.catch(()=>next(new LogicError(500, "Internal Server Error")));

		function userCheck(userId) {
			return new Promise(((resolve, reject) => {
				mySQL.execute(stmts.getUser, [userId])
					.then(data => resolve(data.length === 0))
					.catch(err => reject(err));
			}));
		}
	})
;

//TODO: No checks implemented. Do this when creating the DB Callback
router.route("/:ouid/cards/:cid")
	.put(async (req, res, next) => {
		const ouid = parseInt(req.params.ouid), cid = parseInt(req.params.cid);
		const user = await GetUser(ouid), card = await GetCard(cid);
		if (card.price > user.wallet){
			return next(new LogicError(403, "The card's proce is highter that the amount of coins the user has."));
		}
		mySQL.execute(stmts.updateWallet, [(user.wallet - card.price), ouid])
			.catch(()=>new LogicError(500, "Internal Server Error"));
		mySQL.execute(stmts.insertCard, [ouid, cid])
			.catch(()=>new LogicError(500, "Internal Server Error"));
		mySQL.execute(stmts.getUserCards, [ouid])
			.then(result =>{
				(result.length === 0)
					? next(new LogicError(404, "User cannot be found"))
					: res.json(wrapper.userCards(ouid, result));
			});

		function GetUser(userid){
			return mySQL.execute(stmts.getSimpleUser, [userid])
				.then(result => {
					let data;
					(result.length === 0)
						? next(new LogicError(404, "User cannot be found"))
						: data = result[0];
					return data;
				})
				.catch(()=>next(new LogicError(500, "Internal Server Error")));
		}

		function GetCard(cardId){
			return mySQL.execute(stmts.getCardById, [cardId])
				.then(result => {
					let data;
					(result.length === 0)
						? next(new LogicError(404, "User cannot be found"))
						: data = result[0];
					return data;
				})
				.catch(()=>next(new LogicError(500, "Internal Server Error")));
		}
	});

module.exports = router;