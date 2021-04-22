const config = require("app/config/database.js");
const mysql = require("mysql");

async function mySQLFetch(query, args = []) {
	let connection = mysql.createConnection(config.config);
	return connection.connect((conErr) => {
		if (conErr) throw conErr;
		return connection.query(query, args, (err, rows) => {
			if (err) throw err;
			else{
				connection.end();
				return rows;
			}
		});
	});
}

module.exports = mySQLFetch();