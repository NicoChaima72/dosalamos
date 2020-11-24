const express = require("express");
const pool = require("../database");
const router = express.Router();

const {
	isAuthenticated,
	isNotAuthenticated,
	isAdmin,
	isModerator,
	isUser,
} = require("../middlewares/auth");

const { pages, auth, admin, moderator } = require("../controllers/index");

module.exports = (app) => {
	router.get("/", pages.pages.home);
	router.get("/products", pages.products.index);
	router.get("/products/search", pages.products.search);
	router.get("/products/:product_id", pages.products.show);
	router.post(
		"/products/:product_id/add-cart",
		[isAuthenticated, isUser],
		pages.cart.store
	);
	router.get("/about", pages.pages.about);
	router.get("/cart", [isAuthenticated, isUser], pages.cart.index);
	router.post("/cart", [isAuthenticated, isUser], pages.cart.shop);
	router.get(
		"/cart/:product_id/delete",
		[isAuthenticated, isUser],
		pages.cart.remove
	);

	router.get("/login", [isNotAuthenticated], auth.showLogin);
	router.post("/login", [isNotAuthenticated], auth.login);
	router.get("/register", [isNotAuthenticated], auth.showRegister);
	router.post("/register", [isNotAuthenticated], auth.register);
	router.post("/logout", [isNotAuthenticated], auth.logout);

	router.get("/admin", [isAuthenticated, isAdmin], admin.pages.home);
	router.get("/admin/users", [isAuthenticated, isAdmin], admin.users.index);
	router.get(
		"/admin/users/create",
		[isAuthenticated, isAdmin],
		admin.users.create
	);
	router.post("/admin/users", [isAuthenticated, isAdmin], admin.users.store);
	router.delete(
		"/admin/users/:user_id",
		[isAuthenticated, isAdmin],
		admin.users.destroy
	);

	router.get(
		"/moderator",
		[isAuthenticated, isModerator],
		moderator.pages.home
	);
	router.get(
		"/moderator/products",
		[isAuthenticated, isModerator],
		moderator.products.index
	);
	router.get(
		"/moderator/products/create",
		[isAuthenticated, isModerator],
		moderator.products.create
	);
	router.post(
		"/moderator/products",
		[isAuthenticated, isModerator],
		moderator.products.store
	);
	router.get(
		"/moderator/products/:product_id/edit",
		[isAuthenticated, isModerator],
		moderator.products.edit
	);
	router.put(
		"/moderator/products/:product_id",
		[isAuthenticated, isModerator],
		moderator.products.update
	);
	router.put(
		"/moderator/products/:product_id/stock",
		[isAuthenticated, isModerator],
		moderator.products.stock
	);
	router.delete(
		"/moderator/products/:product_id",
		[isAuthenticated, isModerator],
		moderator.products.destroy
	);

	router.post(
		"/moderator/upload/:product_id",
		[isAuthenticated, isModerator],
		moderator.upload.upload
	);

	router.get(
		"/moderator/orders",
		[isAuthenticated, isModerator],
		moderator.orders.index
	);
	router.get(
		"/moderator/orders/:order_id",
		[isAuthenticated, isModerator],
		moderator.orders.show
	);
	router.put(
		"/moderator/orders/:order_id",
		[isAuthenticated, isModerator],
		moderator.orders.update
	);

	app.use(router);
};
