const { User } = require("../../models/index");
const bcrypt = require("../../helpers/auth");

const controller = {};

controller.index = async (req, res) => {
	const users = await User.findByRole("USER_ROLE");
	const moderators = await User.findByRole("MODERATOR_ROLE");

	res.render("admin/users/list.html", {
		title: "Lista usuarios",
		file: "admin.users",
		users,
		moderators,
	});
};

controller.create = async (req, res) => {
	res.render("admin/users/create.html", {
		title: "Agregar usuario",
		file: "admin.users",
	});
};

controller.store = async (req, res) => {
	const { name, username, password, password_confirm } = req.body;
	const errors = [];
	const email = `${username}@dosalamos.com`;
	const emailUser = await User.findByEmail(email);

	if (emailUser) {
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

	await User.create(newUser);
	req.flash("success", "Moderador creado correctamente");
	return res.redirect("/admin/users");
};

controller.destroy = async (req, res) => {
	const user_id = req.params.user_id;
	await User.update(user_id, { state: 0 });
	req.flash("success", "Usuario dado de baja");
	return res.redirect("/admin/users");
};
module.exports = controller;
