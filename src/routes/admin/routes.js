const express = require("express");
const router = express.Router();

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin", [isAuthenticated, isAdmin], async (req, res) => {
	// const userCount = await User.countDocuments({});
	// const productCount = await Product.countDocuments({});
	// const contactCount = await Contact.countDocuments({});
	// const contactPending = await Contact.countDocuments({ state: 0 });
	// const lastContacts = await Contact.find({}).limit(6).exec();

	res.render("admin/dashboard.html", {
		title: "Dashboard",
		file: "admin.home",
		// userCount,
		// productCount,
		// contactCount,
		// contactPending,
		// lastContacts,
	});
});

module.exports = router;
