const express = require("express");
const http = require("http");
const app = express();
const keys = {
	public: "BDGmrSPc8AJiNltRioP-y_GhfH-g0-q_FBw2MK7j3J4S4U74lMFVEcDs60eWLZcLzQd2JeGR7GgU2mM6RSN6no0",
	private: "kPuFDZKbpLZv4Nu5L_pWACte9GjB8Kv6xKB6YN8ZgIc"
};

module.exports = {
	app : app,
	server : http.createServer(app),
	express : express,
	port: 8888,
	swaggerOptions : {explorer: true},
	keys: keys,
};