require("./config/config");

const mysql = require("mysql");

const { promisify } = require("util");
const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
	if (err) {
		console.log(err);
		throw err;
	}

	if (connection) connection.release();

	console.log("DB is connected!");
});

pool.query = promisify(pool.query);

module.exports = pool;
