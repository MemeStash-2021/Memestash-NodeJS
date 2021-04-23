"use strict";

exports.log200 = (method, address) => {
	console.log("200".yellow, `${method} ${address}`.bold, ": ", "OK".bold.green);
};

exports.log201 = (method, address) => {
	console.log("201".yellow, `${method} ${address}`.bold, ": ", "Created".bold.green);
};

exports.log404 = (method, address, message) => {
	console.log("404".red, `${method} ${address}`.bold, ": ", message);
};

exports.log500 = (method, address) => {
	console.log("500".bold.red, `${method} ${address}`.bold, ": ", "Internal Server Error".bold.bgRed.white);
};