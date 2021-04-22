// Node constants
const express = require("express");

// App Constants
const mySQL = require("../util/mysql.js");
const stmts = require("./statements.js");
const cardRouter = express.Router();

cardRouter.get("", (req, res) => {
	const query = chooseQuery(req), args = constructArgs(req);
	mySQL.fetch(query, args)
		.then(data =>{
			if(data.length === 0) {
				const msg = (query === stmts.getCardsByName) ? "Name not found" : "Id not found";
				console.log("404".red, "GET /cards".bold, ": ", msg);
				res.status(404).json({message: msg});
			}
			else{
				console.log("200".yellow, "GET /cards".bold, ": ", "OK".bold.green);
				res.json(data);
			}
		})
		.catch(err => {
			throw err;
		});
	
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