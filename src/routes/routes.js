const express = require("express");
const pool = require("../database");
const router = express.Router();

router.get("/", async (req, res) => {
	const lastProducts = await pool.query("SELECT * FROM products LIMIT 6");
	res.render("pages/home.html", {
		title: "Inicio",
		file: "home",
		lastProducts,
	});
});

router.get("/about", (req, res) => {
	res.render("pages/about.html", { title: "Nosotros", file: "about" });
});

module.exports = router;
