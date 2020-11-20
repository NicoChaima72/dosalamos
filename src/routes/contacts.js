const moment = require("moment");
const express = require("express");
const router = express.Router();

const { isAuthenticated, isAdmin, isUser } = require("../helpers/auth");
const pool = require("../database");

router.get("/contact", [isAuthenticated, isUser], (req, res) => {
	res.render("pages/contact.html", { title: "Contacto", file: "contact" });
});

router.post("/contact", async (req, res) => {
	const { name, lastname, phone, message } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}
	if (lastname.length === 0) {
		errors.push({ text: "El apellido es requerido" });
	}
	if (phone.length === 0) {
		errors.push({ text: "El telefono es requerido" });
	}
	if (message.length === 0) {
		errors.push({ text: "El mensaje es requerido" });
	}

	const email = req.user.email;

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, lastname, phone, message });
		res.redirect("/contact");
	}

	const newContact = { name, lastname, email, phone, message };
	await pool.query("INSERT INTO contacts SET ?", [newContact]);

	req.flash("success", "Mensaje enviado correctamente");
	res.redirect("/contact");
});

module.exports = router;
