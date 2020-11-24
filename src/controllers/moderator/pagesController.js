const controller = {};

controller.home = async (req, res) => {
	res.render("moderator/dashboard.html", {
		title: "Dashboard",
		file: "moderator.home",
	});
};

module.exports = controller;
