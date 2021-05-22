const express = require("express");
const http = require("http");
const app = express();

module.exports = {
	app : app,
	server : http.createServer(app),
	express : express,
	port: 8888,
	swaggerOptions : {explorer: true},
	push: {
		publicKey: "BDTGaeBwOQkC537SU2D--mhCjNJA15XNei9To_YcSX0SCZy5_kf7bXUSGXCBtQlzkFMo1kSCrDHMD6vh98kdWDA",
		privateKey: "oitDsoJoUk8MQ_ALX6pft_m8wcwWxgC2Zm6_6RP-seA"
	}
};