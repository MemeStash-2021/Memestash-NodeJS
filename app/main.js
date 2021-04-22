//Node Constants
const ws = require("./config/ws.js");
const OpenApiValidator = require("express-openapi-validator");
const cors = require("cors");
require("colors");

//Express Routers
const users = require("./data/users/router");
const auth = require("./data/auth/router");
const cards = require("./data/cards/cardRouter");
const userCards = require("./data/cards/userRouter");

init();

function init() {
	/*Set up parsers*/
	ws.app.use(ws.express.json());
	ws.app.use(ws.express.urlencoded({extended: false}));
	/*Set up validator*/
	ws.app.use(OpenApiValidator.middleware({
		apiSpec: "./app/openapi.yaml",
		validateRequests: true,
		validateApiSpec: true
	}));
	/*Set up CORS Handler*/
	ws.app.use(cors());
	/*Set up Validator Handler*/
	ws.app.use((err, req, res, next) => {
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
		console.log(`${err.status}`.red, `${req.method}`.bold, `${req.url} :  `.bold, `${err.message}`.red);
	});
	/*Start routers*/
	initRouters();
	console.log("Express is", "configured.".green);
	/*Start Webserver*/
	ws.server.listen(ws.port, () => {
		console.log("Server is running on", `${ws.port}`.yellow);
	});
}

function initRouters() {
	ws.app.use("/users", users);
	ws.app.use("/users", auth);
	ws.app.use("/cards", cards);
	ws.app.use("/users", userCards);
}



