const bcrypt = require("bcrypt");
const cmd = require("command-line-args");
require("colors");

const optionDefinitions = [
	{name: "input", alias: "i", type: String}
];
const saltRounds = 10;
const options = cmd(optionDefinitions);

bcrypt.hash(options.input, saltRounds).then((hash, err) =>
	(err === null)
		? console.log("Unable to hash input:".bold.red, `${err}`)
		: console.log(`${options.input}'s hash is:\n`.underline, `${hash}`.yellow)
);
