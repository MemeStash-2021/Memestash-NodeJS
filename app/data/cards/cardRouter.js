// Node constants
const express = require("express");

// App Constants
const mySQL = require("../util/mysql.js");
const stmts = require("./statements.js");
const cardRouter = express.Router();
const log = require("../util/logger");
const {HTTPError} = require("../../errors/error");

cardRouter.get("", (req, res, next) => {
	const query = chooseQuery(req), args = constructArgs(req);
	mySQL.fetch(query, args)
		.then(data =>{
			if(data.length === 0) {
				next(new HTTPError(404, (query === stmts.getCardsByName) ? "Name not found" : "Id not found"));
			}
			else{
				log.log200(req);
				res.json(data);
			}
		})
		.catch(() => next(new HTTPError(500, "Internal Server Error")));
	
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