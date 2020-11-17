const passport = require("passport");
const LocalStrategy = require("passport-local");

const pool = require("../database");
const bcrypt = require("../config/bcrypt");

passport.use(
	"local.signin",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const rows = await pool.query("SELECT * FROM users WHERE email = ?", [
				email,
			]);
			if (rows.length > 0) {
				const user = rows[0];
				const validPassword = await bcrypt.comparePasswords(
					password,
					user.password
				);
				if (validPassword) done(null, user);
				else done(null, false, req.flash("error", "Contraseña incorrecta"));
			} else done(null, false, req.flash("error", "Email incorrecto"));
		}
	)
);

passport.use(
	"local.signup",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const user = { email, name: req.body.name };
			user.password = await bcrypt.encryptPassword(password);
			await pool.query("INSERT INTO users SET ?", [user]);
			done(null, user);
		}
	)
);

// si se loguea se almacena en sesion
passport.serializeUser((user, done) => {
	console.log("Serialize: ");
	console.log(user);
	done(null, user.email);
});

// utilizar los datos de la sesion
passport.deserializeUser(async (id, done) => {
	const user = await pool.query("SELECT * FROM users WHERE email = ?", [id]);
	done(null, user[0]);
});
