const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("pages/home.html", {
		title: "Inicio",
		file: "home",
	});
});

router.get("/about", (req, res) => {
	res.render("pages/about.html", { title: "Nosotros", file: "about" });
});

module.exports = router;
