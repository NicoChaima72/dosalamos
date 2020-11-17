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
 *  * MONGO CONNECTION * */

let urlDB;
if (process.env.NODE_ENV === "dev") {
	urlDB = "mongodb://127.0.0.1:27017/huertita";
} else {
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
