// const { Product } = require("../../models/index");

const controller = {};

controller.home = async (req, res) => {
	res.render("admin/dashboard.html", {
		title: "Dashboard",
		file: "admin.home",
		// userCount: userCount[0].count,
		// productCount: productCount[0].count,
		// contactCount: contactCount[0].count,
		// contactPending: contactPending[0].count,
		// lastContacts,
	});
};

module.exports = controller;
