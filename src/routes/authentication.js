const express = require("express");
const router = express.Router();
const passport = require("passport");
const uniqueId = require("uniqid");
const pool = require("../database");
const bcrypt = require("../config/bcrypt");

router.get("/login", (req, res) => {
	res.render("auth/login.html", { title: "Login", file: "login" });
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local.signin", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res, next);
});

router.get("/register", (req, res) => {
	res.render("auth/register.html", { title: "Registrarse", file: "register" });
});

router.post("/register", async (req, res) => {
	const { name, email, password, password_confirm } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (password != password_confirm) {
		errors.push({ text: "Las contraseñas no coinciden" });
	}

	if (password.length < 8) {
		errors.push({ text: "La contraseña debe tener minimo 8 caracteres" });
	}

	if (errors.length > 0) {
		// res.status(404).json({ ok: false, errors });
		req.flash("error_msg", errors);
		req.flash("data", { name, email });
		return res.redirect("/register");
	}

	const emailUser = await pool.query("SELECT * FROM users WHERE email = ?", [
		email,
	]);
	console.log(emailUser);
	if (emailUser.length > 0) {
		req.flash("error", "El email ya está registrado");
		req.flash("data", { name, email });
		return res.redirect("/register");
	}
	const user = { name, email, password };
	user.password = await bcrypt.encryptPassword(password);
	await pool.query("INSERT INTO users SET ?", [user]);
	req.flash("success", "Te registraste correctamente");
	return res.redirect("/login");
});

router.post("/logout", (req, res) => {
	req.logOut();
	res.redirect("/");
});

router.get("/reset-password", (req, res) => {
	res.render("auth/reset-password.html", {
		title: "Resetear contraseña",
		file: "reset-password",
	});
});

router.post("/reset-password", async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email: email });
	if (!user) {
		req.flash("error", "El email no está registrado");
		req.flash("data", { email });
		res.redirect("/reset-password");
	}

	user.token = uniqueId();
	user.state = "2";
	await user.save();

	const redirectLink = `${process.env.HOSTNAME}/reset-password/${user._id}/${user.token}`;
	console.log(redirectLink);

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "nikochaima72@gmail.com",
			pass: "207229865",
		},
	});

	const mailOptions = {
		from: "<nikochaima72@gmail.com>",
		to: email,
		subject: "MI HUERTITA - Cambiar contraseña",
		text: `Accede a este link para cambiar tu contraseña: ${redirectLink}`,
		html: `<b>Accede a este link para cambiar tu contraseña: <a href='${redirectLink}'>${redirectLink}</a></b>`,
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			req.flash("error", "Ha ocurrido un error");
			req.flash("data", { email });
			res.redirect("/reset-password");
		}

		req.flash(
			"success",
			"Se ha enviado un link a tu email para cambiar la contraseña"
		);
		res.redirect("/login");
	});
});

router.get("/reset-password/:id/:token", async (req, res) => {
	const { id, token } = req.params;
	const user = await User.findById(id);

	if (!user) {
		req.flash("error", "Usuario no registrado");
		res.redirect("/login");
	}

	if (user.token != token || user.state != "2") {
		req.flash("error", "Link expirado");
		res.redirect("/login");
	}

	res.render("auth/new-password.html", {
		title: "Actualizar contraseña",
		file: "new-password",
		id,
		token,
	});
});

router.post("/reset-password/:id/:token", async (req, res) => {
	const { id, token } = req.params;
	const user = await User.findById(id);

	if (!user) {
		req.flash("error", "Usuario no registrado");
		res.redirect("/login");
	}

	if (user.token != token || user.state != "2") {
		req.flash("error", "Link expirado");
		res.redirect("/login");
	}

	const password = req.body.password;
	const passwordConfirm = req.body.password_confirm;
	const errors = [];

	if (password.length < 8)
		errors.push({ text: "La contraseña debe tener minimo 8 caracteres" });

	if (password !== passwordConfirm) {
		errors.push({ text: "Las contraseñas no coinciden" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { password, passwordConfirm });
		res.redirect(`/reset-password/${id}/${token}`);
	}

	user.password = await user.encryptPassword(password);
	user.state = "1";
	await user.save();

	req.flash("success", "Contraseña actualizada correctamente");
	res.redirect("/login");
});
module.exports = router;
