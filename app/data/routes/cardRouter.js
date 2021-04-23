// Node constants
const express = require("express");

// App Constants
const mySQL = require("../util/mysql.js");
const stmts = require("../statements");
const cardRouter = express.Router();
const {LogicError} = require("../../errors/error");

cardRouter.get("", (req, res, next) => {
	const query = chooseQuery(req), args = constructArgs(req);
	mySQL.fetch(query, args)
		.then(data =>{
			(data.length === 0)
				? next(new LogicError(404, (query === stmts.getCardsByName) ? "Name not found" : "Id not found"))
				: res.json(data);
		})
		.catch(() => next(new LogicError(500, "Internal Server Error")));
	
	function chooseQuery(params){
		if(params.query.id !== undefined){
			return stmts.getCardById;
		} else if(params.query.name !== undefined){
			return stmts.getCardsByName;
		}
		return stmts.getCards;
	}
	function constructArgs(params) {
		if(params.query.id !== undefined){
			return [params.query.id];
		} else if(params.query.name !== undefined){
			return [`%${params.query.name}%`];
		}
		return [];
	}
});

module.exports = cardRouter;