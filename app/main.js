//Node Constants
const ws = require("./config/ws.js");
const OpenApiValidator = require("express-openapi-validator");
const cors = require("cors");
const {errorHandler} = require("./errors/errorHandlers");
const swaggerUi = require("swagger-ui-express");
const YAMLConverter = require("yamljs");
require("colors");

//Express Routers
const users = require("./data/routes/userRouter");
const auth = require("./data/routes/authRouter");
const cards = require("./data/routes/cardRouter");
const userCards = require("./data/routes/userCardsRouter");
const chats = require("./data/routes/chatRouter");

init();

function init() {
	ws.app.use(cors());
	ws.app.options("*", cors());
	ws.app.use(ws.express.json());
	ws.app.use(ws.express.urlencoded({extended: false}));
	ws.app.use(OpenApiValidator.middleware({
		apiSpec: "./app/openapi.yaml",
		validateRequests: true,
		validateApiSpec: true
	}));
	const jsSpec = YAMLConverter.load("./app/openapi.yaml");
	ws.app.use("/spec", swaggerUi.serve, swaggerUi.setup(jsSpec, ws.swaggerOptions));
	initRouters();
	ws.app.use(errorHandler);
	console.log("Express is", "configured.".green);
	/*Start Webserver*/
	ws.server.listen(ws.port, () => {
		console.log("Server is running on", `${ws.port}`.yellow);
	});
}

function initRouters() {
	ws.app.use("/api/users", users);
	ws.app.use("/api/users", auth);
	ws.app.use("/api/cards", cards);
	ws.app.use("/api/users", userCards);
	ws.app.use("/api/users", chats);
}



