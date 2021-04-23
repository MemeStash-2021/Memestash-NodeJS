"use strict";

const {LogicError} = require("./error");

exports.errorHandler = (err, req, res, next) => {
	if(err instanceof LogicError){
		logicErrorHandler(err, req, res, next);
	} else{
		openAPIErrorHandler(err, req, res, next);
	}
	log(err.status, req, err.message);
};


function openAPIErrorHandler(err, req, res, next){
	res.status(err.status || 500).json({
		request: `${req.method} ${req.baseUrl + req.url}`,
		message: prettier(err),
	});
}

function logicErrorHandler(err, req, res, next){
	res.status(err.status).json({
		request: `${req.method} ${req.baseUrl + req.url}`,
		message: err.message,
	});
}

function prettier(err){
	switch (err.status){
	case 404: return "Route not found";
	case 400: return `Bad request body: ${err.message}`;
	default: return err.message;
	}
}

function log(code, req, msg){
	switch (code){
	case(400): console.log("409".bold.red, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", msg); break;
	case(404): console.log("404".bold.red, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", msg); break;
	case(409): console.log("409".bold.red, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", msg); break;
	default: console.log("500".bold.red, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", msg.bold.bgRed.white); break;
	}
}