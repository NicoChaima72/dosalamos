const express = require("express");
const bcrypt = require("../../config/bcrypt");
const router = express.Router();
const pool = require("../../database");

const { isAuthenticated, isNotUser } = require("../../helpers/auth");

router.get("/admin/users", [isAuthenticated, isNotUser], async (req, res) => {
	const users = await pool.query("SELECT * FROM users");

	res.render("admin/user/list.html", {
		title: "Lista usuarios",
		file: "admin.users",
		users: users.filter((user) => user.role == "USER_ROLE"),
		moderators: users.filter((user) => user.role == "MODERATOR_ROLE"),
	});
});

router.get(
	"/admin/users/create",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		res.render("admin/user/create.html", {
			title: "Agregar usuario",
			file: "admin.users",
		});
	}
);

router.post("/admin/users", [isAuthenticated, isNotUser], async (req, res) => {
	const { name, username, password, password_confirm } = req.body;
	const errors = [];

	const email = `${username}@dosalamos.com`;
	const emailUser = await pool.query("SELECT * FROM users WHERE email = ?", [
		email,
	]);

	if (emailUser.length > 0) {
		errors.push({ text: "El email ya está registrado" });
	}

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (password.length < 8) {
		errors.push({ text: "Contraseña de minimo 8 caracteres" });
	}

	if (password !== password_confirm) {
		errors.push({ text: "Las contraseñas no coinciden" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, username, password, password_confirm });
		return res.redirect("/admin/users/create");
	}

	const newUser = { name, email, password, role: "MODERATOR_ROLE" };
	newUser.password = await bcrypt.encryptPassword(password);

	await pool.query("INSERT INTO users SET ?", [newUser]);
	req.flash("success", "Usuario creado correctamente");
	return res.redirect("/admin/users");
});

router.delete(
	"/admin/users/:id",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		const id = req.params.id;

		await pool.query("DELETE FROM users WHERE id = ?", [id]);
		req.flash("success", "Usuario eliminado correctamente");
		res.redirect("/admin/users");
	}
);

module.exports = router;
