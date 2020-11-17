const express = require("express");
const router = express.Router();
const User = require("../../models/User");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/users", [isAuthenticated, isAdmin], async (req, res) => {
	const users = await User.find();

	res.render("admin/user/list.html", {
		title: "Lista usuarios",
		file: "admin.users",
		users: users,
	});
});

router.delete("/admin/users/:id", [isAuthenticated, isAdmin], (req, res) => {
	const id = req.params.id;

	User.findByIdAndRemove(id, (err, user) => {
		if (err) return res.status(400).json({ ok: false, err });

		if (user === null)
			return res.status(400).json({
				ok: false,
				err: { message: "Id no encontrado" },
			});

		req.flash("success_msg", "Usuario eliminado correctamente");
		res.redirect("/admin/users");
	});
});

module.exports = router;
