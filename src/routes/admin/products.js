const express = require("express");
const pool = require("../../database");
const router = express.Router();

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/products", [isAuthenticated, isAdmin], async (req, res) => {
	const products = await pool.query("SELECT * FROM products");

	res.render("admin/product/list.html", {
		title: "Lista productos",
		file: "admin.products",
		products: products,
	});
});

router.get(
	"/admin/products/create",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		res.render("admin/product/create.html", {
			title: "Agregar producto",
			file: "admin.products",
		});
	}
);

router.post("/admin/products", [isAuthenticated, isAdmin], async (req, res) => {
	const { name, description, price } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}
	if (description.length === 0) {
		errors.push({ text: "La descripcion es requerida" });
	}
	if (price.length === 0) {
		errors.push({ text: "El precio es requerido" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, description, price });
		res.redirect("/admin/products/create");
	}

	const newProduct = { name, description, price };
	await pool.query("INSERT INTO products SET ?", [newProduct]);

	req.flash("success", "Producto agregado correctamente");
	res.redirect("/admin/products");
});

router.get(
	"/admin/products/:id",
	[isAuthenticated, isAdmin],
	async (req, res) => {}
);

router.get(
	"/admin/products/:id/edit",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;
		const product = await pool.query("SELECT * FROM products WHERE id = ?", [
			id,
		]);
		res.render("admin/product/edit.html", {
			title: "Editar producto",
			file: "admin.products",
			product: product[0],
		});
	}
);

router.put(
	"/admin/products/:id",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;
		const { name, description, price } = req.body;
		const errors = [];

		if (name.length === 0) {
			errors.push({ text: "El nombre es requerido" });
		}
		if (description.length === 0) {
			errors.push({ text: "La descripcion es requerida" });
		}
		if (price.length === 0) {
			errors.push({ text: "El precio es requerido" });
		}

		if (errors.length > 0) {
			req.flash("error_msg", errors);
			req.flash("data", { name, description, price });
			res.redirect(`/admin/products/${id}/edit`);
		}

		product = { name, description, price };
		await pool.query("UPDATE products SET ? WHERE id = ?", [product, id]);
		req.flash("success", "Producto actualizado correctamente");
		res.redirect("/admin/products");
	}
);

router.delete("/admin/products/:id", [isAuthenticated, isAdmin], (req, res) => {
	const id = req.params.id;

	return res.redirect(`/admin/upload/${id}/delete`);
});

module.exports = router;
