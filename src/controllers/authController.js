require("../config/passport");

const { User } = require("../models/index");
const passport = require("passport");
const bcrypt = require("../helpers/auth");

const controller = {};

controller.showLogin = async (req, res) => {
	res.render("auth/login.html", { title: "Login", file: "login" });
};

controller.login = async (req, res, next) => {
	passport.authenticate("local.signin", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res, next);
};

controller.showRegister = async (req, res) => {
	res.render("auth/register.html", {
		title: "Registrarse",
		file: "register",
	});
};

controller.register = async (req, res) => {
	const { name, email, password, password_confirm } = req.body;
	const errors = [];
	const emailUser = await User.findByEmail(email);

	if (emailUser) {
		errors.push({ text: "El email ya está registrado" });
	}

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

	const user = { name, email, password };
	user.password = await bcrypt.encryptPassword(password);

	await User.create(user);
	req.flash("success", "Te registraste correctamente, inicia sesion");
	return res.redirect("/login");
};

controller.logout = async (req, res) => {
	req.logOut();
	res.redirect("/");
};

module.exports = controller;
