const express = require("express");
const router = express();
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

const { Product } = require("../../models/index");

const controller = {};

controller.upload = async (req, res) => {
	const product_id = req.params.product_id;

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

	const imageName = `${product_id}.${extension}`;

	image.mv(`src/public/img/products/${imageName}`, async (err) => {
		if (err) return res.status(500).json({ ok: false, err });
		await updateProduct(product_id, res, req, imageName);
	});
};

async function updateProduct(id, res, req, imageName) {
	const product = await Product.findById(id);

	if (!product) {
		deleteFile(imageName);
		return res.status(400).json({
			ok: false,
			err: { message: "El producto no existe" },
		});
	}

	const params = { photo_url: imageName };

	await Product.update(id, params);

	req.flash("success", "Foto actualizada correctamente");
	res.redirect("/moderator/products");
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

module.exports = controller;
