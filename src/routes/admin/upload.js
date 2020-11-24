const express = require("express");
const router = express();
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");
const pool = require("../../database");

router.use(fileUpload({}));

router.post(
	"/admin/upload/:id",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;

		if (!req.files)
			return res.status(400).json({
				ok: false,
				err: {
					message: "No se ha seleccionado un archivo",
				},
			});

		const image = req.files.image;
		const validExtensions = ["png", "jpg", "gif", "jpeg"];
		const cutName = image.name.split(".");
		const extension = cutName[cutName.length - 1];

		if (!validExtensions.includes(extension))
			return res.status(400).json({
				ok: false,
				err: {
					message: "Las extensiones validas son: " + validExtensions.join(", "),
				},
				ext: extension,
			});

		const imageName = `${id}.${extension}`;

		image.mv(`src/public/img/products/${imageName}`, async (err) => {
			if (err) return res.status(500).json({ ok: false, err });
			await updateProduct(id, res, req, imageName);
		});
	}
);

router.get(
	"/admin/upload/:id/delete",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;

		const product = await pool.query("SELECT * FROM products WHERE id = ?", [
			id,
		]);
		product ? product[0] : null;
		await pool.query("DELETE FROM products WHERE id = ?", [id]);

		deleteFile(product.photo_url);
		req.flash("success", "Producto eliminado correctamente");
		res.redirect("/admin/products");
	}
);

async function updateProduct(id, res, req, imageName) {
	const product = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
	product ? product[0] : null;

	if (!product) {
		deleteFile(imageName);
		return res.status(400).json({
			ok: false,
			err: { message: "El producto no existe" },
		});
	}

	await pool.query("UPDATE products SET photo_url = ? WHERE id = ?", [
		imageName,
		id,
	]);

	req.flash("success", "Foto actualizada correctamente");
	res.redirect("/admin/products");
}

function deleteFile(fileName) {
	const pathFile = path.resolve(
		__dirname,
		`../../public/img/products/${fileName}`
	);
	if (fs.existsSync(pathFile)) {
		fs.unlinkSync(pathFile);
	}
}

module.exports = router;
