const express = require("express");
const pool = require("../../database");
const router = express.Router();
const moment = require("moment");

const { isAuthenticated, isNotUser } = require("../../helpers/auth");

router.get(
	"/admin/contacts",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		const contacts = await pool.query("SELECT * FROM contacts");
		contacts.forEach((contact) => {
			contact.date = moment(contact.date).format("DD-MM-YY   hh:mm:ss");
		});

		res.render("admin/contact/list.html", {
			title: "Lista pedidos",
			file: "admin.contacts",
			orders: contacts,
		});
	}
);

router.put(
	"/admin/contacts/:id",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		const id = req.params.id;

		await pool.query("UPDATE contacts SET state = 1 WHERE id = ?", [id]);

		req.flash("success", "Pedido actualizado correctamente");
		res.redirect("/admin/contacts");
	}
);

router.put(
	"/admin/contacts/:id/pending",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		const id = req.params.id;

		await pool.query("UPDATE contacts SET state = 0 WHERE id = ?", [id]);

		req.flash("success", "Pedido actualizado correctamente");
		res.redirect("/admin/contacts");
	}
);

router.delete(
	"/admin/contacts/:id",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		const id = req.params.id;

		await pool.query("DELETE FROM contacts WHERE id = ?", [id]);

		req.flash("success", "Pedido eliminado correctamente");
		res.redirect("/admin/contacts");
	}
);

module.exports = router;
