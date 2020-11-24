const pool = require("../database");

const model = {};

model.create = async (order) => {
	const result = await pool.query("INSERT INTO orders SET ?", [order]);

	return result;
};

model.find = async () => {
	const orders = await pool.query(
		"SELECT id, user_id, name, lastname, email, phone, direction, state, products, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') as updated_at  FROM orders"
	);

	return orders;
};

model.findById = async (order_id) => {
	const order = await pool.query(
		"SELECT id, user_id, name, lastname, email, phone, direction, state, products, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') as updated_at  FROM orders WHERE id = ?",
		[order_id]
	);

	return order.length > 0 ? order[0] : null;
};

model.update = async (id, params) => {
	const result = await pool.query("UPDATE orders SET ? WHERE id = ?", [
		params,
		id,
	]);

	return result;
};

module.exports = model;
