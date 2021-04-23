"use strict";

exports.log200 = (req) => {
	console.log("200".yellow, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", "OK".bold.green);
};

exports.log201 = (req) => {
	console.log("201".yellow, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", "Created".bold.green);
};

exports.log404 = (req, message) => {
	console.log("404".red, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", message);
};

exports.log500 = (req) => {
	console.log("500".bold.red, `${req.method} ${req.baseUrl + req.url}`.bold, ": ", "Internal Server Error".bold.bgRed.white);
};