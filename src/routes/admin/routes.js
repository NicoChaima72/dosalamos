const express = require("express");
const pool = require("../../database");
const router = express.Router();
const moment = require("moment");

const { isAuthenticated, isAdmin, isNotUser } = require("../../helpers/auth");

router.get("/admin", [isAuthenticated, isNotUser], async (req, res) => {
	const userCount = await pool.query(
		"SELECT COUNT(*) as count FROM users WHERE role='USER_ROLE'"
	);
	const productCount = await pool.query(
		"SELECT COUNT(*) as count FROM products"
	);
	const contactCount = await pool.query(
		"SELECT COUNT(*) as count FROM contacts"
	);
	const contactPending = await pool.query(
		"SELECT COUNT(*) as count FROM contacts WHERE state=0"
	);
	const lastContacts = await pool.query("SELECT * FROM contacts LIMIT 6");
	lastContacts.forEach((contact) => {
		contact.date = moment(contact.date).format("DD-MM-YY   hh:mm:ss");
	});

	res.render("admin/dashboard.html", {
		title: "Dashboard",
		file: "admin.home",
		userCount: userCount[0].count,
		productCount: productCount[0].count,
		contactCount: contactCount[0].count,
		contactPending: contactPending[0].count,
		lastContacts,
	});
});

module.exports = router;
