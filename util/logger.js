const chalk = require('chalk');
const println = console.log;

require('dotenv').config();

const log = function(msg) {
	// if(process.env.DEBUG === true){
	println(chalk.black.bgWhite(msg));
	// }
	// else
	// {
	//     // Add sentry
	// }
};

const error = function(msg) {
	// if(process.env.DEBUG === true){
	println(chalk.black.bgRed(msg));
	// }
	// else
	// {
	//     // Add sentry
	// }
};

const warn = function(msg) {
	// if(process.env.DEBUG === true){
	println(chalk.black.bgYellow(msg));
	// }
	// else
	// {
	//     // Add sentry
	// }
};

const success = function(msg) {
	// if(process.env.DEBUG === true){
	println(chalk.black.bgGreen(msg));
	// }
	// else
	// {
	// }
};

module.exports = {
	log: log,
	warn: warn,
	success: success,
	error: error,
};