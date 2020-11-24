module.exports = {
	pages: {
		pages: require("./pagesController"),
		products: require("./productsController"),
		cart: require("./cartController"),
	},
	auth: require("./authController"),
	admin: {
		pages: require("./admin/pagesController"),
		users: require("./admin/usersController"),
	},
	moderator: {
		pages: require("./moderator/pagesController"),
		products: require("./moderator/productsController"),
		upload: require("./moderator/uploadController"),
		orders: require("./moderator/ordersController"),
	},
};
