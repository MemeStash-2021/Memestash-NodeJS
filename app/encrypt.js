const bcrypt = require("bcrypt");
const cmd = require("command-line-args");
const fs = require("fs");
require("colors");

const optionDefinitions = [
	{name: "input", alias: "i", type: String}
];
const saltRounds = 10;
const options = cmd(optionDefinitions);

bcrypt.hash(options.input, saltRounds).then((hash, err) =>{
	if (err === null){
		console.log("Unable to hash input:".bold.red, `${err}`);
	} else{
		fs.writeFile("export/hashs.txt",`${options.input}: ${hash}`, (err) => {
			(err)
				? console.log(`Something went wrong! Error: ${err.message}`)
				: console.log(`${options.input}'s hash is:\n`.underline, `${hash}`.yellow);
		});
	}
});