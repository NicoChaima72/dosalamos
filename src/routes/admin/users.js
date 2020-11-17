const express = require("express");
const router = express.Router();
const pool = require("../../database");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/users", [isAuthenticated, isAdmin], async (req, res) => {
	const users = await pool.query("SELECT * FROM users WHERE role='USER_ROLE'");

	res.render("admin/user/list.html", {
		title: "Lista usuarios",
		file: "admin.users",
		users: users,
	});
});

router.delete(
	"/admin/users/:id",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;

		await pool.query("DELETE FROM users WHERE id = ?", [id]);
		req.flash("success", "Usuario eliminado correctamente");
		res.redirect("/admin/users");
	}
);

module.exports = router;
