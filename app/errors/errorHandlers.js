"use strict";

const {LogicError} = require("./error");

exports.errorHandler = (err, req, res, next) => {
	if(err instanceof LogicError){
		logicErrorHandler(err, req, res, next);
	} else{
		openAPIErrorHandler(err, req, res, next);
	}
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