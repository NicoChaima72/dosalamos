const express = require("express");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const flash = require("connect-flash");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const mysqlSession = require("express-mysql-session");

// initializations
const app = express();
require("./config/config");
const { database } = require("./keys");
require("./database");
require("./config/passport");

// settings
app.set("port", process.env.PORT);
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
	session({
		cookie: { maxAge: 86400000 },
		store: mysqlSession(database),
		secret: "session_secret",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null;
	res.locals.data = req.flash("data");
	if (res.locals.data.length > 0) res.locals.data = res.locals.data[0];
	next();
});

// routes
app.use(require("./routes/routes"));
app.use(require("./routes/authentication"));
app.use(require("./routes/products"));
app.use(require("./routes/contacts"));
app.use(require("./routes/admin/routes"));
app.use(require("./routes/admin/products"));
app.use(require("./routes/admin/contacts"));
app.use(require("./routes/admin/users"));
app.use(require("./routes/admin/upload"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// listen server
app.listen(app.get("port"), () => {
	console.log("Server run in port ", app.get("port"));
});
