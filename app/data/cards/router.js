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
			res.json(rows);
		});
	});
	console.log("200".yellow, "GET /cards".bold, ": ", "OK".bold.green);
});

module.exports = router;