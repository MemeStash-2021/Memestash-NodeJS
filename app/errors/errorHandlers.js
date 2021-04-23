"use strict";

exports.openAPIErrorHandler = (err, req, res, next) => {
	res.status(err.status || 500).json({
		request: `${req.method} ${req.baseUrl + req.url}`,
		message: prettier(err),
	});
};

exports.defaultErrorHandler = (err, req, res, next) => {
	res.status(err.status).json({
		request: `${req.method} ${req.baseUrl + req.url}`,
		message: err.message,
	});
};

function prettier(err){
	switch (err.status){
	case 404: return "Route not found";
	case 400: return `Bad request body: ${err.message}`;
	default: return err.message;
	}
}