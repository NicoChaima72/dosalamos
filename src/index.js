const express = require("express");
const server = require("./server/server");

const app = server(express());

app.listen(app.get("port"), () => {
	console.log(`Server on port ${app.get("port")}`);
});
