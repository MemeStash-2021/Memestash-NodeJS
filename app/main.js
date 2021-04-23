//Node Constants
const ws = require("./config/ws.js");
const OpenApiValidator = require("express-openapi-validator");
const cors = require("cors");
const {errorHandler} = require("./errors/errorHandlers");
require("colors");

//Express Routers
const users = require("./data/users/router");
const auth = require("./data/auth/router");
const cards = require("./data/cards/cardRouter");
const userCards = require("./data/cards/userRouter");
const chats = require("./data/chat/router");

init();

function init() {
	ws.app.use(ws.express.json());
	ws.app.use(ws.express.urlencoded({extended: false}));
	ws.app.use(OpenApiValidator.middleware({
		apiSpec: "./app/openapi.yaml",
		validateRequests: true,
		validateApiSpec: true
	}));
	ws.app.use(cors());
	initRouters();
	ws.app.use(errorHandler);
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
	ws.app.use("/users", chats);
}



