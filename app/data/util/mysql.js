const config = require("../../config/database.js");
const mysql = require("mysql");

exports.fetch = (query, args = []) => {
	return new Promise((resolve, reject) => {
		let connection = mysql.createConnection(config.config);
		return connection.connect((conErr) => {
			if (conErr) reject(conErr);
			return connection.query(query, args, (err, rows) => {
				if (err) reject(err);
				else{
					connection.end();
					resolve(rows);
				}
			});
		});
	});
};