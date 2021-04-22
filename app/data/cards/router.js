// Node constants
const express = require("express");
const mysql = require("mysql");

// App Constants
const db = require("../../config/database.js");
const stmts = require("./statements.js");
const router = express.Router();

router.get("", (req, res) => {
	const name = req.query.name;
	const id = req.query.id;
	let query = stmts.getCards;
	let args= undefined;
	if(id !== undefined){
		query = stmts.getCardById;
		args = [id];
	} else if(name !== undefined){
		query = stmts.getCardsByName;
		args = [`%${name}%`];
	}
	const connection = mysql.createConnection(db.config);
	connection.connect((conErr) => {
		if(conErr) throw conErr;
		connection.query(query, args, (err, rows) => {
			if (err) throw err;
			if(rows.length === 0) {
				const msg = (query === stmts.getCardsByName) ? "Name not found" : "Id not found";
				console.log("404".red, "GET /cards".bold, ": ", msg);
				return res.status(404).json({
					message: msg
				});
			}
			res.json(rows);
			connection.end();
		});
	});
	console.log("200".yellow, "GET /cards".bold, ": ", "OK".bold.green);
});

module.exports = router;