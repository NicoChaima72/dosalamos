const pool = require("../database");

const model = {};

model.create = async (cart) => {
	const result = await pool.query("INSERT INTO carts SET ?", [cart]);

	return result;
};

model.findByUser = async (user_id) => {
	const products = await pool.query(
		"SELECT p.id, p.name, p.description, p.price, p.stock, p.state, p.photo_url FROM carts c INNER JOIN products p ON c.product_id = p.id WHERE c.user_id = ?",
		[user_id]
	);
	return products;
};

model.findProductByUser = async (product_id, user_id) => {
	const product = await pool.query(
		"SELECT * FROM carts WHERE product_id = ? AND user_id = ?",
		[product_id, user_id]
	);

	return product.length > 0 ? product[0] : null;
};

model.deleteProduct = async (product_id, user_id) => {
	const result = await pool.query(
		"DELETE FROM carts WHERE product_id = ? AND user_id = ?",
		[product_id, user_id]
	);

	return result;
};

model.deleteByUser = async (user_id) => {
	const result = await pool.query("DELETE FROM carts WHERE user_id = ?", [
		user_id,
	]);

	return result;
};

module.exports = model;
