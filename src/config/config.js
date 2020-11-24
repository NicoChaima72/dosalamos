/**
 * * PORT * */

process.env.PORT = process.env.PORT || 3000;

/**
 * *  ENV * */

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * * HOSTNAME * */

process.env.HOSTNAME =
	process.env.HOSTNAME || `http://localhost:${process.env.PORT}`;

/**
 *  * DATABASE * */

if (process.env.NODE_ENV === "dev") {
	process.env.DB_HOST = "localhost";
	process.env.DB_USER = "root";
	process.env.DB_PASSWORD = "";
	process.env.DB_DATABASE = "dosalamos";
} else {
	process.env.DB_HOST = process.env.DB_HOST;
	process.env.DB_USER = process.env.DB_USER;
	process.env.DB_PASSWORD = process.env.DB_PASSWORD;
	process.env.DB_DATABASE = process.env.DB_DATABASE;
}
