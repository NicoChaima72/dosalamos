const passport = require("passport");
const LocalStrategy = require("passport-local");

const pool = require("../database");
const bcrypt = require("../helpers/auth");

const { User } = require("../models/index");

passport.use(
	"local.signin",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const user = await User.findByEmail(email);

			if (!user) {
				return done(
					null,
					false,
					req.flash("error", "Email y/o contraseña incorrecta")
				);
			}

			const validPassword = await bcrypt.comparePasswords(
				password,
				user.password
			);
			if (!validPassword) {
				return done(
					null,
					false,
					req.flash("error", "Email y/o contraseña incorrecta")
				);
			}

			if (user.state === 0) {
				return done(
					null,
					false,
					req.flash(
						"error",
						"Usuario dado de baja, comunicarse con soporte tecnico"
					)
				);
			}

			done(null, user);
		}
	)
);

// si se loguea se almacena en sesion
passport.serializeUser((user, done) => {
	done(null, user.email);
});

// utilizar los datos de la sesion
passport.deserializeUser(async (id, done) => {
	const user = await pool.query("SELECT * FROM users WHERE email = ?", [id]);
	done(null, user[0]);
});
