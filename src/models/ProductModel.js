const pool = require("../database");

const model = {};

model.create = async (product) => {
	const result = await pool.query("INSERT INTO products SET ?", [product]);

	return result;
};

model.find = async () => {
	const products = await pool.query(
		"SELECT * FROM products WHERE state = 1 AND stock != 0"
	);
	return products;
};

model.findById = async (id) => {
	const product = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
	return product.length > 0 ? product[0] : null;
};

model.findLatests = async () => {
	const products = await pool.query(
		"SELECT * FROM products WHERE state = 1 AND stock != 0 LIMIT 6"
	);
	return products;
};

model.findByOrder = async (products_id) => {
	const products = await pool.query("SELECT * FROM products WHERE id IN (?)", [
		products_id,
	]);
	return products;
};

model.search = async (name) => {
	const products = await pool.query(
		"SELECT * FROM products WHERE name LIKE ? WHERE state = 1 AND stock != 0",
		[`%${name}%`]
	);

	return products;
};

model.update = async (id, params) => {
	const result = await pool.query("UPDATE products SET ? WHERE id = ?", [
		params,
		id,
	]);

	return result;
};

module.exports = model;
