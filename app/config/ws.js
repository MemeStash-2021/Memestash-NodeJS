const express = require("express");
const http = require("http");
const app = express();

module.exports = {
	app : app,
	server : http.createServer(app),
	express : express,
	port: 8888
};